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

<h1>{reaction.name}</h1>
<section>
	<ul class="center tree">
		<li>Classificaç{reaction.classifications.length === 1 ? "ão" : "ões"}: {reaction.classifications.join(", ")}</li>
		<li>Reagente(s): {reaction.reactants.join(", ")}</li>
		<li>Produto(s): {reaction.products.join(", ")}</li>
		<li>Equação balanceada: {reaction.equation}</li>
	</ul>
</section>

<section>
	<h2>Demonstração</h2>
	<iframe frameborder="0" title={reaction.name}
	referrerpolicy="strict-origin-when-cross-origin"
	allow="encrypted-media; picture-in-picture" allowfullscreen
	src="https://www.youtube-nocookie.com/embed/{reaction.youtube_video_id}"></iframe>
</section>

<section>
<h2>Instruções</h2>
<!--<SvelteMarkdown source={reaction.description} />-->
<Markdown {carta} value={reaction.description} />
</section>