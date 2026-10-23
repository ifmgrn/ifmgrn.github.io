import slugify from "@sindresorhus/slugify"
import { fail, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { valibot } from "sveltekit-superforms/adapters"
import * as v from "valibot"
import { STATUS_CODE } from "#lib/consts.js"
import { parseReaction } from "#lib/mhchem.js"
import { isEquationValid, truthy, unwrap } from "#lib/utils.ts"
import { BYPASS_TOKEN } from "$app/env/private"

export const config = {
  isr: false,
}

const updateReactionSchema = v.objectAsync({
  id: v.optional(
    v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty("O ID é obrigatório."),
      v.digits("O ID da reação precisa ser um número válido."),
      v.toNumber(),
      v.minValue(0, "O ID não pode ser negativo."),
      v.maxValue(32_767, "O ID é inválido."),
    ),
  ),
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("O nome é obrigatório."),
    v.minLength(3, "O nome deve ter pelo menos 3 caracteres."),
    v.maxLength(70, "O nome não pode passar de 70 caracteres."),
  ),

  video_url: v.pipeAsync(
    v.string(),
    v.trim(),
    v.nonEmpty("A URL do vídeo é obrigatória."),
    v.minLength(20, "A URL do vídeo é muito curta para ser válida."),
    v.maxLength(100, "A URL do vídeo é longa demais."),
    v.rawTransform(({ dataset, addIssue, NEVER }) => {
      const match = dataset.value.match(
        /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)(?<videoId>[A-Za-z0-9_-]{11})(?=$|[?&#/])(?:[?&#/].*)?$/i,
      )

      if (!match?.groups?.videoId) {
        addIssue({
          message: "A URL do vídeo é inválida (não é uma URL do YouTube ou não tem um ID).",
        })
        return NEVER
      }

      return match.groups.videoId
    }),
    v.checkAsync(async id => {
      const url = new URL("https://www.youtube.com/oembed")
      url.searchParams.set("url", `https://www.youtube.com/watch?v=${id}`)
      url.searchParams.set("format", "json")

      try {
        const res = await fetch(url)
        return res.ok
      } catch (e) {
        console.error(e)
        return false
      }
    }, "O vídeo não existe ou não está acessível no YouTube."),
  ),
  equation: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("A equação é obrigatória."),
    v.maxLength(200, "A equação não pode ter mais de 200 caracteres."),
    v.check(isEquationValid, "A equação química é inválida."),
    v.rawTransform(({ dataset, addIssue, NEVER }) => {
      const reaction = parseReaction(dataset.value)
      if (reaction.reactants.length === 0 || reaction.products.length === 0) {
        addIssue({
          message: "A equação química não tem reagentes ou produtos.",
        })
        return NEVER
      }
      return { ...reaction, equation: dataset.value }
    }),
  ),

  description: v.optional(
    v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(10_000, "A descrição não pode passar de 10.000 caracteres."),
    ),
  ),

  classifications: v.optional(
    v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(100, "A lista de classificações é longa demais."),
      v.transform(val => (val ? val.split(",").map(s => s.trim()) : [])),
    ),
    "",
  ),
})

const failure = (msg: string) =>
  fail(STATUS_CODE.BAD_REQUEST, {
    error: msg,
  })

export const actions = {
  update: async ({ request, locals: { supabase }, fetch }) => {
    const { claims } = (await unwrap(() => supabase.auth.getClaims())) ?? {}
    if (!claims) {
      return failure("Usuario não está logado.")
    }

    const form = await superValidate(request, valibot(updateReactionSchema))
    if (!form.valid) {
      return fail(STATUS_CODE.BAD_REQUEST, { form })
    }

    const { id, name, video_url: videoId, equation, description, classifications } = form.data

    const userId = truthy(
      await unwrap(() =>
        supabase.from("suap_users").select("suap_id, auth_id").eq("auth_id", claims.sub).single(),
      ),
      "Usuário local não existe no servidor.",
    )

    const reaction = id
      ? await unwrap(() =>
          supabase.from("reactions").select("id, user_id, slug").eq("id", id).single(),
        )
      : null
    if (reaction && reaction.user_id !== userId.suap_id) {
      return failure("Usuário não pode editar esta reação.")
    }

    const base = slugify(name)
    let slug = base

    if (!reaction?.slug || slugify(name) !== slugify(reaction.slug)) {
      const slugs =
        (await unwrap(() => supabase.from("reactions").select("slug").like("slug", `${base}%`))) ??
        []

      const used = new Set(slugs.map(row => row.slug))
      if (used.has(base)) {
        let n = 2
        while (used.has(`${base}-${n}`)) {
          n++
        }
        slug = `${base}-${n}`
      }
    } else {
      slug = reaction.slug
    }

    await unwrap(() =>
      supabase.from("reactions").upsert({
        id,
        name,
        slug,
        youtube_video_id: videoId,
        equation: equation.equation,
        description,
        user_id: userId.suap_id,
        classifications,
        reactants: equation.reactants,
        products: equation.products,
        catalysts: equation.catalysts,
      }),
    )

    await fetch("/reacoes", {
      method: "HEAD",
      headers: {
        "x-prerender-revalidate": BYPASS_TOKEN,
      },
    })

    const finalUrl = `/reacao/${slug}`
    await fetch(finalUrl, {
      method: "HEAD",
      headers: {
        "x-prerender-revalidate": BYPASS_TOKEN,
      },
    })

    if (reaction && reaction.slug !== slug) {
      await fetch(`/reacao/${reaction.slug}`, {
        method: "HEAD",
        headers: {
          "x-prerender-revalidate": BYPASS_TOKEN,
        },
      })
    }

    redirect(STATUS_CODE.SEE_OTHER, "/reacoes")
  },
  delete: async ({ locals: { supabase }, params, fetch }) => {
    const reactionSlug = truthy(params.reacao, 'O parâmetro "reacao" não foi fornecido.')

    const { claims } = (await unwrap(() => supabase.auth.getClaims())) ?? {}
    if (!claims) {
      return failure("Usuario não está logado.")
    }

    const userId = truthy(
      await unwrap(() =>
        supabase.from("suap_users").select("suap_id, auth_id").eq("auth_id", claims.sub).single(),
      ),
      "Usuário local não existe no servidor.",
    )

    const reaction = await unwrap(() =>
      supabase.from("reactions").select("id, user_id, slug").eq("slug", reactionSlug).single(),
    )
    if (!reaction) {
      return failure("A reação não existe no servidor.")
    }
    if (reaction.user_id !== userId.suap_id) {
      return failure("Usuário não pode editar esta reação.")
    }

    await unwrap(() => supabase.from("reactions").delete().eq("id", reaction.id))

    await fetch("/reacoes", {
      method: "HEAD",
      headers: {
        "x-prerender-revalidate": BYPASS_TOKEN,
      },
    })

    try {
      await fetch(`/reacao/${params.reacao}`, {
        method: "HEAD",
        headers: {
          "x-prerender-revalidate": BYPASS_TOKEN,
        },
      })
    } catch {}

    redirect(STATUS_CODE.SEE_OTHER, "/reacoes")
  },
}
