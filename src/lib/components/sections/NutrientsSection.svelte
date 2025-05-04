<!--Nutrient page section-->
<script lang='ts'>
	import Header from "$lib/components/basic/Header.svelte";
	import IntroParagraph from "$lib/components/basic/IntroParagraph.svelte";
	import NutrientRow from "$lib/components/sections/NutrientRow.svelte";

  let {
    solId, // Solution ID
    nutrients, // Nutrient data
    onChange // Function to call on change
  } = $props();
</script>

<!--Nutrient box-->
<div class="m-5 lg:m-10 p-5 lg:p-15 flex flex-col gap-3 items-center justify-center bg-base-200 rounded-2xl outline-2">
  <Header type='h2' title='Nutrients' />
  {#if nutrients}
    <IntroParagraph
      center={true}  
      text={'Add the required nutrients and amounts for your solution.'}
    />
    <div class="min-w-full flex flex-col gap-3 justify-center items-center">
      {#each nutrients as nutrient (nutrient.id)}
        <NutrientRow
          {solId}
          nutId={nutrient.id}
          {nutrient}
          single={nutrients.length == 1}
          last={nutrient.id == nutrients.length - 1}
          {onChange}
        />
      {/each}
    </div>
  {:else}
    <IntroParagraph
      center={true}  
      text={'Create a solution above to begin adding nutrients.'}
    />
  {/if}
</div>