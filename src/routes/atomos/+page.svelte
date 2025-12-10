<script lang="ts">
import PeriodicTable from "$lib/components/Atoms/PeriodicTable.svelte";

const { data } = $props();
</script>

<h1>Tabela Períodica</h1>

<PeriodicTable atoms={data.atoms} />