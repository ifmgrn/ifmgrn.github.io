import { error } from "@sveltejs/kit";
import { STATUS_CODE } from "$lib/consts";

export async function load({ params, locals }) {
	const { reacao } = params;

	const { supabase } = locals;

	const { data: reaction }: { data: Reaction | null } = await supabase
		.rpc("get_reaction_by_id", {
			reaction_id: reacao,
		})
		.single();
	if (!reaction) {
		error(STATUS_CODE.BAD_REQUEST, "A reação não existe.");
	}

	return { reaction };
}
