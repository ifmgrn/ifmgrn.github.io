import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({
	locals: { safeGetSession },
	cookies,
}) => {
	const { session, user } = await safeGetSession();

	const userDataCookie = cookies.get("user_data");
	let userData: SuapUser | null = null;

	if (userDataCookie) {
		try {
			userData = JSON.parse(userDataCookie);
		} catch {
			// invalid cookie, ignore
			userData = null;
		}
	}

	return {
		session,
		user,
		userData,
		cookies: cookies.getAll(),
	};
};
