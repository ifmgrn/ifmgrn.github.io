<script lang="ts">
	const { videoId, videoTitle }: { videoId: string; videoTitle: string } =
		$props();

	let isIframeLoaded = $state(false);

	const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?` +
		new URLSearchParams({
			rel: '0', // only display recommendations of same channel
			autoplay: '1',
			cc_lang_pref: 'pt', // default caption language
			hl: 'pt', // interface language
			iv_load_policy: '3' // disable annotations
		});
</script>

<div class="relative w-full aspect-video overflow-hidden">
	{#if isIframeLoaded}
		<iframe class="absolute w-full h-full" frameborder="0" title={videoTitle}
		referrerpolicy="strict-origin-when-cross-origin"
		allow="autoplay; encrypted-media; clipboard-write; picture-in-picture" allowfullscreen
		sandbox="allow-scripts allow-same-origin"
		src={embedUrl}></iframe>
	{:else}
		<!--
		<a
			href="https://youtube.com/watch?v={videoId}"
			target="_blank"
			rel="noopener noreferrer"
			title={videoTitle}
			aria-label="Abrir vídeo: {videoTitle}"
			tabindex="0"
			role="button"
			onclick={(event) => {
				event.preventDefault();
				isIframeLoaded = true;
			}}
		>
			<img referrerpolicy="origin" loading="lazy" alt="Thumbnail do vídeo: {videoTitle}" src="https://i.ytimg.com/vi/{videoId}/hqdefault.jpg" class="absolute w-full h-full object-cover">
			<span class="absolute top-1/2 left-1/2 w-17 h-12 -translate-x-1/2 -translate-y-1/2 bg-youtube-icon"></span>
		</a>
	-->
	<button
		type="button"
		title={videoTitle}
		aria-label="Reproduzir vídeo: {videoTitle}"
		class="absolute inset-0"
		onclick={() => {
			isIframeLoaded = true;
		}}
	>
		<img
			referrerpolicy="origin"
			loading="lazy"
			alt=""
			src="https://i.ytimg.com/vi/{videoId}/hqdefault.jpg"
			class="w-full h-full object-cover"
		/>
		<span
			aria-hidden="true"
			class="absolute top-1/2 left-1/2 w-17 h-12 -translate-x-1/2 -translate-y-1/2 bg-youtube-icon"
		></span>
	</button>
	{/if}
</div>

