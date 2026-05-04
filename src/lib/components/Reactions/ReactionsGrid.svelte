<script lang="ts">
	import ReactionItem from "./ReactionItem.svelte";

	const { reactions }: { reactions: Reaction[] } = $props();
</script>

<div role="list" class="grid p-4 justify-center gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
	{#each reactions as reaction}
		<ReactionItem {reaction} />
	{/each}
</div>
