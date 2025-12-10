<script lang="ts">
import { Carta, MarkdownEditor } from "carta-md";
import DomPurify from "isomorphic-dompurify";
import { enhance } from "$app/forms";

const carta = new Carta({
	sanitizer: DomPurify.sanitize,
});
</script>

<form method="POST" use:enhance>
  <label>
    Nome: 
    <input name="nome">
  </label>
  <label>
    Classificações: 
    <input name="classificacao">
  </label>
  <MarkdownEditor {carta} />
</form>

<style>
  /* Set your monospace font  */
  /* Required to have the editor working correctly! */
  :global(.carta-font-code) {
    font-family: monospace;
    font-size: 1.1rem;
    line-height: 1.1rem;
    letter-spacing: normal;
  }
</style>