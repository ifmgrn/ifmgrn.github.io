import { defineEnvVars } from "@sveltejs/kit/env"

export const variables = defineEnvVars({
  SUPABASE_URL: { public: true, static: true },
  SUPABASE_PUBLISHABLE_KEY: { public: true, static: true },
  SUPABASE_SECRET_KEY: { static: true },

  SUAP_CLIENT_ID: { public: true, static: true },
  SUAP_REDIRECT_URI: { public: true, static: true },
  SUAP_CLIENT_SECRET: { static: true },

  BYPASS_TOKEN: { static: true },
})
