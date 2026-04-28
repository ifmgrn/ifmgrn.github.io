<script lang="ts">
    import { MoonIcon, SunIcon } from '@lucide/svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
    import { onMount } from 'svelte';

	let checked: null | boolean = $state(null);

	onMount(() => {
		checked = document.documentElement.getAttribute('data-mode') === 'dark';
	});

	const onCheckedChange = (event: { checked: boolean }) => {
		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('theme-mode', mode);
		checked = event.checked;
	};
</script>

{#if checked !== null}
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
		<Switch.HiddenInput aria-label="Activate {checked ? 'light' : 'dark'} mode" />
	</Switch>
{/if}