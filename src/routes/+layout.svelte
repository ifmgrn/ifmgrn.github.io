<script lang="ts">
	import { onMount } from "svelte";
	import { invalidate } from "$app/navigation";
	import { page } from "$app/state";
	import "./layout.css";
	import { user } from "$lib/stores/user";
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from "$app/forms";
	import { Atom, FlaskConical, LogIn, LogOut } from "@lucide/svelte";

	let { data, children } = $props();
	let { supabase, session } = $derived(data);
	const { userData } = $derived(page.data);

	onMount(() => {
		if (!supabase) return;

		const { data } = supabase.auth.onAuthStateChange((_event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				user.set(null);
				invalidate("supabase:auth");
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<!--
	Copyright (c) 2025 ifmgrn
	Licensed under the GNU AGPL-3.0 License.
	See LICENSE.txt for details.
-->

<header>
	<nav class="grid grid-cols-3 items-center h-14 border-b border-surface-200-800">
		<div class="justify-self-start flex items-center">
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
									<Menu.ItemText>{userData.relationship_type}: {userData.name} ({userData.ra})</Menu.ItemText>
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

<main class="mt-6">{@render children()}</main>
