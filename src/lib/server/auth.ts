import { createClient } from "@supabase/supabase-js";
import { error, redirect } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import { SUAP_CLIENT_SECRET, SUPABASE_SECRET_KEY } from "$env/static/private";
import {
	PUBLIC_SUAP_CLIENT_ID,
	PUBLIC_SUAP_REDIRECT_URI,
	PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { STATUS_CODE } from "$lib/consts";
import type { SuapUserData } from "$lib/suap";

const BASE_URL = "https://suap.ifmg.edu.br";
const AUTHORIZATION_RELATIVE_URL = "/o/authorize/";
const TOKEN_RELATIVE_URL = "/o/token/";
const USER_INFO_RELATIVE_URL = "/api/v2/minhas-informacoes/meus-dados/";
const SCOPES = ["identificacao"];

const PKCE_VERIFIER_COOKIE = "pkce_verifier";
const STATE_COOKIE = "oauth_state";

function base64url(buffer: Uint8Array) {
	return Buffer.from(buffer)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function generateCodeVerifier() {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);

	return base64url(bytes);
}

async function generateCodeChallenge(verifier: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);

	const digest = await crypto.subtle.digest("SHA-256", data);

	return base64url(new Uint8Array(digest));
}

export async function signInWithOauth() {
	const request = getRequestEvent();
	if (request.locals.user) {
		error(403, "User is already logged in.");
	}

	const cookiesMaxAge = 60 * 10;

	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);
	request.cookies.set(PKCE_VERIFIER_COOKIE, codeVerifier, {
		path: "/",
		maxAge: cookiesMaxAge,
	});

	const state = crypto.randomUUID();
	request.cookies.set(STATE_COOKIE, state, {
		path: "/",
		maxAge: cookiesMaxAge,
	});

	const authorizeUrl = new URL(BASE_URL + AUTHORIZATION_RELATIVE_URL);
	authorizeUrl.searchParams.set("client_id", PUBLIC_SUAP_CLIENT_ID);
	authorizeUrl.searchParams.set("code_challenge", codeChallenge);
	authorizeUrl.searchParams.set("code_challenge_method", "S256");
	authorizeUrl.searchParams.set("redirect_uri", PUBLIC_SUAP_REDIRECT_URI);
	authorizeUrl.searchParams.set("response_type", "code");
	authorizeUrl.searchParams.set("scope", SCOPES.join(" "));
	authorizeUrl.searchParams.set("state", state);

	redirect(STATUS_CODE.FOUND, authorizeUrl);
}

export async function exchangeCodeForSession(next?: string) {
	const request = getRequestEvent();
	if (request.locals.user) {
		error(STATUS_CODE.FORBIDDEN, "User is already logged in.");
	}

	const code = request.url.searchParams.get("code");
	if (!code) {
		error(STATUS_CODE.BAD_REQUEST, "No code was specified in the URL");
	}

	const returnedState = request.url.searchParams.get("state");
	const originalState = request.cookies.get(STATE_COOKIE);
	if (!returnedState || returnedState !== originalState) {
		error(STATUS_CODE.BAD_REQUEST, "Invalid OAuth state");
	}

	const codeVerifier = request.cookies.get(PKCE_VERIFIER_COOKIE);
	if (!codeVerifier) {
		error(STATUS_CODE.BAD_REQUEST, "Invalid PKCE verifier");
	}

	request.cookies.delete(STATE_COOKIE, { path: "/" });
	request.cookies.delete(PKCE_VERIFIER_COOKIE, { path: "/" });

	const tokenRes = await request.fetch(BASE_URL + TOKEN_RELATIVE_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			client_id: PUBLIC_SUAP_CLIENT_ID,
			redirect_uri: PUBLIC_SUAP_REDIRECT_URI,
			client_secret: SUAP_CLIENT_SECRET,
			code_verifier: codeVerifier,
		}),
	});

	const tokenData = await tokenRes.json();
	if (!tokenData?.access_token) {
		error(STATUS_CODE.BAD_REQUEST, "Access token is invalid");
	}

	const userRes = await request.fetch(BASE_URL + USER_INFO_RELATIVE_URL, {
		headers: {
			Authorization: `Bearer ${tokenData.access_token}`,
		},
	});
	if (!userRes.ok) {
		error(STATUS_CODE.BAD_REQUEST, "Code is invalid for SUAP.");
	}

	const suapUser: SuapUserData = await userRes.json();

	if (suapUser.vinculo.campus.toLowerCase() !== "ribeirao das neves") {
		error(
			STATUS_CODE.FORBIDDEN,
			"Não estamos aceitando usuários de outros campi.",
		);
	}

	const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	const userMetadata: UserMetadata = {
		suap_id: suapUser.id,
		ra: suapUser.matricula,
		name: suapUser.vinculo.nome,
		role: ("categoria" in suapUser.vinculo
			? suapUser.vinculo.categoria
			: suapUser.tipo_vinculo
		).toLowerCase(),
		photo_relurl: suapUser.url_foto_150x200,
	};

	const { data: user } = await supabaseAdmin
		.from("suap_users")
		.select("suap_id, auth_id")
		.eq("suap_id", suapUser.id)
		.single();

	// Garante que os nossos dados estão sincronizados com o do SUAP
	let authId: string | undefined;
	if (user) {
		authId = (
			await supabaseAdmin.auth.admin.updateUserById(user.auth_id, {
				email: suapUser.email,
				email_confirm: true,
				user_metadata: userMetadata,
			})
		).data.user?.id;
	} else {
		authId = (
			await supabaseAdmin.auth.admin.createUser({
				email: suapUser.email,
				email_confirm: true,
				user_metadata: userMetadata,
			})
		).data.user?.id;
	}

	if (!authId) {
		throw new Error("Failed at updating user.");
	}

	await supabaseAdmin
		.from("suap_users")
		.upsert({ ...userMetadata, auth_id: authId });

	const { data: magicLink } = await supabaseAdmin.auth.admin.generateLink({
		type: "magiclink",
		email: suapUser.email,
	});

	if (!magicLink.properties?.hashed_token) {
		throw new Error("Failed to generate auth token.");
	}

	// Verify OTP to create session
	await request.locals.supabase.auth.verifyOtp({
		token_hash: magicLink.properties.hashed_token,
		type: "email",
	});

	if (next) {
		redirect(STATUS_CODE.SEE_OTHER, next);
	}
}
