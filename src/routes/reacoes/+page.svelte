<script lang="ts">
import { onMount } from "svelte";
import { enhanceGet } from "$lib/attachments.js";
import ReactionsGrid from "$lib/components/Reactions/ReactionsGrid.svelte";
import { URL_PARAMS } from "$lib/consts.js";

let { data } = $props();

onMount(() => {
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

	const inputContainers = document.getElementsByClassName(
		"input-container",
	) as HTMLCollectionOf<HTMLDivElement>;
	for (const container of inputContainers) {
		const toolbar = container.querySelector('[role="group"]');
		const input = container.querySelector("input");
		if (!(toolbar && input)) continue;

		// Necessário para fazer com que os botões possam ser `relatedTarget` no Safari
		for (const button of toolbar.querySelectorAll("button")) {
			button.setAttribute("tabindex", "0");
		}

		input.addEventListener("keydown", (event) => {
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
		});

		toolbar.addEventListener("click", (event) => {
			if ((event as any).detail === 0) return;

			event.preventDefault();

			const button = event.target as HTMLDivElement | HTMLButtonElement;
			if (button instanceof HTMLButtonElement) {
				insertTextAtCursor(
					input,
					button.dataset.toInsert ?? button.textContent ?? "",
				);
			}
		});

		input.addEventListener("focusin", () => {
			toolbar.removeAttribute("aria-hidden");
			toolbar.classList.remove("hidden");
		});
		input.addEventListener("focusout", (event) => {
			const target = event.relatedTarget;
			if (!(target instanceof Node && toolbar.contains(target))) {
				toolbar.setAttribute("aria-hidden", "true");
				toolbar.classList.add("hidden");
			}
		});
	}
});
</script>

<svelte:head>
  <link rel="preconnect" href="https://i.ytimg.com" />
  <link rel="preconnect" href="https://www.youtube-nocookie.com" />
</svelte:head>

<h1>Banco de Dados de Reações Químicas</h1>
<form method="GET" {@attach enhanceGet()}>
	<div class="form-grid">
	<div>
		<label for="reactions-input">Nome</label>
		<input
			id="reactions-input"
			name={URL_PARAMS.SEARCH_REACTION}
			type="search"
			value={data.query}
		>
	</div>
	<div>
		<label for="reactants-input">Reagentes</label>
		<div class="input-container">
			<div role="group" class="hidden" aria-hidden="true">
				<button data-to-insert="₀">X₀</button>
				<button data-to-insert="₁">X₁</button>
				<button data-to-insert="₂">X₂</button>
				<button data-to-insert="₃">X₃</button>
				<button data-to-insert="₄">X₄</button>
				<button data-to-insert="₅">X₅</button>
				<button data-to-insert="₆">X₆</button>
				<button data-to-insert="₇">X₇</button>
				<button data-to-insert="₈">X₈</button>
				<button data-to-insert="₉">X₉</button>
			</div>
			<input
				id="reactants-input"
				name={URL_PARAMS.SEARCH_REACTANT}
				type="search"
				value={data.reactants}
			>
		</div>
	</div>
	<div>
		<label for="products-input">Produtos</label>
		<div class="input-container">
			<div role="group" class="hidden" aria-hidden="true">
				<button data-to-insert="₀">X₀</button>
				<button data-to-insert="₁">X₁</button>
				<button data-to-insert="₂">X₂</button>
				<button data-to-insert="₃">X₃</button>
				<button data-to-insert="₄">X₄</button>
				<button data-to-insert="₅">X₅</button>
				<button data-to-insert="₆">X₆</button>
				<button data-to-insert="₇">X₇</button>
				<button data-to-insert="₈">X₈</button>
				<button data-to-insert="₉">X₉</button>
			</div>
			<input
				id="products-input"
				name={URL_PARAMS.SEARCH_PRODUCT}
				type="search"
				value={data.products}
			>
		</div>
	</div>
	<div>
		<label for="classification-input">Classificações</label>
		<input
			id="classification-input"
			name={URL_PARAMS.SEARCH_CLASSIFICATION}
			type="search"
			value={data.classifications}
		>
	</div>
	</div>
	<button type="submit" aria-label="Pesquisar" style="display: none;"></button>
</form>

<ReactionsGrid reactions={data.reactions} />

<style>
	.form-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr); /* duas colunas iguais */
		gap: 20px;                             /* espaço entre colunas */
	}

	.form-grid label {
		display: block;
		margin-bottom: 5px;
	}

	.form-grid input {
		width: 100%;
		padding: 5px;
	}
</style>