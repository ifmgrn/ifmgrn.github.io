<script lang="ts">
import YouTube from "../YouTube.svelte";

const { reaction }: { reaction: Reaction } = $props();

const title = reaction.name;
</script>

<div role="listitem" aria-label={reaction.name}>
	<YouTube videoId={reaction.youtube_video_id} videoTitle={title} />
	<a href="/reacao/{reaction.id}" class="info">
		<span class="field">Reação:</span><span class="value">{reaction.name}</span>
		<span class="field">Classificaç{reaction.classifications.length === 1 ? "ão" : "ões"}:</span><span class="value">{reaction.classifications.join(", ")}</span>
		<span class="field">Reagente(s):</span><span class="value">{reaction.reactants.join(", ")}</span>
		<span class="field">Produto(s):</span><span class="value">{reaction.products.join(", ")}</span>
		<span class="field">Equação:</span><span class="value">{reaction.equation}</span>
	</a>
</div>

<style>
	div {
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

	a {
		color: #d9d9d9;
	}
</style>