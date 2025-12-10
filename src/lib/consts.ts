/** biome-ignore-all lint/style/useNamingConvention: This file is dedicated to constants */

export const STATUS_CODE = {
	NO_CONTENT: 204,
	FOUND: 302,
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	FORBIDDEN: 403,
} as const;

export const URL_PARAMS = {
	SEARCH_REACTION: "q",
	SEARCH_REACTANT: "r",
	SEARCH_PRODUCT: "p",
	SEARCH_CLASSIFICATION: "c",

	THEME: "tema",
} as const;
