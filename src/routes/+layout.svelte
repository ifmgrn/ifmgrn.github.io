<script lang="ts">
	import { onMount } from "svelte";
	import { invalidate } from "$app/navigation";
	import "./layout.css";
	import { ArrowUpToLine, Atom, FlaskConical, LogIn, LogOut } from "@lucide/svelte";
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
	import ifmgLogo from '#lib/assets/ifmg-logo.webp';
	import ThemeSwitch from '#lib/components/ThemeSwitch.svelte';
  import { enhance } from "$app/forms";

	const { data, children } = $props();
	const { supabase, claims } = $derived(data);
	const { userData } = $derived(data);

	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((_, authSession) => {
			if (authSession?.expires_at !== claims?.exp) {
				invalidate("supabase:auth");
			}
		});

		return () => authData.subscription.unsubscribe();
	});

	const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
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
	<nav class="grid grid-cols-3 items-center h-14">
		<div class="justify-self-start flex items-center gap-2">
			<a href="/">
				<img src={ifmgLogo} class="h-8" alt="Logo">
			</a>
			<a href="https://github.com/ifmgrn/ifmgrn.github.io" aria-label="GitHub">
				<svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path></svg>
			</a>
		</div>

		<div class="justify-self-center flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-6">
			<a href="/reacoes" class="flex items-center gap-1">
				<FlaskConical class="w-4 h-4" />
				<span class="hidden sm:inline">Reações Químicas</span>
				<span class="sm:hidden">Reações</span>
			</a>
			<a href="/atomos" class="flex items-center gap-1">
				<Atom class="w-4 h-4" />
				<span class="hidden sm:inline">Tabela Periódica</span>
				<span class="sm:hidden">Átomos</span>
			</a>
		</div>

		<div class="justify-self-end flex items-center gap-2">
			<ThemeSwitch />
			{#if userData}
				<Menu>
					<Menu.Trigger>
						<img
							src="https://suap.ifmg.edu.br{userData.photo_relurl}"
							alt="Profile"
							class="h-14 rounded-full border border-surface-200-800"
						/>
					</Menu.Trigger>
					<Portal>
						<Menu.Positioner>
							<Menu.Content>
								<Menu.Item value="info" disabled>
									<Menu.ItemText>{capitalize(userData.role)}: {userData.name} ({userData.ra})</Menu.ItemText>
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
	<hr class="hr mt-2">
</header>

<main class="mt-4">
	{@render children()}
	<a href="#top" class="fixed bottom-4 right-4 px-4 py-2">
		<ArrowUpToLine />
	</a>
</main>
