<script lang="ts">
	export type RequiredAtomFields = SomeKeys<Atom, "chemical_serie" | "state" | "atomic_number" | "symbol" | "name" | "atomic_weight" | "short_lived">;
	const { element, legend }: { element: Pick<Atom, RequiredAtomFields>; legend?: boolean } = $props();

	const classes = [
		"Elemento",
		element.chemical_serie.replaceAll(" ", "-"),
		element.state ?? "Desconhecido"
	];
	if (legend) { classes.push("Legenda"); }
</script>

<div class={classes}>
	<span class="atomic-number">{element.atomic_number}</span>
	<abbr class="symbol">{element.symbol}</abbr>
	<span class="name">{element.name}</span>
	<span class="atomic-weight">{element.short_lived ? `(${element.atomic_weight})` : element.atomic_weight}</span>
</div>

<style>
	.Elemento > * {
		display: block;
		font-style: normal;
		font-weight: normal;
		line-height: 1.2;
	}

	.atomic-number {
		position: relative;
		font-size: 0.65em;
	}

	.Legenda > *::before, .Legenda > *::after {
		/*content: "";*/
		--tw-text-opacity: 1;

		position: absolute;
		top: 50%;
		display: block;
		padding-right: 1rem;

		padding-left: 1rem;

		font-size: .625rem;
		font-weight: 300;
		color: rgb(75 85 99/var(--tw-text-opacity,1));
		text-align: left;
		white-space: nowrap;

		transform: translateY(-50%);
	}

	.Legenda > *::before {
		--tw-border-opacity: 1;
		padding-right: 0;
		border-style: dashed;
		border-bottom: 1px rgb(209 213 219/var(--tw-border-opacity,1));
		transform: initial;
	}

	.Legenda .atomic-number::after {
		right: 100%;
		text-align: right;
		content: "Número atômico";
	}

	.Legenda .atomic-weight::after {
		right: 100%;
		text-align: right;
		content: "Peso atômico";
	}

	.Legenda .atomic-number::before, .Legenda .atomic-weight::before {
		right: 100%;
	}

	.Legenda .name::after {
		left: 100%;
		text-align: left;
		content: "Nome";
	}

	.Legenda .symbol::after {
		left: 100%;
		text-align: left;
		content: "Símbolo";
	}

	.Legenda .name::before, .Legenda .symbol::before {
		left: 100%;
	}

	.symbol {
		position: relative;
		margin-bottom: 4px;
		font-size: 1.5em;
		font-weight: 600;
		color: var(--color);
		text-align: center;
	}

	.name {
		position: relative;
		font-size: 0.55em;
		color: var(--name-color);
		text-align: center;
	}

	.atomic-weight {
		position: relative;
		text-overflow: ellipsis;
		font-size: 0.55em;
		text-align: center;
	}

	.Elemento {
		white-space: nowrap;
		border-color: var(--color);
		border-style: solid;
		border-width: 2px;
	}
</style>