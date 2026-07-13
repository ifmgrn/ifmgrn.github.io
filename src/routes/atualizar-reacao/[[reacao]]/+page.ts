import { isBrowser } from "@supabase/ssr";
import { redirect } from "@sveltejs/kit";
import { goto } from "$app/navigation";

export async function load({ params, parent }) {
	const { reacao: reactionParam } = params;

	const { supabase, userMetadata, session } = await parent();
	if (!(session && userMetadata?.suap_id)) {
		if (isBrowser()) {
			goto("/");
			return;
		}
		redirect(308, "/");
	}

	if (reactionParam) {
		const { data: reaction } = await supabase
			.rpc("get_reaction_by_slug", {
				reaction_slug: reactionParam,
			})
			.single();

		if (reaction && reaction.user_id !== userMetadata.suap_id) {
			if (isBrowser()) {
				goto("/");
			} else {
				redirect(308, "/");
			}
		}

		return { reaction };
	}

	return { reaction: null };
}
