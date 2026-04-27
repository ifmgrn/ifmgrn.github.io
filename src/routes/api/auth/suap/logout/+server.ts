import { json } from "@sveltejs/kit";

export async function POST({ locals: { supabase } }) {
	await supabase.auth.signOut({ scope: "local" });
	return json({});
}
