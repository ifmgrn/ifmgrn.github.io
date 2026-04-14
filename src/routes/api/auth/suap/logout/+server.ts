export async function POST({ locals: { supabase } }) {
	await supabase.auth.signOut({ scope: "local" });
	return new Response(null, { status: 200 });
}
