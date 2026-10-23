import { signInWithOauth } from "#lib/server/auth.ts"

export function GET() {
  return signInWithOauth()
}
