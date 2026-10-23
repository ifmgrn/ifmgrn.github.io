import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database, Tables } from "./database.ts"

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>
    }
    // Sveltekit is capable of generating PageData type automatically
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  type Strict<T> = { [k: string]: never } & { [K in keyof T]: T[K] }
  type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
  type SomeKeys<T, K extends keyof T> = K

  interface UserData {
    auth_id: string
    suap_id: number
    name: string
    ra: string
    role: string
    photo_relurl: string | null
  }

  type Reaction = ArrayElement<Database["public"]["Functions"]["search_reactions"]["Returns"]>

  type Atom = Tables<"atoms">
}
