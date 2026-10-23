import { createClient } from "@supabase/supabase-js"
import { error, redirect } from "@sveltejs/kit"
import { ERROR, STATUS_CODE } from "#lib/consts.ts"
import type { SuapUserData } from "#lib/suap.d.ts"
import type { Database } from "#lib/types/database.d.ts"
import { SUAP_CLIENT_SECRET, SUPABASE_SECRET_KEY } from "$app/env/private"
import { SUAP_CLIENT_ID, SUAP_REDIRECT_URI, SUPABASE_URL } from "$app/env/public"
import { getRequestEvent } from "$app/server"
import { unwrap } from "../utils.ts"

const BASE_URL = "https://suap.ifmg.edu.br"
const AUTHORIZATION_RELATIVE_URL = "/o/authorize/"
const TOKEN_RELATIVE_URL = "/o/token/"
const USER_INFO_RELATIVE_URL = "/api/v2/minhas-informacoes/meus-dados/"
const SCOPES = ["identificacao"]

const PKCE_VERIFIER_COOKIE = "pkce_verifier"
const STATE_COOKIE = "oauth_state"
const COOKIES_PATH = "/api/auth/suap/callback"

export async function signInWithOauth() {
  const {
    cookies,
    locals: { supabase },
  } = getRequestEvent()

  const claims = await unwrap(() => supabase.auth.getClaims())
  if (claims) {
    error(STATUS_CODE.FORBIDDEN, ERROR.USER_LOGGED_IN)
  }

  /* Supabase custom OAuth does not work well with SUAP
	 * @see https://github.com/supabase/auth/issues/2519

	const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
		provider: "custom:suap",
	});

	if (!oauthError && data.url) {
		redirect(STATUS_CODE.FOUND, data.url, { external: true });
	}

	throw oauthError;
	*/

  const cookiesMaxAge = 60 * 10

  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  cookies.set(PKCE_VERIFIER_COOKIE, codeVerifier, {
    path: COOKIES_PATH,
    maxAge: cookiesMaxAge,
  })

  const state = crypto.randomUUID()
  cookies.set(STATE_COOKIE, state, {
    path: COOKIES_PATH,
    maxAge: cookiesMaxAge,
  })

  const authorizeUrl = new URL(BASE_URL + AUTHORIZATION_RELATIVE_URL)
  authorizeUrl.searchParams.set("client_id", SUAP_CLIENT_ID)
  authorizeUrl.searchParams.set("code_challenge", codeChallenge)
  authorizeUrl.searchParams.set("code_challenge_method", "S256")
  authorizeUrl.searchParams.set("redirect_uri", SUAP_REDIRECT_URI)
  authorizeUrl.searchParams.set("response_type", "code")
  authorizeUrl.searchParams.set("scope", SCOPES.join(" "))
  authorizeUrl.searchParams.set("state", state)

  redirect(STATUS_CODE.FOUND, authorizeUrl, { external: true })
}

export async function exchangeCodeForSession(next: string) {
  const {
    cookies,
    url,
    fetch,
    locals: { supabase },
  } = getRequestEvent()

  const code = url.searchParams.get("code")
  const returnedState = url.searchParams.get("state")
  const originalState = cookies.get(STATE_COOKIE)
  const codeVerifier = cookies.get(PKCE_VERIFIER_COOKIE)

  // Sempre delete cookies de auth independentemente de erros
  cookies.delete(STATE_COOKIE, { path: COOKIES_PATH })
  cookies.delete(PKCE_VERIFIER_COOKIE, { path: COOKIES_PATH })

  const claims = await unwrap(() => supabase.auth.getClaims())
  if (claims) {
    error(STATUS_CODE.FORBIDDEN, ERROR.USER_LOGGED_IN)
  }

  if (!code) {
    error(STATUS_CODE.BAD_REQUEST, 'A URL não contém o parâmetro "code".')
  }

  if (!returnedState || returnedState !== originalState) {
    error(STATUS_CODE.BAD_REQUEST, 'O parâmetro "state" é inválido.')
  }

  if (!codeVerifier) {
    error(STATUS_CODE.BAD_REQUEST, `O cookie "${PKCE_VERIFIER_COOKIE}" não foi definido.`)
  }

  const tokenRes = await fetch(BASE_URL + TOKEN_RELATIVE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: SUAP_CLIENT_ID,
      redirect_uri: SUAP_REDIRECT_URI,
      client_secret: SUAP_CLIENT_SECRET,
      code_verifier: codeVerifier,
    }),
  })

  const tokenData = (await tokenRes.json()) as {
    access_token: string
    // 3600s = 1h
    expires_in: number
    // Bearer
    token_type: string
    scope: string
    refresh_token: string
  }
  if (!tokenData.access_token) {
    error(STATUS_CODE.BAD_REQUEST, "SUAP não retornou um token de acesso.")
  }

  const userRes = await fetch(BASE_URL + USER_INFO_RELATIVE_URL, {
    headers: {
      Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
    },
  })
  if (!userRes.ok) {
    error(STATUS_CODE.BAD_REQUEST, "Não foi possível pegar os dados do usuário no SUAP.")
  }

  const suapUser: SuapUserData = await userRes.json()

  if (suapUser.vinculo.campus.toLowerCase() !== "ribeirao das neves") {
    error(STATUS_CODE.FORBIDDEN, "Não estamos aceitando usuários de outros campi.")
  }

  const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })

  const userAuth = await unwrap(() =>
    supabaseAdmin.from("suap_users").select("suap_id, auth_id").eq("suap_id", suapUser.id).single(),
  )

  let authId: string | undefined
  if (userAuth) {
    const auth = await unwrap(() =>
      supabaseAdmin.auth.admin.updateUserById(userAuth.auth_id, {
        email: suapUser.email,
        email_confirm: true,
      }),
    )
    authId = auth.user.id
  } else {
    const auth = await unwrap(() =>
      supabaseAdmin.auth.admin.createUser({
        email: suapUser.email,
        email_confirm: true,
      }),
    )
    authId = auth.user.id
  }

  await unwrap(() =>
    supabaseAdmin.from("suap_users").upsert({
      auth_id: authId,
      suap_id: suapUser.id,
      ra: suapUser.matricula,
      name: suapUser.vinculo.nome,
      role: ("categoria" in suapUser.vinculo
        ? suapUser.vinculo.categoria
        : suapUser.tipo_vinculo
      ).toLowerCase(),
      photo_relurl: suapUser.url_foto_150x200,
    }),
  )

  const magicLink = await unwrap(() =>
    supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: suapUser.email,
    }),
  )

  await unwrap(() =>
    supabase.auth.verifyOtp({
      token_hash: magicLink.properties.hashed_token,
      type: "email",
    }),
  )

  redirect(STATUS_CODE.SEE_OTHER, next)
}

function base64url(buffer: Uint8Array) {
  return Buffer.from(buffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function generateCodeVerifier() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)

  return base64url(bytes)
}

async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)

  const digest = await crypto.subtle.digest("SHA-256", data)

  return base64url(new Uint8Array(digest))
}
