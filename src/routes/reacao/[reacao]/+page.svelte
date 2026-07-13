<script lang="ts">
import { math } from "@cartamd/plugin-math";
  import { Pen, Trash } from "@lucide/svelte";
import { Carta, Markdown } from "carta-md";
import DomPurify from "isomorphic-dompurify";
import { katex, macros } from "$lib/mhchem";

const { data } = $props();
const { reaction, userMetadata, reactionParam } = $derived(data);

const carta = new Carta({
	sanitizer: DomPurify.sanitize,
    extensions: [math({
        rehypeKatex: {
            macros
        }
    })]
});

const embedUrl = $derived(`https://www.youtube-nocookie.com/embed/${reaction.youtube_video_id}?` +
  new URLSearchParams({
	rel: '0', // only display recommendations of same channel
	cc_lang_pref: 'pt', // default caption language
	hl: 'pt', // interface language
	iv_load_policy: '3' // disable annotations
}));

const equationPreview = katex.renderToString(`\\ce{${reaction.equation}}`);

const updateUrl = `/atualizar-reacao/${reactionParam}`;
</script>

<svelte:head>
  <title>{reaction.name} - Reação Química</title>
  <meta name="description" content="Vídeos e informações diversas sobre a reação química: {reaction.name}.">
</svelte:head>

{#if userMetadata && reaction.user_id === userMetadata.suap_id}
	<div class="flex justify-center items-center gap-4">
		<a class="btn preset-filled-primary-50-950 px-2" href={updateUrl} title="Editar">
			<Pen></Pen>
		</a>
	
		<form method="POST" action={`${updateUrl}?/delete`}>
			<button type="submit" class="btn preset-filled-error-500 px-2" title="Excluir">
				<Trash></Trash>
			</button>
		</form>
	</div>

	<hr class="hr mt-4 mb-2">
{/if}

<h1 id="reacao" class="h1 text-center">{reaction.name}</h1>
<section>
	<ul class="mx-auto w-fit list-inside list-disc space-y-1">
		<li>Usuário: {reaction.user_name ?? "(anonimizado)"}</li>
		<li>Classificações: {reaction.classifications.join(", ")}</li>
		<li>Reagentes: {reaction.reactants.join(", ")}</li>
		<li>Produtos: {reaction.products.join(", ")}</li>
		<li>Catalisadores: {reaction.catalysts.join(", ")}</li>
		<li>Equação química: {@html equationPreview}</li>
	</ul>
</section>

<hr class="hr mt-4">

<section class="mt-2">
	<h2 id="demonstracao" class="h2 text-center">Demonstração</h2>
	<iframe class="w-full aspect-video mt-2" frameborder="0" title={reaction.name}
	referrerpolicy="strict-origin-when-cross-origin"
	allow="encrypted-media; clipboard-write; picture-in-picture" allowfullscreen
	sandbox="allow-scripts allow-same-origin"
	src={embedUrl}></iframe>
</section>

<hr class="hr mt-4">

<section class="mt-2">
	<h2 id="descricao" class="h2 text-center mb-2">Instruções</h2>
	<Markdown {carta} value={reaction.description} />
</section>
