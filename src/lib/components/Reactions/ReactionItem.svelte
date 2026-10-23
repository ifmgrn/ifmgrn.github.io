<script lang="ts">
	import YouTube from "../YouTube.svelte";

	const { reaction }: { reaction: Reaction } = $props();
	const fields = $derived([
		["Reação:", reaction.name],
		["Usuário:", reaction.user_name ?? null],
		["Classificações:", reaction.classifications.length === 0 ? null : reaction.classifications.join(", ")],
		["Reagentes:", reaction.reactants.join(", ")],
		["Produtos:", reaction.products.join(", ")],
		["Catalisadores:", reaction.catalysts.length === 0 ? null : reaction.catalysts.join(", ")],
		["Equação:", reaction.equation]
	]);
</script>

<li class="flex flex-col list-none">
	<YouTube videoId={reaction.youtube_video_id} videoTitle={reaction.name} />
	<a href="/reacao/{reaction.slug}#demonstracao" class="grid mt-1 grid-cols-[auto_1fr] gap-x-2 mx-auto">
		{#each fields as field}
			{#if field[1]}
				<span class="font-bold text-right">{field[0]}</span>
				<span class="text-left">{field[1]}</span>
			{/if}
		{/each}
	</a>
</li>