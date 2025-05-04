<!--Nutrient ratio results box for Mobile only-->
<script lang="ts">
	import Header from "$lib/components/basic/Header.svelte";
  let { nutrient } = $props(); // Nutrient results data
</script>

<div class="my-3">
  <Header type="h3" center title={nutrient.name}/>
  <p class="text-center text-md flex justify-center items-center gap-3">Sol Amount: <span class="text-3xl text-accent">{nutrient.amount} {nutrient.unit}</span></p>
  <p class="text-center text-md flex justify-center items-center gap-3">Req Difference:
    {#if nutrient.requirement}
      <!--Display exact is the target difference is 0, otherwise display the difference with the units-->
      <span class="text-center text-3xl {Number(nutrient.targetDifference) >= 0 ? 'text-success' : 'text-error'}">
        {Number(nutrient.targetDifference) != 0 ? `${Math.abs(nutrient.targetDifference)} ${nutrient.targetUnit} ${nutrient.targetDifference >= 0 ? 'over' : 'under'}` : 'exact'}
      </span>
    {:else}
      extra
    {/if}
  </p>
</div>