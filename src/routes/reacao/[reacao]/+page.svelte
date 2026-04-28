<script lang="ts">
import { Carta, Markdown } from "carta-md";
import "carta-md/default.css"; /* Default theme */
import DomPurify from "isomorphic-dompurify";

const { data } = $props();
const { reaction } = data;

const carta = new Carta({
	sanitizer: DomPurify.sanitize,
});
</script>

<svelte:head>
  <title>{reaction.name} - Reação Química</title>
  <meta name="description" content="Vídeos e informações diversas sobre a reação química: {reaction.name}.">
</svelte:head>

<h1 class="h1 text-center">{reaction.name}</h1>
<section>
	<ul class="mx-auto w-fit list-inside list-disc space-y-2">
		<li>Classificaç{reaction.classifications.length === 1 ? "ão" : "ões"}: {reaction.classifications.join(", ")}</li>
		<li>Reagente(s): {reaction.reactants.join(", ")}</li>
		<li>Produto(s): {reaction.products.join(", ")}</li>
		<li>Equação balanceada: {reaction.equation}</li>
	</ul>
</section>

<hr class="hr">

<section>
	<h2 class="h2 text-center">Demonstração</h2>
	<iframe class="w-full aspect-video" frameborder="0" title={reaction.name}
	referrerpolicy="strict-origin-when-cross-origin"
	allow="encrypted-media; picture-in-picture" allowfullscreen
	src="https://www.youtube-nocookie.com/embed/{reaction.youtube_video_id}"></iframe>
</section>

<hr class="hr">

<section>
<h2 class="h2 text-center">Instruções</h2>
<div class="prose dark:prose-invert max-w-none">
	<Markdown {carta} value={reaction.description} />
</div>
</section>
