<script lang="ts">
	import YouTube from "../YouTube.svelte";

	const { reaction }: { reaction: Reaction } = $props();

	const title = reaction.name;

	const fields = [
		["Reação:", reaction.name],
		["Classificações:", reaction.classifications.join(", ")],
		["Reagentes:", reaction.reactants.join(", ")],
		["Produtos:", reaction.products.join(", ")],
		["Equação:", reaction.equation]
	];
</script>

<div role="listitem" aria-label={reaction.name} class="reaction-item">
	<YouTube videoId={reaction.youtube_video_id} videoTitle={title} />
	<a href="/reacao/{reaction.id}" class="info">
		{#each fields as field}
			<span class="field">{field[0]}</span>
			<span class="value">{field[1]}</span>
		{/each}
	</a>
</div>

<style>
	.reaction-item {
		display: flex;
		flex-direction: column;
	}

	.info {
		display: grid;
		margin-top: 4px;
		grid-template-columns: auto 1fr;
		gap: 0 8px;
	}

	.field {
		font-weight: bold;
		text-align: right;
	}

	.value {
		text-align: left;
	}
</style>