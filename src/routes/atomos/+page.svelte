<script lang="ts">
import PeriodicTable from "#lib/components/Atoms/PeriodicTable.svelte";

const { data } = $props();
</script>

<svelte:head>
  <title>Tabela Periódica</title>
  <meta name="description" content="Visualização de elementos químicos através de uma tabela periódica.">
</svelte:head>

<PeriodicTable atoms={data.atoms} />