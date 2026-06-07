<script lang="ts">
import { Carta, Markdown } from "carta-md";
import "carta-md/default.css";
import DomPurify from "isomorphic-dompurify";

const { data } = $props();
const { reaction } = $derived(data);

const carta = new Carta({
	sanitizer: DomPurify.sanitize,
});

const embedUrl = $derived(`https://www.youtube-nocookie.com/embed/${reaction.youtube_video_id}?` +
  new URLSearchParams({
	rel: '0', // only display recommendations of same channel
	autoplay: '1',
	cc_lang_pref: 'pt', // default caption language
	hl: 'pt', // interface language
	iv_load_policy: '3' // disable annotations
}));
</script>

<svelte:head>
  <title>{reaction.name} - Reação Química</title>
  <meta name="description" content="Vídeos e informações diversas sobre a reação química: {reaction.name}.">
</svelte:head>

<h1 id="reacao" class="h1 text-center">{reaction.name}</h1>
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
	<h2 id="demonstracao" class="h2 text-center">Demonstração</h2>
	<iframe class="w-full aspect-video" frameborder="0" title={reaction.name}
	referrerpolicy="strict-origin-when-cross-origin"
	allow="encrypted-media; clipboard-write; picture-in-picture; autoplay" allowfullscreen
	sandbox="allow-scripts allow-same-origin"
	src={embedUrl}></iframe>
</section>

<hr class="hr">

<section>
<h2 id="descricao" class="h2 text-center">Instruções</h2>
<Markdown {carta} value={reaction.description} />
</section>
