<script lang="ts">
	import { onMount } from "svelte";
	import { invalidate } from "$app/navigation";
	import { page } from "$app/state";
	import "./layout.css";
	import { user } from "$lib/stores/user";
	import { enhance } from "$app/forms";
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';

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
	<nav>
		<div class="nav-left">
		    <ThemeSwitch />
		</div>

		<div class="nav-center">
			<a href="/reacoes">Reações</a>
			<a href="/atomos">Átomos</a>
		</div>

		<div class="nav-right">
			{#if userData}
				<span>{userData.name}</span>

				<img
					src="https://suap.ifmg.edu.br{userData.photo_relurl}"
					alt=""
				/>

				<form
					method="POST"
					action="/api/auth/suap/logout"
					use:enhance={async () => {
						await supabase?.auth.signOut();
					}}
				><button>Logout</button></form>
			{:else}
				<a href="/api/auth/suap/login">Login</a>
			{/if}
		</div>
	</nav>

	<div aria-hidden="true" class="top-art-deco-frame"></div>
</header>

<main>{@render children()}</main>

<style>
	.nav-left {
		flex: 1;
	}

	.nav-center {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex: 1;
	}

	.nav-right {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
		flex: 1;
	}

	.nav-right img {
		height: 5em;
	}

	.nav-right * {
		margin-top: auto;
		margin-bottom: auto;
	}

	a {
		color: #d9d9d9;
	}
</style>
