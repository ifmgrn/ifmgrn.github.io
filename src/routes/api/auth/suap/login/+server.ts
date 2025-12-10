import { error, redirect } from "@sveltejs/kit";
import {
	PUBLIC_SUAP_CLIENT_ID,
	PUBLIC_SUAP_REDIRECT_URI,
} from "$env/static/public";
import { STATUS_CODE } from "$lib/consts";

export async function GET({ cookies, locals: { isLoggedIn } }) {
	if (await isLoggedIn())
		error(STATUS_CODE.FORBIDDEN, "A user is already logged in.");

	const state = crypto.randomUUID();
	cookies.set("oauth_state", state, {
		path: "/",
		maxAge: 60 * 5,
	});

	const authorizeUrl = new URL("https://suap.ifmg.edu.br/o/authorize/");
	authorizeUrl.searchParams.set("response_type", "code");
	authorizeUrl.searchParams.set("client_id", PUBLIC_SUAP_CLIENT_ID);
	authorizeUrl.searchParams.set("scope", "identificacao");
	authorizeUrl.searchParams.set("redirect_uri", PUBLIC_SUAP_REDIRECT_URI);
	authorizeUrl.searchParams.set("state", state);

	redirect(STATUS_CODE.FOUND, authorizeUrl.toString());
}
