import { error } from "@sveltejs/kit";
import { STATUS_CODE } from "$lib/consts";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
	const { reacao } = params;

	const { supabase } = await parent();

	const { data: reaction }: { data: Reaction | null } = await supabase
		.rpc("get_reaction_by_id", {
			reaction_id: reacao,
		})
		.single();
	if (!reaction) error(STATUS_CODE.BAD_REQUEST, "A reação não existe.");

	// You can fetch data or process the params
	return { reaction };
};
