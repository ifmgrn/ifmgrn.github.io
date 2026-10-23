import { createServerClient } from "@supabase/ssr"
import type { Database } from "#lib/types/database.d.ts"
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "$app/env/public"

export async function handle({ event, resolve }) {
  event.locals.supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          event.cookies.set(name, value, options)
        }
        if (Object.keys(headers).length > 0) {
          event.setHeaders(headers)
        }
      },
    },
  })

  return resolve(event, {
    filterSerializedResponseHeaders: name =>
      name === "content-range" || name === "x-supabase-api-version",
  })
}
