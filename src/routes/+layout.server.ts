import type { Config } from "@sveltejs/adapter-vercel";
import { BYPASS_TOKEN } from "$env/static/private";
import { URL_PARAMS } from "$lib/consts.js";

const SEARCH_PARAMS = Object.entries(URL_PARAMS)
	.filter((p) => p[0].startsWith("SEARCH_"))
	.map((p) => p[1]);

export const config: Config = {
	isr: {
		expiration: false,
		bypassToken: BYPASS_TOKEN,
		allowQuery: SEARCH_PARAMS,
	},
};
