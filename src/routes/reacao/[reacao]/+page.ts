import { error } from "@sveltejs/kit";
import { STATUS_CODE } from "$lib/consts";

export async function load({ params, parent }) {
	const { reacao: reactionParam } = params;
	const reactionId = Number.parseInt(reactionParam, 10);
	if (Number.isNaN(reactionId)) {
		error(STATUS_CODE.FORBIDDEN, "The provided reaction is not valid.");
	}

	const { supabase } = await parent();

	const { data: reaction } = await supabase
		.rpc("get_reaction_by_id", {
			reaction_id: reactionId,
		})
		.single();
	if (!reaction) {
		error(STATUS_CODE.BAD_REQUEST, "A reação não existe.");
	}

	return { reaction };
}
