import {
	createBrowserClient,
	createServerClient,
	isBrowser,
} from "@supabase/ssr";
import {
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { URL_PARAMS } from "$lib/consts";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends, url }) => {
	depends("supabase:auth");

	const supabase = isBrowser()
		? createBrowserClient(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_PUBLISHABLE_KEY,
				{
					global: {
						fetch,
					},
				},
			)
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global: {
					fetch,
				},
				cookies: {
					getAll() {
						return data.cookies;
					},
				},
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session },
	} = await supabase.auth.getSession();

	let theme = url.searchParams.get(URL_PARAMS.THEME) ?? "claro";
	if (!["claro", "escuro"].includes(theme.toLowerCase())) theme = "claro";

	return { supabase, session, userData: data.userData, theme };
};
