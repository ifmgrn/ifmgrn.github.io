import { unwrap } from "#lib/utils.ts"

export async function POST({ locals: { supabase } }) {
  await unwrap(() => supabase.auth.signOut({ scope: "local" }))
  return Response.json({})
}
