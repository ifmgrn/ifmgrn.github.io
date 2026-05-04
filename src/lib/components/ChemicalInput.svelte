<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	const { inputProps }: { inputProps?: HTMLInputAttributes } = $props();
	let toolbarEl: HTMLDivElement;
	// biome-ignore lint/suspicious/noUnassignedVariables: bind:this
	let inputEl: HTMLInputElement;

	const hiddenClasses = ["invisible", "opacity-0", "transition-fade"];

	function insertTextAtCursor(text: string) {
		const start = inputEl.selectionStart ?? 0;
		const end = inputEl.selectionEnd ?? 0;
		const value = inputEl.value;

		inputEl.value = value.slice(0, start) + text + value.slice(end);

		const newCursorPos = start + text.length;
		inputEl.selectionStart = inputEl.selectionEnd = newCursorPos;

		inputEl.focus();
		inputEl.dispatchEvent(new Event("input", { bubbles: true }));
	}
</script>

<div class="relative">
	<div
		role="group"
		class={["absolute bottom-full left-1/2 z-10 inline-flex flex-nowrap justify-center gap-1 w-auto p-1 overflow-x-auto overscroll-x-contain align-middle border border-(--color-surface-200-800) rounded-(--radius-container) -translate-x-1/2 transition-opacity duration-200 ease-in-out", ...hiddenClasses]}
		aria-hidden="true"
		bind:this={toolbarEl}
		onclick={(event) => {
			const button = event.target as HTMLDivElement | HTMLButtonElement | null;
			if (button instanceof HTMLButtonElement) {
				insertTextAtCursor(
					button.dataset.value ?? button.textContent ?? "",
				);
			}
		}}
	>
		{#each "₀₁₂₃₄₅₆₇₈₉" as num}
			<button
				class="btn preset-filled-surface-50-950 px-2"
				type="button"
				tabindex="0"
				data-value={num}
			>
				X{num}
			</button>
		{/each}
	</div>
	<input
		class="input"
		{...inputProps}
		bind:this={inputEl}
		onkeydown={(event) => {
			const input = event.currentTarget;

			// Tira o foco do input se o usuário pressionar Esc
			if (event.key === "Escape") {
				// Impede com que os navegadores limpem o texto do input
				event.preventDefault();

				input.blur();
			}
			// Se o usuário pressionar Ctrl mais algum dígito, adiciona a versão subscrita do dígito
			else if (event.ctrlKey && (event.key.length === 1 && event.key >= "0" && event.key <= "9")) {
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

				insertTextAtCursor(numberToSubscriptMap[event.key]);

				// Impede com que o dígito original seja adicionado
				event.preventDefault();
			}
		}}
		onfocusin={() => {
			toolbarEl.removeAttribute("aria-hidden");
			toolbarEl.classList.remove(...hiddenClasses);
		}}
		onfocusout={(event) => {
			const target = event.relatedTarget;

			if (!(target instanceof Node && toolbarEl.contains(target))) {
				toolbarEl.setAttribute("aria-hidden", "true");
				toolbarEl.classList.add(...hiddenClasses);
			}
		}}
	>
</div>

<style>
	.transition-fade {
		transition-delay: 0s, var(--tw-duration);
		transition-timing-function: var(--tw-ease), linear;
		transition-duration: var(--tw-duration), 0s;
		transition-property: opacity, visibility;
	}
</style>
