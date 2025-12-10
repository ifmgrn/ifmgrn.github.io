<script lang="ts">
import ReactionItem from "./ReactionItem.svelte";

const { reactions }: { reactions: Reaction[] } = $props();
</script>

<div role="list">
	{#each reactions as reaction}
		<ReactionItem {reaction} />
	{/each}
</div>

<style>
	div {
		display: grid;
		padding: 16px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		justify-content: center;
		gap: 16px;
	}
</style>