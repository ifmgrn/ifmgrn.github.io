import { BYPASS_TOKEN } from "$env/static/private";
import { parseReaction } from "$lib/mhchem";

export const actions = {
	default: async ({ request, locals, fetch }) => {
		const { session, user } = await locals.safeGetSession();
		if (!(session && user)) {
			return;
		}

		const data = await request.formData();

		const name = data.get("name");
		const videoUrlStr = data.get("video_url");
		const equation = data.get("equation");
		const instructions = data.get("instructions");
		const classifications = String(data.get("classifications") ?? "")
			.split(",")
			.map((s) => s.trim());

		if (!(name && videoUrlStr && equation && instructions)) {
			return;
		}

		const videoUrl = new URL(String(videoUrlStr));
		const videoId =
			videoUrl.searchParams.get("v") ?? videoUrl.pathname.split("/", 3)[1];
		if (!videoId) {
			return;
		}

		const reaction = parseReaction(equation);
		if (
			!reaction ||
			reaction.reactants.length === 0 ||
			reaction.products.length === 0
		) {
			return;
		}

		const { data: userId } = await locals.supabase
			.from("suap_users")
			.select("suap_id, auth_id")
			.eq("auth_id", user.id)
			.single();

		const { error } = await locals.supabase.from("reactions").insert({
			name,
			youtube_video_id: videoId,
			equation,
			description: instructions,
			user_id: userId.suap_id,
			classifications,
			reactants: reaction.reactants,
			products: reaction.products,
			catalysts: reaction.catalysts,
		});

		if (!error) {
			await fetch("/reacoes", {
				method: "HEAD",
				headers: {
					"x-prerender-revalidate": BYPASS_TOKEN,
				},
			});
		}
	},
};
