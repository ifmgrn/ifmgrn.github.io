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
	{/if}
</div>

<style>
	.bg-youtube-icon {
		background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
	}
</style>
