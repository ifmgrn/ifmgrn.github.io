import slugify from "@sindresorhus/slugify";
import { fail, redirect } from "@sveltejs/kit";
import { BYPASS_TOKEN } from "$env/static/private";
import { parseReaction } from "$lib/mhchem";
import { isEquationValid } from "$lib/utils";

export const config = {
	isr: false,
};

export const actions = {
	update: async ({ request, locals, fetch }) => {
		const { session, user } = await locals.safeGetSession();
		if (!(session && user)) {
			return fail(400, {
				error: "Usuario não está logado.",
			});
		}

		const data = await request.formData();

		const reactionId = data.get("id") as string;
		const name = data.get("name") as string;
		let videoUrlStr = data.get("video_url") as string;
		if (!/^https?:\/\//i.test(videoUrlStr)) {
			videoUrlStr = `https://${videoUrlStr}`;
		}
		const equation = data.get("equation") as string;
		const instructions = data.get("instructions") as string;
		const classifications = String(data.get("classifications") ?? "")
			.split(",")
			.map((s) => s.trim());

		if (!(name && videoUrlStr && equation && instructions)) {
			return fail(400, {
				error: "Alguns campos não foram fornecidos.",
			});
		}

		let url: URL;

		try {
			url = new URL(videoUrlStr);
		} catch {
			return fail(400, {
				error: "URL de video inválida.",
			});
		}

		const host = url.hostname.toLowerCase();

		if (
			!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(
				host,
			)
		) {
			return fail(400, {
				error: "URL de video não é do YouTube.",
			});
		}

		let id: string | null = null;

		if (host === "youtu.be") {
			id = url.pathname.slice(1);
		} else {
			const path = url.pathname;

			if (path === "/watch") {
				id = url.searchParams.get("v");
			} else if (path.startsWith("/shorts/")) {
				id = path.split("/")[2];
			} else if (path.startsWith("/live/")) {
				id = path.split("/")[2];
			} else if (path.startsWith("/embed/")) {
				id = path.split("/")[2];
			}
		}

		// YouTube video IDs are currently 11 characters.
		if (
			!id ||
			id.length < 5 ||
			id.length > 20 ||
			!/^[A-Za-z0-9_-]+$/.test(id)
		) {
			return fail(400, {
				error: "ID do video não parece válido.",
			});
		}

		if (!isEquationValid(equation)) {
			return fail(400, {
				error: "Equação química inválida.",
			});
		}

		const reaction = parseReaction(equation);
		if (
			!reaction ||
			reaction.reactants.length === 0 ||
			reaction.products.length === 0
		) {
			return fail(400, {
				error: "Equação química não contém reagentes ou produtos.",
			});
		}

		const { data: userId } = await locals.supabase
			.from("suap_users")
			.select("suap_id, auth_id")
			.eq("auth_id", user.id)
			.single();

		let oldSlug: string | null = null;

		if (reactionId) {
			const { data: oldReaction } = await locals.supabase
				.from("reactions")
				.select("id, user_id, slug")
				.eq("id", reactionId)
				.single();
			if (oldReaction?.user_id !== userId.suap_id) {
				return fail(400, {
					error: "Usuário não pode editar esta reação.",
				});
			}
			oldSlug = oldReaction.slug;
		}

		const base = slugify(name);
		let slug: string = base;

		// Only calculate a completely new unique slug if the name altered (or if it's a new entry)
		if (!oldSlug || slugify(name) !== slugify(oldSlug)) {
			const { data: slugs, error: slugError } = await locals.supabase
				.from("reactions")
				.select("slug")
				.like("slug", `${base}%`);

			if (slugError) {
				throw slugError;
			}

			const used = new Set(slugs.map((row: { slug: string }) => row.slug));
			if (used.has(base)) {
				let n = 2;
				while (used.has(`${base}-${n}`)) {
					n++;
				}
				slug = `${base}-${n}`;
			}
		} else {
			slug = oldSlug; // Keep existing slug on clean edits
		}

		if (!slug) {
			throw new Error("Could not generate slug.");
		}

		const { error } = await locals.supabase.from("reactions").upsert({
			id: reactionId ? reactionId : undefined,
			name,
			slug,
			youtube_video_id: id,
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

			const finalUrl = `/reacao/${slug}`;

			await fetch(finalUrl, {
				method: "HEAD",
				headers: {
					"x-prerender-revalidate": BYPASS_TOKEN,
				},
			});

			if (oldSlug && oldSlug !== slug) {
				await fetch(`/reacao/${oldSlug}`, {
					method: "HEAD",
					headers: {
						"x-prerender-revalidate": BYPASS_TOKEN,
					},
				});
			}

			redirect(303, `${finalUrl}#demonstracao`);
		}
	},
	delete: async ({ locals, params, fetch }) => {
		const { session, user } = await locals.safeGetSession();
		if (!(session && user)) {
			return fail(400, {
				error: "Usuario não está logado.",
			});
		}

		const { data: userId } = await locals.supabase
			.from("suap_users")
			.select("suap_id, auth_id")
			.eq("auth_id", user.id)
			.single();

		const { data: reaction } = await locals.supabase
			.from("reactions")
			.select("id, user_id, slug")
			.eq("slug", params.reacao)
			.single();
		if (reaction?.user_id !== userId.suap_id) {
			return fail(400, {
				error: "Usuário não pode editar esta reação.",
			});
		}

		await locals.supabase.from("reactions").delete().eq("id", reaction.id);

		await fetch("/reacoes", {
			method: "HEAD",
			headers: {
				"x-prerender-revalidate": BYPASS_TOKEN,
			},
		});

		try {
			await fetch(`/reacao/${params.reacao}`, {
				method: "HEAD",
				headers: {
					"x-prerender-revalidate": BYPASS_TOKEN,
				},
			});
		} catch {}

		redirect(303, "/reacoes");
	},
};
