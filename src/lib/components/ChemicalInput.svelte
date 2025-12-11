<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import type { HTMLInputAttributes } from 'svelte/elements';

	const { inputProps }: { inputProps?: HTMLInputAttributes } = $props();

	function isDigit(str: string) {
		return str.length === 1 && str >= "0" && str <= "9";
	}

	function insertTextAtCursor(input: HTMLInputElement, text: string) {
		const start = input.selectionStart ?? 0;
		const end = input.selectionEnd ?? 0;
		const value = input.value;

		input.value = value.substring(0, start) + text + value.substring(end);

		const newCursorPos = start + text.length;
		input.selectionStart = input.selectionEnd = newCursorPos;

		input.focus();
		input.dispatchEvent(new Event("input", { bubbles: true }));
	}

	function inputContainer(): Attachment<HTMLDivElement> {
		return (container) => {
			const toolbar: HTMLDivElement | null = container.querySelector('[role="group"]');
			const input = container.querySelector("input");
			if (!(toolbar && input)) return;

			const inputKeydown = (event: KeyboardEvent) => {
				// Tira o foco do input se o usuário pressionar Esc
				if (event.key === "Escape") {
					// Impede com que os navegadores limpem o texto do input
					event.preventDefault();
					input.blur();
				}
				// Se o usuário pressionar Ctrl mais algum dígito, adiciona a versão subscrita do dígito
				else if (event.ctrlKey && isDigit(event.key)) {
					const numberToSubscriptMap: { [key: string]: string } = {
						"0": "₀",
						"1": "₁",
						"2": "₂",
						"3": "₃",
						"4": "₄",
						"5": "₅",
						"6": "₆",
						"7": "₇",
						"8": "₈",
						"9": "₉",
					};

					insertTextAtCursor(input, numberToSubscriptMap[event.key]);
					// Impede com que o dígito original seja adicionado
					event.preventDefault();
				}
			};
			input.addEventListener("keydown", inputKeydown);

			const toolbarClick = (event: PointerEvent) => {
				const button = event.target as HTMLDivElement | HTMLButtonElement;
				if (button instanceof HTMLButtonElement) {
					insertTextAtCursor(
						input,
						button.dataset.toInsert ?? button.textContent ?? "",
					);
				}
			};
			toolbar.addEventListener("click", toolbarClick);

			const inputFocusIn = () => {
				toolbar.removeAttribute("aria-hidden");
				toolbar.classList.remove("hidden");
			}
			input.addEventListener("focusin", inputFocusIn);
			const inputFocusOut = (event: FocusEvent) => {
				const target = event.relatedTarget;
				if (!(target instanceof Node && toolbar.contains(target))) {
					toolbar.setAttribute("aria-hidden", "true");
					toolbar.classList.add("hidden");
				}
			};
			input.addEventListener("focusout", inputFocusOut);

			return () => {
				input.removeEventListener("keydown", inputKeydown);
				toolbar.removeEventListener("click", toolbarClick);
				input.removeEventListener("focusin", inputFocusIn);
				input.removeEventListener("focusout", inputFocusOut);
			};
		}
	}
</script>

<div {@attach inputContainer()} class="input-container">
	<div role="group" class="hidden" aria-hidden="true">
		{#each "₀₁₂₃₄₅₆₇₈₉" as num}
			<button type="button" tabindex="0" data-to-insert={num}>X{num}</button>
		{/each}
	</div>
	<input {...inputProps}>
</div>

<style>
	.input-container {
		position: relative;
	}

	.input-container > [role="group"] {
		position: absolute;
		bottom: 100%;
		left: 50%;
		z-index: 10;
		transform: translateX(-50%);
		transition: opacity var(--transition);
	}

	button {
		--background-color: var(--form-element-background-color);
		--color: var(--muted-color);
		--border-color: var(--primary-border);

		cursor: unset;
		margin-bottom: 0;
	}
</style>