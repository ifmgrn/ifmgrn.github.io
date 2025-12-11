<script lang="ts">
	import ElementCell from "./ElementCell.svelte";

	const { atoms }: { atoms: Atom[] } = $props();

	let maxGroup = 0;
	let maxPeriod = 0;

	for (const a of atoms) {
		if (a.group > maxGroup) maxGroup = a.group;
		if (a.period > maxPeriod) maxPeriod = a.period;
	}

	const mainTable: (Atom | null)[][] = Array.from({ length: maxPeriod }, () =>
		new Array(maxGroup).fill(null),
	);
	const lanthanides: Atom[] = [];
	const actinides: Atom[] = [];

	for (const a of atoms) {
		const { period, group, chemical_serie } = a;

		if (chemical_serie === "Lantanídeo") lanthanides.push(a);
		else if (chemical_serie === "Actinídeo") actinides.push(a);
		else {
			mainTable[period - 1][group - 1] = a;
		}
	}

	lanthanides.sort((a, b) => a.atomic_number - b.atomic_number);
	actinides.sort((a, b) => a.atomic_number - b.atomic_number);
</script>

<table>
	<colgroup>
		<col span="1" style="width: 2ch;">
		<col span="18">
	</colgroup>
	<tbody>
		<tr class="group">
			<td></td>
			{#each mainTable[0] as _, group}
				<td>{group + 1}</td>
			{/each}
		</tr>
	{#each mainTable as row, period}
		<tr>
			<td class="period">{period + 1}</td>
			{#each row as element, group}
				{#if period === 1 && group > 1 && group < 5}
					{#if group === 2}
						<td colspan="3" class="Legenda">
							<span style="display: block;"><b>Estado da matéria (cor do nome):</b></span>
							<span class="Gás">GÁS&nbsp;</span>
							<span class="Líquido">LÍQUIDO&nbsp;</span>
							<span class="Sólido">SÓLIDO&nbsp;</span>
							<span class="Desconhecido">DESCONHECIDO</span>
						</td>
					{/if}

				{:else if period === 2 && group > 4 && group < 12}
						{#if group === 5}
							<td colspan="7" class="Classificações">
								<span><b>Classificação por famílias (cor do símbolo):</b></span>
								<div class="Quadro">
									<div>
										<span class="Quadrado Semimetal"></span>
										<span>Semimetal</span>
									</div>
									<div>
										<span class="Quadrado Gás-Nobre"></span>
										<span>Gás Nobre</span>
									</div>

									<div>
										<span class="Quadrado Halogênio"></span>
										<span>Halogênio</span>
									</div>
									<div>
										<span class="Quadrado Lantanídeo"></span>
										<span>Lantanídeo</span>
									</div>
									<div>
										<span class="Quadrado Actinídeo"></span>
										<span>Actinídeo</span>
									</div>
									<div>
										<span class="Quadrado Não-Metal"></span>
										<span>Não-Metal</span>
									</div>

									<div>
										<span class="Quadrado Metal-Alcalino"></span>
										<span>Metal Alcalino</span>
									</div>
									<div>
										<span class="Quadrado Metal-Pós-Transição"></span>
										<span>Metal Pós Transição</span>
									</div>
									<div>
										<span class="Quadrado Metal-de-Transição"></span>
										<span>Metal de Transição</span>
									</div>
									<div>
										<span class="Quadrado Metal-Alcalino-Terroso"></span>
										<span>Metal Alcalino-Terroso</span>
									</div>
								</div>
							</td>
						{/if}
				
					{:else if period === 0 && group === 8}
							<td>
								<ElementCell element={atoms[0]} legend={true} />
							</td>
					{:else}
					<td>
						{#if element}
							<ElementCell {element} />
						{/if}
					</td>
				{/if}
			{/each}
		</tr>
	{/each}
	</tbody>
</table>

<table>
	<colgroup>
		<col span="15">
	</colgroup>
	<tbody>
	<tr>
		{#each lanthanides as element}
			<td>
				{#if element}
					<ElementCell {element} />
				{/if}
			</td>
		{/each}
	</tr>
	<tr>
		{#each actinides as element}
			<td>
				{#if element}
					<ElementCell {element} />
				{/if}
			</td>
		{/each}
	</tr>
	</tbody>
</table>

<style>
	table {
		table-layout: fixed;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 1.25em;
		border-collapse: collapse;
	}

	col {
		width: 3.75em;
	}

	td {
		padding: 0.125em;
	}

	tr.group {
		text-align: center;
	}

	.Legenda {
		font-size: 0.6em;
	}

	.Legenda > span {
		color: var(--name-color);
	}

	.Classificações {
		font-size: 0.6em;
	}

	.Classificações .Quadro {
		display: grid;
		grid-template-columns: repeat(3, 1fr); /* 4 columns of equal width */

	}

	.Quadrado {
		display: inline-block;
		width: 8px;
		height: 8px;
		background-color: var(--color);
	}
</style>