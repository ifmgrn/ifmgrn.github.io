import { json } from "@sveltejs/kit";

export async function GET({ params }) {
	const url = `https://i.ytimg.com/vi_webp/${params.id}/sddefault.webp`;

	const res = await fetch(url, { method: "HEAD" });

	return json(
		{
			webpUrl: res.ok ? url : null,
		},
		{
			headers: {
				"Cache-Control": "public, max-age=3600", // 1 hour
			},
		},
	);
}
