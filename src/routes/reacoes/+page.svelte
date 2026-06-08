<script lang="ts">
	import ReactionsGrid from "$lib/components/Reactions/ReactionsGrid.svelte";
	import { URL_PARAMS } from "$lib/consts.js";

	let { data } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://i.ytimg.com" />
  <link rel="preconnect" href="https://www.youtube-nocookie.com" />
  <title>Banco de Dados de Reações Químicas</title>
  <meta name="description" content="Um banco de dados de reações químicas onde você pode pesquisar, visualizar vídeos e ver detalhes sobre reações químicas.">
</svelte:head>

<form method="GET" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-4 items-end">
	<label class="label">
		<span class="label-text">Nome</span>
		<input
			name={URL_PARAMS.SEARCH_REACTION}
			type="search"
			value={data.query}
			placeholder="Exemplo: Formação da água"
			class="input"
		>
	</label>
	
	<label class="label">
		<span class="label-text">Reagentes</span>
		<input class="input" name={URL_PARAMS.SEARCH_REACTANT} value={data.reactants} type="search" placeholder="Nome ou fórmula">
	</label>
	
	<label class="label">
		<span class="label-text">Produtos</span>
		<input class="input" name={URL_PARAMS.SEARCH_PRODUCT} value={data.products} type="search" placeholder="Nome ou fórmula">
	</label>

	<label class="label">
		<span class="label-text">Classificações</span>
		<input
			name={URL_PARAMS.SEARCH_CLASSIFICATION}
			type="search"
			value={data.classifications}
			placeholder="Exemplo: Síntese"
			class="input"
		>
	</label>
		
	<button type="submit" aria-label="Pesquisar" class="btn preset-filled-primary-50-950 w-fit h-fit">
		>
	</button>

	{#if data.session}
		<a href="/nova-reacao" aria-label="Adicionar reação" class="btn preset-filled-surface-100-900">+</a>
	{/if}
</form>

<ReactionsGrid reactions={data.reactions} />
