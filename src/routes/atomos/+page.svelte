<script lang="ts">
import PeriodicTable from "$lib/components/Atoms/PeriodicTable.svelte";

const { data } = $props();
</script>

<h1 class="h1 text-center">Tabela Períodica</h1>

<PeriodicTable atoms={data.atoms} />