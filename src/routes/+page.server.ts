import { redirect } from "@sveltejs/kit";
import { STATUS_CODE } from "$lib/consts";

export function load() {
	redirect(STATUS_CODE.PERMANENT_REDIRECT, "/reacoes");
}
