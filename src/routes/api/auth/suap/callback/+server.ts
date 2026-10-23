import { exchangeCodeForSession } from "#lib/server/auth.ts"

export function GET() {
  return exchangeCodeForSession("/")
}
