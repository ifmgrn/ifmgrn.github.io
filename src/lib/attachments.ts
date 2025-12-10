import type { Attachment } from "svelte/attachments";
import { goto } from "$app/navigation";

export function enhanceGet(): Attachment<HTMLFormElement> {
	return (form) => {
		if (form.method.toLowerCase() !== "get") {
			console.error(
				'Error: {@attach enhanceGet()} can only be used on <form> fields with method="GET". use:enhance for other methods.',
			);
			return;
		}

		const onSubmit = async (event: SubmitEvent) => {
			event.preventDefault();

			const url = new URL(form.action || window.location.href);

			const controls = Array.from(form.elements).filter(
				(
					el,
				): el is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
					(el instanceof HTMLInputElement ||
						el instanceof HTMLSelectElement ||
						el instanceof HTMLTextAreaElement) &&
					el.name !== "" &&
					["text", "search"].includes(el.type.toLowerCase()),
			);

			for (const control of controls) {
				const value = control.value.trim();

				if (value === "") url.searchParams.delete(control.name);
				else url.searchParams.set(control.name, value);
			}

			goto(url.toString(), { replaceState: true });
		};

		form.addEventListener("submit", onSubmit);

		return () => {
			form.removeEventListener("submit", onSubmit);
		};
	};
}
