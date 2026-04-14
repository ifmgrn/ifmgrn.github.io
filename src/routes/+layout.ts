import { createBrowserClient, isBrowser } from "@supabase/ssr";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
import { get } from "svelte/store";
import { getCookie, removeCookie } from "tiny-cookie";
import {
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { user } from "$lib/stores/user";
import type { LayoutLoad } from "./$types";

injectSpeedInsights();

export const load: LayoutLoad = async ({ fetch, depends }) => {
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
		: null;

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const session = supabase
		? (await supabase.auth.getSession()).data.session
		: null;
	let userData = null;

	if (session) {
		userData = get(user);
		if (!userData) {
			const cookie = getCookie("user_data");
			if (cookie) {
				removeCookie("user_data");

				try {
					userData = JSON.parse(cookie);
					user.set(userData);
				} catch {
					// continue regardless of error
				}
			} else {
				const data = localStorage.getItem("user_data");
				if (data) {
					try {
						userData = JSON.parse(data);
						user.set(userData);
					} catch {
						// continue regardless of error
					}
				}
			}
		}
	}

	return { supabase, session, userData };
};
