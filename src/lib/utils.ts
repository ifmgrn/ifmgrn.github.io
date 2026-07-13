import { katex } from "$lib/mhchem";

export function strictPick<T extends object, K extends keyof T>(
	obj: T,
	keys: K[],
): Pick<T, K> {
	const result = {} as Pick<T, K>;
	for (const k of keys) {
		if (k in obj) {
			result[k] = obj[k];
		}
	}
	return result;
}

export function strictOmit<T extends object, K extends keyof T>(
	obj: T,
	keys: K[],
): Omit<T, K> {
	const result = { ...obj } as T;
	for (const k of keys) {
		if (k in result) {
			delete result[k];
		}
	}
	return result as Omit<T, K>;
}

export function isEquationValid(equation: string) {
	try {
		katex.renderToString(`\\ce{${equation}}`, {
			throwOnError: true,
			trust: false,
			strict: true,
		});
		return true;
	} catch {
		return false;
	}
}
