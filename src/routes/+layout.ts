import {
	createBrowserClient,
	createServerClient,
	isBrowser,
} from "@supabase/ssr";
import {
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import type { Database } from "$lib/types/database";
import { strictOmit } from "$lib/utils";

export async function load({ fetch, depends, data }) {
	depends("supabase:auth");

	const supabase = isBrowser()
		? createBrowserClient<Database>(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_PUBLISHABLE_KEY,
				{
					global: {
						fetch,
					},
				},
			)
		: createServerClient<Database>(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_PUBLISHABLE_KEY,
				{
					global: {
						fetch,
					},
					cookies: {
						getAll() {
							return data.cookies;
						},
					},
				},
			);

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session },
	} = await supabase.auth.getSession();

	let userMetadata: null | UserMetadata = null;
	if (data.user) {
		const { data: user } = await supabase
			.from("suap_users")
			.select("auth_id, name, ra, role, photo_relurl")
			.eq("auth_id", data.user.id)
			.single();
		if (user) {
			userMetadata = strictOmit(user, ["auth_id"]) as Strict<UserMetadata>;
		}
	}

	return { supabase, session, userMetadata };
}
