<script lang="ts">
import { onMount } from "svelte";
import type { Attachment } from "svelte/attachments";

const { videoId, videoTitle }: { videoId: string; videoTitle: string } =
	$props();

let isIframeLoaded = $state(false);
function playButton(): Attachment<HTMLAnchorElement> {
	return (element) => {
		element.setAttribute("tabindex", "0");
		element.setAttribute("role", "button");

		const onClick: (this: HTMLAnchorElement, event: PointerEvent) => unknown = (
			event,
		) => {
			event.preventDefault();

			isIframeLoaded = true;
		};

		element.addEventListener("click", onClick);

		return () => {
			element.removeEventListener("click", onClick);
		};
	};
}

const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
let webpUrl = $state(null);
onMount(async () => {
	const res = await fetch(`/api/get-webp-thumb/${videoId}`);
	const data = await res.json();
	webpUrl = data.webpUrl;
});
</script>

<style>
    .youtube {
        width: 100%;
        aspect-ratio: 16 / 9;
        display: inline-block;
        position: relative;

        cursor: pointer;
    }

    .youtube:not(.activated)::after {
        content: attr(data-title);
        display: block;
        position: absolute;
        top: 0;
        background-image: linear-gradient(180deg, rgb(0 0 0 / 67%) 0%, rgb(0 0 0 / 54%) 14%, rgb(0 0 0 / 15%) 54%, rgb(0 0 0 / 5%) 72%, rgb(0 0 0 / 0%) 94%);
        height: 99px;
        width: 100%;
        font-family: "YouTube Noto",Roboto,Arial,Helvetica,sans-serif;
        color: hsl(0deg 0% 93.33%);
        text-shadow: 0 0 2px rgba(0,0,0,.5);
        font-size: 18px;
        padding: 25px 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-sizing: border-box;
    }

    .activated {
        cursor: unset;
    }

    iframe {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }

    .playIcon {
        width: 68px;
        height: 48px;
        background-color: transparent;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
        z-index: 1;
        border: 0;
        border-radius: inherit;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        cursor: inherit;
    }

    .activated .playIcon {
        display: none;
    }

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;

        position: absolute;
        left: 0;
        top: 0;
    }
</style>

<div class="youtube" data-title={videoTitle} class:activated={isIframeLoaded}>
    <a 
        href="https://youtube.com/watch?v={videoId}"
        target="_blank"
        rel="noopener noreferrer"
        title="Abrir Vídeo"
        aria-label="Abrir Vídeo: {videoTitle}"
        {@attach playButton()}
    >
        <picture>
            {#if webpUrl}
                <source type="image/webp" srcset={webpUrl}>
            {/if}
            <img referrerpolicy="origin" loading="lazy" alt="Thumbnail do Vídeo: {videoTitle}" src={fallbackUrl}>
        </picture>
        <span class="playIcon"></span>
    </a>
    {#if isIframeLoaded}
        <iframe frameborder="0" title={videoTitle}
        referrerpolicy="strict-origin-when-cross-origin"
        allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen
        src="https://www.youtube-nocookie.com/embed/{videoId}?autoplay=1"></iframe>
    {/if}
</div>