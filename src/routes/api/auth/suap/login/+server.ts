import { signInWithOauth } from "$lib/server/auth";

export function GET() {
	return signInWithOauth();
}
