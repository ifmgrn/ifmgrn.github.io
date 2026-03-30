export async function GET({ locals: { supabase } }) {
	const { error } = await supabase.rpc("ping_db");

	if (error) {
		console.error(error);
		return new Response("error", { status: 500 });
	}

	return new Response(null, { status: 204 });
}
