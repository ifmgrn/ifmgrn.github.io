<script lang="ts">
import PeriodicTable from "$lib/components/Atoms/PeriodicTable.svelte";

const { data } = $props();
</script>

<svelte:head>
  <title>Tabela Periódica</title>
  <meta name="description" content="Visualização de elementos químicos através de uma tabela periódica.">
</svelte:head>

<h1 class="h1 text-center">Tabela Períodica</h1>

<PeriodicTable atoms={data.atoms} />