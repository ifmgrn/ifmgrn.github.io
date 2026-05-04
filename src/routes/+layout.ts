import { createBrowserClient, isBrowser } from "@supabase/ssr";
import {
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_SUPABASE_URL,
} from "$env/static/public";

export async function load({ fetch, depends }) {
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
		: null; /* Não precisamos do cliente `supabase` durante SSR, só em `load` no lado do servidor  */

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const session = supabase
		? (await supabase.auth.getSession()).data.session
		: null;

	const userMetadata = session?.user.user_metadata as UserMetadata | null;

	return { supabase, session, userMetadata };
}
