import { URL_PARAMS } from "#lib/consts.ts"
import { unwrap } from "#lib/utils.ts"

export async function load({ url, parent }) {
  const { supabase } = await parent()

  const query = url.searchParams.get(URL_PARAMS.SEARCH_REACTION) ?? ""
  const reactants = url.searchParams.get(URL_PARAMS.SEARCH_REACTANT) ?? ""
  const products = url.searchParams.get(URL_PARAMS.SEARCH_PRODUCT) ?? ""
  const classifications = url.searchParams.get(URL_PARAMS.SEARCH_CLASSIFICATION) ?? ""

  const reactions = await unwrap(() =>
    supabase.rpc("search_reactions", {
      q: query.trim(),
      l: 10,
      reactants_q: reactants.trim(),
      products_q: products.trim(),
      classification_q: classifications.trim(),
    }),
  )

  return { query, reactants, products, classifications, reactions }
}
