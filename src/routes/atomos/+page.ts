import { unwrap } from "#lib/utils.ts"

export async function load({ parent }) {
  const { supabase } = await parent()

  const atoms = await unwrap(() => supabase.from("atoms").select())

  return { atoms }
}
