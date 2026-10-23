import { error } from "@sveltejs/kit"
import { STATUS_CODE } from "#lib/consts.ts"
import { unwrap } from "#lib/utils.ts"

export async function load({ params, parent }) {
  const { reacao: reactionParam } = params

  const { supabase, userData } = await parent()

  const reaction = await unwrap(() =>
    supabase
      .rpc("get_reaction_by_slug", {
        reaction_slug: reactionParam,
      })
      .single(),
  )
  if (!reaction) {
    error(STATUS_CODE.BAD_REQUEST, "A reação não existe.")
  }

  return { reactionParam, reaction, userData }
}
