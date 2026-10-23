import { isBrowser } from "@supabase/ssr"
import { redirect } from "@sveltejs/kit"
import { STATUS_CODE } from "#lib/consts.js"
import { unwrap } from "#lib/utils.ts"
import { goto } from "$app/navigation"

export async function load({ params, parent }) {
  const { reacao: reactionParam } = params

  const { supabase, userData, claims } = await parent()
  if (!(claims && userData?.suap_id)) {
    if (isBrowser()) {
      goto("/")
      return
    }
    redirect(308, "/")
  }

  if (reactionParam) {
    const reaction = await unwrap(() =>
      supabase
        .rpc("get_reaction_by_slug", {
          reaction_slug: reactionParam,
        })
        .single(),
    )

    if (reaction && reaction.user_id !== userData.suap_id) {
      if (isBrowser()) {
        goto("/")
      } else {
        redirect(STATUS_CODE.PERMANENT_REDIRECT, "/")
      }
    }

    return { reaction }
  }

  return { reaction: null }
}
