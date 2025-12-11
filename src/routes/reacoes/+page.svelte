<script lang="ts">
	import { enhanceGet } from "$lib/attachments.js";
	import ReactionsGrid from "$lib/components/Reactions/ReactionsGrid.svelte";
	import { URL_PARAMS } from "$lib/consts.js";
	import ChemicalInput from "$lib/components/ChemicalInput.svelte";

	let { data } = $props();
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
			<ChemicalInput inputProps={{
				name: URL_PARAMS.SEARCH_REACTANT, 
				value: data.reactants, 
				id: "reactants-input", 
				type: "search",
				placeholder: "Nome ou fórmula"
			}} />
		</div>
		<div>
			<label for="products-input">Produtos</label>
			<ChemicalInput inputProps={{ 
				name: URL_PARAMS.SEARCH_PRODUCT, 
				value: data.products, 
				id: "products-input", 
				type: "search",
				placeholder: "Nome ou fórmula"
			}} />
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
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
	}
</style>