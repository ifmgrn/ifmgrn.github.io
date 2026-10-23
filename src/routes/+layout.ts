import { createBrowserClient, createServerClient, isBrowser } from "@supabase/ssr"
import type { Database } from "#lib/types/database.d.ts"
import { unwrap } from "#lib/utils.ts"
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "$app/env/public"

export async function load({ fetch, depends, data }) {
  depends("supabase:auth")

  const supabase = isBrowser()
    ? createBrowserClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll: () => data.cookies,
        },
      })

  /**
   * `getClaims` validates the JWT signature locally (for asymmetric keys) once
   * the relevant signing keys are available or cached, and returns the decoded
   * claims. While an initial or periodic network request may be required to
   * fetch or refresh keys, this is both faster and safer than `getSession`,
   * which does not validate the JWT.
   */
  const { claims } = (await unwrap(() => supabase.auth.getClaims())) ?? {}

  let userData: UserData | null = null
  if (claims && isBrowser()) {
    userData = await unwrap(() =>
      supabase
        .from("suap_users")
        .select("suap_id, auth_id, name, ra, role, photo_relurl")
        .eq("auth_id", claims.sub)
        .single(),
    )
  }

  return { supabase, claims, userData }
}
