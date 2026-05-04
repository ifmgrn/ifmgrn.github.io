import { exchangeCodeForSession } from "$lib/server/auth";

export function GET() {
	return exchangeCodeForSession("/");
}
