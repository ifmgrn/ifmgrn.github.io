import { isBrowser } from "@supabase/ssr";
import { writable } from "svelte/store";

const user = writable<SuapUser | null | undefined>(undefined);

user.subscribe((value) => {
	if (isBrowser()) {
		if (value) localStorage.setItem("user_data", JSON.stringify(value));
		else if (value === null) {
			localStorage.removeItem("user_data");
		}
	}
});

export { user };
