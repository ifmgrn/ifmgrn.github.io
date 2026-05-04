import { URL_PARAMS } from "$lib/consts.js";
//import { reactions } from "$lib/db/reactions";

export async function load({ url, locals }) {
	const { supabase } = locals;

	const query = url.searchParams.get(URL_PARAMS.SEARCH_REACTION) ?? "";
	const reactants = url.searchParams.get(URL_PARAMS.SEARCH_REACTANT) ?? "";
	const products = url.searchParams.get(URL_PARAMS.SEARCH_PRODUCT) ?? "";
	const classifications =
		url.searchParams.get(URL_PARAMS.SEARCH_CLASSIFICATION) ?? "";

	const {
		data: reactions,
		error,
	}: { data: Reaction[] | null; error: unknown } = await supabase.rpc(
		"search_reactions",
		{
			q: query.trim(),
			l: 10,
			reactants_q: reactants.trim(),
			products_q: products.trim(),
			classification_q: classifications.trim(),
		},
	);
	if (error || !reactions) {
		throw error;
	}

	return { query, reactants, products, classifications, reactions };
}
