<script lang="ts">
	import ReactionItem from "./ReactionItem.svelte";

	const { reactions }: { reactions: Reaction[] } = $props();
</script>

<ul class="grid p-4 justify-center gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] list-none m-0">
	{#each reactions as reaction}
			<ReactionItem {reaction} />
	{/each}
</ul>