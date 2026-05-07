<script lang="ts">
	import ElementCell, { type RequiredAtomFields } from "./ElementCell.svelte";

	type MinimalAtom = Pick<Atom, "group" | "period" | "chemical_serie" | "atomic_number" | RequiredAtomFields>;
	const { atoms }: { atoms: MinimalAtom[] } = $props();

	let maxGroup = 0;
	let maxPeriod = 0;

	for (const a of atoms) {
		if (a.group > maxGroup) { maxGroup = a.group; }
		if (a.period > maxPeriod) { maxPeriod = a.period; }
	}

	const mainTable: (MinimalAtom | null)[][] = Array.from({ length: maxPeriod }, () =>
		new Array(maxGroup).fill(null),
	);
	const lanthanides: MinimalAtom[] = [];
	const actinides: MinimalAtom[] = [];

	for (const a of atoms) {
		const { period, group, chemical_serie } = a;

		if (chemical_serie === "Lantanídeo") { lanthanides.push(a); }
		else if (chemical_serie === "Actinídeo") { actinides.push(a); }
		else {
			mainTable[period - 1][group - 1] = a;
		}
	}

	lanthanides.sort((a, b) => a.atomic_number - b.atomic_number);
	actinides.sort((a, b) => a.atomic_number - b.atomic_number);
</script>

<div class="overflow-x-auto">
	<table class="min-w-full w-fit mx-auto mb-5 table-fixed border-collapse [&_td]:p-0.5">
		<colgroup>
			<col span="1" class="w-[2ch]">
			<col span="18" class="w-15">
		</colgroup>
		<tbody>
			<tr class="text-center">
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
							<td colspan="3" class="text-[0.6rem] [&>span]:text-(--name-color)">
								<span class="block"><b>Estado da matéria (cor do nome):</b></span>
								<span class="Gás">GÁS&nbsp;</span>
								<span class="Líquido">LÍQUIDO&nbsp;</span>
								<span class="Sólido">SÓLIDO&nbsp;</span>
								<span class="Desconhecido">DESCONHECIDO</span>
							</td>
						{/if}

					{:else if period === 2 && group > 4 && group < 12}
							{#if group === 5}
								<td colspan="7" class="text-[0.6rem]">
									<span><b>Classificação por famílias (cor do símbolo):</b></span>
									<div class="grid grid-cols-3">
										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Semimetal"></span>
											<span>Semimetal</span>
										</div>
										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Gás-Nobre"></span>
											<span>Gás Nobre</span>
										</div>

										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Halogênio"></span>
											<span>Halogênio</span>
										</div>
										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Lantanídeo"></span>
											<span>Lantanídeo</span>
										</div>
										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Actinídeo"></span>
											<span>Actinídeo</span>
										</div>
										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Não-Metal"></span>
											<span>Não-Metal</span>
										</div>

										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Metal-Alcalino"></span>
											<span>Metal Alcalino</span>
										</div>
										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Metal-Pós-Transição"></span>
											<span>Metal Pós Transição</span>
										</div>
										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Metal-de-Transição"></span>
											<span>Metal de Transição</span>
										</div>
										<div>
											<span class="inline-block w-2 h-2 bg-(--color) Metal-Alcalino-Terroso"></span>
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

	<table class="w-fit mx-auto mb-5 table-fixed border-collapse [&_td]:p-0.5">
		<colgroup>
			<col span="15" class="w-15">
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
</div>
