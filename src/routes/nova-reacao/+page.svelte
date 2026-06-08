<script lang="ts">
import { math } from "@cartamd/plugin-math";
import { isBrowser } from "@supabase/ssr";
import { redirect } from "@sveltejs/kit";
import { Carta, MarkdownEditor } from "carta-md";
import DomPurify from "isomorphic-dompurify";
import { goto } from "$app/navigation";
import { katex, macros } from "$lib/mhchem";

const { data } = $props();
if (!data.session) {
    if (isBrowser()) {
        goto("/");
    } else {
        redirect(308, "/");
    }
}

const carta = new Carta({
	sanitizer: DomPurify.sanitize,
    extensions: [math({
        rehypeKatex: {
            macros
        }
    })]
});

let equationPreviewEl: HTMLElement;
</script>

<svelte:head>
  <title>Adicionar Reação Química</title>
  <meta name="description" content="Adicione uma nova reação química ao banco de dados.">
</svelte:head>

<form method="POST">
    <input name="name" class="input text-center h1" placeholder="Título">

    <label class="label">
        <span class="label-text">Vídeo de demonstração (URL para YouTube)</span>
        <input name="video_url" class="input" placeholder="https://www.youtube.com/watch?v=...">
    </label>

    <label class="label">
        <span class="label-text">Equação química:</span>
        <div class="flex w-full items-stretch">
            <input name="equation" class="input flex-1 rounded-r-none" placeholder="Exemplo: CO2 + C -> 2 CO" oninput={(evt) => {
            katex.render(
                `\\ce{${(evt.target as HTMLInputElement).value}}`, 
                equationPreviewEl, 
                { throwOnError: false });
            }}>
            <span class="input flex-1 rounded-l-none flex items-center overflow-auto" bind:this={equationPreviewEl}></span>
        </div>
    </label>

    <label class="label">
        <span class="label-text">Classificações:</span>
        <input name="classifications" class="input" placeholder="Exemplo: oxirredução, síntese">
    </label>

    <label class="label">
        <span class="label-text">Instruções:</span>
        <MarkdownEditor {carta} textarea={{name: "instructions"}} />
    </label>

    <button type="submit" class="btn preset-filled-primary-50-950 mx-auto block">Adicionar reação</button>
</form>