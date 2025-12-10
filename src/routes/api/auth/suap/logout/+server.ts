import { redirect } from "@sveltejs/kit";
import { STATUS_CODE } from "$lib/consts";

export async function GET({ cookies, locals: { supabase } }) {
	await supabase.auth.signOut({ scope: "local" });
	cookies.delete("user_data", { path: "/" });

	redirect(STATUS_CODE.FOUND, "/");
}
