<script lang="ts">
	import { onMount } from "svelte";
	import { invalidate } from "$app/navigation";
	import "./layout.css";
	import { ArrowUpToLine, Atom, FlaskConical, LogIn, LogOut } from "@lucide/svelte";
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from "$app/forms";
	import ifmgLogo from '$lib/assets/ifmg-logo.webp';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';

	const { data, children } = $props();
	const { supabase, session } = $derived(data);
	const { userMetadata } = $derived(data);

	const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

	onMount(() => {
		if (!supabase) { return; }

		const { data: authData } = supabase.auth.onAuthStateChange((_, authSession) => {
			if (authSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});

		return () => authData.subscription.unsubscribe();
	});
</script>

<!--
	Copyright (c) 2025 ifmgrn
	Licensed under the GNU AGPL-3.0 License.
	See LICENSE.txt for details.
-->

<svelte:head>
	<script>
		document.documentElement.setAttribute('data-mode', 
			localStorage.getItem('theme-mode') 
			|| (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
		);
	</script>
</svelte:head>

<header>
	<nav class="grid grid-cols-3 items-center h-14 border-b border-surface-200-800">
		<div class="justify-self-start flex items-center gap-2">
			<a href="/">
				<img src={ifmgLogo} class="h-8" alt="Logo">
			</a>
		    <ThemeSwitch />
		</div>

		<div class="justify-self-center flex items-center gap-6">
			<a href="/reacoes" class="flex items-center gap-1">
				<FlaskConical class="w-4 h-4" />
				Reações
			</a>
			<a href="/atomos" class="flex items-center gap-1">
				<Atom class="w-4 h-4" />
				Átomos
			</a>
		</div>

		<div class="justify-self-end flex items-center">
			{#if userMetadata}
				<Menu>
					<Menu.Trigger>
						<img
							src="https://suap.ifmg.edu.br{userMetadata.photo_relurl}"
							alt="Profile"
							class="h-14 rounded-full border border-surface-200-800"
						/>
					</Menu.Trigger>
					<Portal>
						<Menu.Positioner>
							<Menu.Content>
								<Menu.Item value="info" disabled>
									<Menu.ItemText>{capitalize(userMetadata.role)}: {userMetadata.name} ({userMetadata.ra})</Menu.ItemText>
								</Menu.Item>
								<Menu.Item value="logout">
									<form method="POST" action="/api/auth/suap/logout" 
										use:enhance={async () => {await supabase?.auth.signOut()}}
									>
										<button type="submit" class="flex items-center gap-1">
											<LogOut class="w-4 h-4" />
											Logout
										</button>
									</form>
								</Menu.Item>
							</Menu.Content>
						</Menu.Positioner>
					</Portal>
				</Menu>
				
			{:else}
				<a href="/api/auth/suap/login" class="flex items-center gap-1">
					<LogIn class="w-4 h-4" />
					Login
				</a>
			{/if}
		</div>
	</nav>
</header>

<main class="mt-6">
	{@render children()}
	<a href="#top" class="fixed bottom-4 right-4 px-4 py-2">
		<ArrowUpToLine />
	</a>
</main>
