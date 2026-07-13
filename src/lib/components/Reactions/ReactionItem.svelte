<script lang="ts">
	import YouTube from "../YouTube.svelte";

	const { reaction }: { reaction: Reaction } = $props();
	const fields = [
		["Reação:", reaction.name],
		["Usuário:", reaction.user_name ?? "(anonimizado)"],
		["Classificações:", reaction.classifications.join(", ")],
		["Reagentes:", reaction.reactants.join(", ")],
		["Produtos:", reaction.products.join(", ")],
		["Catalisadores:", reaction.catalysts.join(", ")],
		["Equação:", reaction.equation]
	];
</script>

<div role="listitem" aria-label={reaction.name} class="flex flex-col">
	<YouTube videoId={reaction.youtube_video_id} videoTitle={reaction.name} />
	<a href="/reacao/{reaction.slug}#demonstracao" class="grid mt-1 grid-cols-[auto_1fr] gap-x-2 mx-auto">
		{#each fields as field}
			<span class="font-bold text-right">{field[0]}</span>
			<span class="text-left">{field[1]}</span>
		{/each}
	</a>
</div>
