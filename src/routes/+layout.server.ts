import type { Config } from "@sveltejs/adapter-vercel";
import { URL_PARAMS } from "$lib/consts.js";
import { BYPASS_TOKEN } from '$env/static/private';

const SEARCH_PARAMS = Object.entries(URL_PARAMS)
	.filter(p => p[0].startsWith("SEARCH_"))
	.map(p => p[1]);

export const config: Config = {
	isr: {
		expiration: false,
		bypassToken: BYPASS_TOKEN,
		allowQuery: SEARCH_PARAMS
	}
};