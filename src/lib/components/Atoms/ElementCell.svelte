<script lang="ts">
	const { element, legend }: { element: Atom; legend?: boolean } = $props();

	const classes = [
		"Elemento",
		element.chemical_serie.replaceAll(" ", "-"),
		element.state ?? "Desconhecido"
	];
	if (legend) classes.push("Legenda");

	const atomic_weight = element.short_lived ? `(${element.atomic_weight})` : element.atomic_weight;
</script>

<div class={classes}>
	<span class="atomic-number">{element.atomic_number}</span>
	<abbr class="symbol">{element.symbol}</abbr>
	<span class="name">{element.name}</span>
	<span class="atomic-weight">{atomic_weight}</span>
</div>

<style>
	.Elemento > * {
		line-height: 1.2;
		display: block;
		font-style: normal;
		font-weight: normal;
	}

	.atomic-number {
		font-size: 0.65em;
		position: relative;
	}

	.Legenda > *::before, .Legenda > *::after {
		/*content: "";*/
		--tw-text-opacity: 1;
		color: rgb(156 163 175/var(--tw-text-opacity,1));

		transform: translateY(-50%);

		font-size: .625rem;

		padding-left: 1rem;
		padding-right: 1rem;

		--tw-text-opacity: 1;
		color: rgb(75 85 99/var(--tw-text-opacity,1));
		display: block;
		font-weight: 300;
		padding-left: 1rem;
		padding-right: 1rem;
		position: absolute;
		text-align: left;
		top: 50%;
		white-space: nowrap;
	}

	.Legenda > *::before {
		--tw-border-opacity: 1;
		border-bottom-color: #d1d5db33;
		border-bottom: 1px rgb(209 213 219/var(--tw-border-opacity,1));
		border-style: dashed;
		padding-right: 0;
		transform: initial;
	}

	.Legenda .atomic-number::after {
		content: "Número atômico";
		right: 100%;
		text-align: right;
	}

	.Legenda .atomic-weight::after {
		content: "Peso atômico";
		right: 100%;
		text-align: right;
	}

	.Legenda .atomic-number::before, .Legenda .atomic-weight::before {
		right: 100%;
	}

	.Legenda .name::after {
		content: "Nome";
		left: 100%;
		text-align: left;
	}

	.Legenda .symbol::after {
		content: "Símbolo";
		left: 100%;
		text-align: left;
	}

	.Legenda .name::before, .Legenda .symbol::before {
		left: 100%;
	}

	.symbol {
		font-size: 1.5em;
		font-weight: 600;
		margin-bottom: 4px;
		text-align: center;
		color: var(--color);
		position: relative;
	}

	.name {
		font-size: 0.55em;
		color: var(--name-color);
		text-align: center;
		position: relative;
	}

	.atomic-weight {
		text-overflow: ellipsis;
		font-size: 0.55em;
		text-align: center;
		position: relative;
	}

	.Elemento {
		white-space: nowrap;
		border-color: var(--color);
		border-width: 2px;
		border-style: solid;
	}
</style>