<script lang="ts">
	import ElementCell from "./ElementCell.svelte";

	const { element, onclose }: { element: Atom | null; onclose: () => void } = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	const formatValue = (value: number | null, unit = "") =>
		value == null ? "Desconhecido" : `${value} ${unit}`.trim();

	const formatTemperature = (value: number | null) =>
		value == null
			? "Desconhecido"
			: `${value.toLocaleString("pt-BR")} K (${(value - 273.15).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} °C)`;

	const formatList = (values: number[]) =>
		values.length ? values.join(", ") : "Nenhum";

	$effect(() => {
		if (!dialog) { return; }

		if (element && !dialog.open) {
			dialog.showModal();
		} else if (!element && dialog.open) {
			dialog.close();
		}
	});
</script>

<!-- biome-ignore lint/a11y/useKeyWithClickEvents: dialog já tem key handling nativo -->
<dialog
	bind:this={dialog}
	{onclose}
	onclick={(e) => {
		if (e.target === dialog) { dialog?.close(); }
	}}
	class="m-auto max-h-[90dvh] w-[min(92vw,32rem)] overflow-hidden rounded-lg p-0 backdrop:bg-black/50"
	aria-label={element ? `Detalhes de ${element.name}` : undefined}
>
	{#if element}
		<button
		type="button"
		class="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full text-2xl leading-none hover:bg-black/10 focus-visible:outline-2"
		aria-label="Fechar detalhes"
		onclick={() => dialog?.close()}
	>
		&times;
	</button>

	<div class="max-h-[90dvh] overflow-y-auto p-5 sm:p-6">
		<div class="p-5 sm:p-6">
			<div class="flex items-start gap-5">
				<div class="w-24 shrink-0 text-xl">
					<ElementCell {element} />
				</div>

				<div class="min-w-0 flex-1">
					<h2 class="text-2xl font-bold tracking-tight">
						{element.name}
					</h2>

					<p class="mt-1 text-sm">
						{element.chemical_serie}
					</p>

					<p class="mt-2 text-sm ">
						Símbolo:
						<span class="font-semibold ">{element.symbol}</span>
					</p>
				</div>
			</div>

			<section class="mt-6">
				<h3 class="mb-3 border-b border-gray-200 pb-2 text-base font-bold ">
					Classificação
				</h3>

				<dl class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
					<dt class="font-medium ">Número atômico</dt>
					<dd class="font-semibold">{element.atomic_number}</dd>

					<dt class="font-medium ">Massa atômica</dt>
					<dd class="font-semibold">
						{element.atomic_weight}
						{element.short_lived ? " (isótopo mais estável)" : ""}
					</dd>

					<dt class="font-medium ">Grupo</dt>
					<dd class="font-semibold">{element.group}</dd>

					<dt class="font-medium ">Período</dt>
					<dd class="font-semibold">{element.period}</dd>

					<dt class="font-medium ">Série química</dt>
					<dd class="font-semibold">{element.chemical_serie}</dd>

					<dt class="font-medium ">Estado físico</dt>
					<dd class="font-semibold">{element.state ?? "Desconhecido"}</dd>

					<dt class="font-medium ">Estados de oxidação</dt>
					<dd class="break-words font-semibold">
						{formatList(element.oxidation_states)}
					</dd>
				</dl>
			</section>

			<section class="mt-6">
				<h3 class="mb-3 border-b border-gray-200 pb-2 text-base font-bold ">
					Propriedades atômicas
				</h3>

				<dl class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
					<dt class="font-medium ">Configuração eletrônica</dt>
					<dd class="break-words font-semibold">
						{element.electron_configuration || "Desconhecida"}
					</dd>

					<dt class="font-medium ">Raio atômico</dt>
					<dd class="font-semibold">
						{formatValue(element.atomic_radius_pm, "pm")}
					</dd>

					<dt class="font-medium ">Eletronegatividade</dt>
					<dd class="font-semibold">
						{formatValue(element.electronegativity)}
					</dd>

					<dt class="font-medium ">Afinidade eletrônica</dt>
					<dd class="font-semibold">
						{formatValue(element.electron_affinity_ev, "eV")}
					</dd>

					<dt class="font-medium ">Energia de ionização</dt>
					<dd class="font-semibold">
						{formatValue(element.ionization_energy_ev, "eV")}
					</dd>
				</dl>
			</section>

			<section class="mt-6">
				<h3 class="mb-3 border-b border-gray-200 pb-2 text-base font-bold ">
					Propriedades físicas
				</h3>

				<dl class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
					<dt class="font-medium ">Densidade</dt>
					<dd class="font-semibold">
						{formatValue(element.density_g_cm3, "g/cm³")}
					</dd>

					<dt class="font-medium ">Ponto de fusão</dt>
					<dd class="font-semibold">
						{formatTemperature(element.melting_point_k)}
					</dd>

					<dt class="font-medium ">Ponto de ebulição</dt>
					<dd class="font-semibold">
						{formatTemperature(element.boiling_point_k)}
					</dd>
				</dl>
			</section>

			<section class="mt-6">
				<h3 class="mb-3 border-b border-gray-200 pb-2 text-base font-bold ">
					Descoberta
				</h3>

				<dl class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
					<dt class="font-medium ">Ano de descoberta</dt>
					<dd class="font-semibold">
						{element.discovery_year == null
							? "Antigo"
							: element.discovery_year}
					</dd>

					<dt class="font-medium ">Isótopo de vida curta</dt>
					<dd class="font-semibold">
						{element.short_lived ? "Sim" : "Não"}
					</dd>

					<dt class="font-medium ">Incerteza da massa atômica</dt>
					<dd class="font-semibold">
						{formatValue(element.atomic_weight_uncertainty)}
					</dd>
				</dl>
			</section>
		</div>
	</div>
	{/if}
</dialog>
