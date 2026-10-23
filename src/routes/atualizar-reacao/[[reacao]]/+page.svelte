<script lang="ts">
import { math } from "@cartamd/plugin-math";
import { Carta, MarkdownEditor } from "carta-md";
import DomPurify from "isomorphic-dompurify";
import { katex, macros } from "#lib/mhchem.js";
import { isEquationValid } from "#lib/utils.ts";

const { data } = $props();
const { reaction } = $derived(data);

const carta = new Carta({
	sanitizer: DomPurify.sanitize,
    extensions: [math({
        rehypeKatex: {
            macros
        }
    })]
});

let equationPreviewEl: HTMLElement;
let equationInputEl: HTMLInputElement;

const initialEquationPreview = $derived(reaction?.equation ? katex.renderToString(`\\ce{${reaction.equation}}`) : "");
</script>

<svelte:head>
  <title>{ reaction ? `Atualizar ${reaction.name}` : "Adicionar Reação Química" }</title>
  <meta name="description" content="Adicione ou atualize uma reação química no banco de dados.">
</svelte:head>

<form method="POST" onsubmit={(evt) => {
    if (!isEquationValid(equationInputEl.value)) {
        equationInputEl.classList.add('input-error');
        equationInputEl.focus();
        equationInputEl.scrollIntoView();
        evt.preventDefault();
    }
}} class="flex flex-col gap-4" action="?/update">
    <input type="hidden" name="id" value={reaction?.id}>

    <input name="name" class="input text-center h1" placeholder="Título" value={reaction?.name}>

    <label class="label">
        <span class="label-text">Vídeo de demonstração (URL para YouTube)</span>
        <input name="video_url" class="input" placeholder="https://www.youtube.com/watch?v=..." value={reaction?.youtube_video_id ? `https://www.youtube.com/watch?v=${reaction.youtube_video_id}` : null}>
    </label>

    <label class="label">
        <span class="label-text">Equação química:</span>
        <div class="flex w-full items-stretch">
            <input name="equation" class="input flex-1 rounded-r-none" placeholder="Exemplo: CO2 + C -> 2 CO" bind:this={equationInputEl} value={reaction?.equation} oninput={() => {
                equationInputEl.classList.remove('input-error');
                katex.render(
                    `\\ce{${equationInputEl.value}}`, 
                    equationPreviewEl, 
                    { 
                        throwOnError: false,
                        trust: false,
                        strict: false 
                    }
                );
            }}>
            <span class="input flex-1 rounded-l-none flex items-center overflow-auto" bind:this={equationPreviewEl}>
                {@html initialEquationPreview}
            </span>
        </div>
    </label>

    <label class="label">
        <span class="label-text">Classificações:</span>
        <input name="classifications" class="input" placeholder="Exemplo: oxirredução, síntese" value={reaction?.classifications.join(", ")}>
    </label>

    <!-- biome-ignore lint/a11y/noLabelWithoutControl: MarkdownEditor has textarea -->
    <label class="label">
        <span class="label-text">Descrição:</span>
        <MarkdownEditor {carta} value={reaction?.description} textarea={{name: "description"}} />
    </label>

    <button type="submit" class="btn preset-filled-primary-50-950 mx-auto block">
        {reaction ? "Atualizar" : "Adicionar"} reação
    </button>
</form>