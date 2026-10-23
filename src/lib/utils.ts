import { katex } from "#lib/mhchem.js"

export function isEquationValid(equation: string) {
  try {
    katex.renderToString(`\\ce{${equation}}`, {
      throwOnError: true,
      trust: false,
      strict: true,
    })
    return true
  } catch {
    return false
  }
}

type SuccessData<T> = Extract<Awaited<T>, { error: null }> extends { data: infer D } ? D : never

export async function unwrap<T extends PromiseLike<{ data?: unknown; error: unknown }>>(
  execute: () => T,
): Promise<SuccessData<T>> {
  const { data, error } = await execute()
  if (error) {
    throw error
  }
  return data as SuccessData<T>
}

export function truthy<K>(value: K, msg: string) {
  if (!value) {
    throw new Error(msg)
  }
  return value
}
