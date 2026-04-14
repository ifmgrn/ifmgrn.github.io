<script lang="ts">
    import { MoonIcon, SunIcon } from '@lucide/svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let checked = $state(false);

	$effect(() => {
		const mode = localStorage.getItem('theme-mode') || 'dark';
		checked = mode === 'dark';
	});

	const onCheckedChange = (event: { checked: boolean }) => {
		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('theme-mode', mode);
		checked = event.checked;
	};
</script>

<svelte:head>
	<script>
		document.documentElement.setAttribute('data-mode', localStorage.getItem('theme-mode') || 'dark');
	</script>
</svelte:head>

<Switch {checked} {onCheckedChange}>
	<Switch.Control>
		<Switch.Thumb>
			<Switch.Context>
				{#snippet children(switch_)}
					{#if switch_().checked}
						<SunIcon class="size-3" />
					{:else}
						<MoonIcon class="size-3" />
					{/if}
				{/snippet}
			</Switch.Context>
		</Switch.Thumb>
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>