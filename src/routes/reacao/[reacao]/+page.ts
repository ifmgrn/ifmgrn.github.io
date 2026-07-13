import { error } from "@sveltejs/kit";
import { STATUS_CODE } from "$lib/consts";

export async function load({ params, parent }) {
	const { reacao: reactionParam } = params;

	const { supabase, userMetadata } = await parent();

	const { data: reaction } = await supabase
		.rpc("get_reaction_by_slug", {
			reaction_slug: reactionParam,
		})
		.single();
	if (!reaction) {
		error(STATUS_CODE.BAD_REQUEST, "A reação não existe.");
	}

	return { reactionParam, reaction, userMetadata };
}
