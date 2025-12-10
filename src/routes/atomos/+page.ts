export async function load({ parent }) {
	const { supabase } = await parent();

	const { data: atoms, error } = await supabase
		.from("atoms")
		.select(
			"atomic_number, symbol, period, group, chemical_serie, name, atomic_weight, state, short_lived",
		);

	if (error) throw error;
	return { atoms };
}
