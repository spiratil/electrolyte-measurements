<script lang="ts">  
	import Header from '$lib/components/basic/Header.svelte';
	import IntroParagraph from '$lib/components/basic/IntroParagraph.svelte';
	import SolutionsNutrientRow from '$lib/components/sections/SolutionsNutrientRow.svelte';
	import SolutionsNutrientTable from '$lib/components/sections/SolutionsNutrientTable.svelte';
	import SolutionsRowTable from '$lib/components/sections/SolutionsTable.svelte';
	import SolutionsRow from '$lib/components/sections/SolutionsRow.svelte';

  let { results } = $props();
  // Show the nutrient optimised results by default
  let resToShow: boolean = $state(false);
  let result = $derived(results && results[resToShow == false ? 0 : 1]);
</script>

<div class="m-5 lg:m-10 p-5 lg:p-15 flex flex-col gap-3 items-center justify-center bg-base-200 rounded-2xl outline-2">
  <div class="my-3">
    <Header type='h2' center title='Final Solution Recipe' />
  </div>

  {#if result}
    <!--Show the warning for no solutions added-->
    {#if result.nutrients.length == 0 || result.products.length == 0}
      <p class="text-error text-3xl font-error font-mono">-No Nutrients/Products-</p>
      <IntroParagraph
        center={true}  
        text={'Your solution can not be calculated until you have added Nutrients that you want in your solution and Products that will be used to create it.'}
      />

    <!--Show the warning for unfeasible solutions-->
    {:else if !result.feasible}
      <p class="text-error text-3xl font-error">-Results Not Feasible-</p>
      <IntroParagraph
        center={true}  
        text={'Your solution can not be determined because the products you have entered do not contain the ingredients that meet your required nutrients.'}
      />
      <Header type='h3' title='Suggestions' />
      <ol class="list bg-base-100 rounded-box shadow-md">
        <li class="list-row flex gap-10 items-center">
          <p class="text-5xl text-accent italic">1</p>
          <p class="text-xl">Check that each of your required nutrients are included as an ingredient in at least one of your products.</p>
        </li>
        <li class="list-row flex gap-10 items-center">
          <p class="text-5xl text-accent italic">2</p>
          <p class="text-xl">Make sure your nutrients and ingredients have the same names.</p>
        </li>
        <li class="list-row flex gap-10 items-center">
          <p class="text-5xl text-accent italic">3</p>
          <p class="text-xl">Add at least two products otherwise there is nothing for that needs to be calculated.</p>
        </li>
      </ol>

    <!--Show the warning for unbounded solutions-->
    {:else if !result.bounded}
      <p class="text-error text-3xl font-error">-Results Unbounded-</p>
      <IntroParagraph
        center={true}  
        text={'Your calculated solution determined nonsense results. This happens when too the data is unrealistic or the results are impossible to optimize.'}
      />
      <Header type='h3' title='Suggestions' />
      <ol class="list bg-base-100 rounded-box shadow-md">
        <li class="list-row flex gap-10 items-center">
          <p class="text-5xl text-accent italic">1</p>
          <p class="text-xl">Check that your data is entered correctly.</p>
        </li>
        <li class="list-row flex gap-10 items-center">
          <p class="text-5xl text-accent italic">2</p>
          <p class="text-xl">Check your units carefully. If a required nutrient is 1g but your product only has 1μg / mcg per serve, this will produce errors.</p>
        </li>
      </ol>

    <!--Show the solution results-->
    {:else}
      <!--Display the total cost of the solution-->
      <div class="p-4 sm:p-8 sm:block flex flex-col justify-center items-center bg-base-300 rounded-2xl">
        <!--Hide the cost optimised option if the the optimisation is unbounded or unfeasible-->
        {#if !results[1].feasible || !results[1].bounded}
        <div class="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-3 mb-5">
          <Header type="h4" title="Optimize Nutrients" />
          <div class="tooltip" data-tip="The cost is impossible to optimize with your current products and nutrient requirements.">
            <input type="checkbox" disabled class="toggle toggle-xl rotate-90 sm:rotate-none" />
          </div>
          <Header type="h4" title="Optimize Cost (Unavailable)" />
        </div>
        <!--Display the checkbox for the optimisation type-->
        {:else}
          <div class="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-3 mb-5">
            <Header type="h4" title="Optimize Nutrients" />
            <input type="checkbox" bind:checked={resToShow} class="toggle toggle-xl border-secondary bg-secondary checked:border-secondary checked:bg-secondary rotate-90 sm:rotate-none" />
            <Header type="h4" title="Optimize Cost" />
          </div>
        {/if}

        <IntroParagraph
          center={true}  
          text={`The above ratio of ingredients results in the following price.`}
        />
        <p class="flex justify-center items-center gap-3 sm:ro"><span class="text-accent text-5xl">${result.price.toFixed(2)}</span> per solution</p>
      </div>

      <div class="p-4 sm:p-8 pb-0 sm:pb-8 bg-base-300 rounded-2xl">
        <IntroParagraph
          center={true}  
          text={'Below are the amounts of each product required for your solution.'}
        />
        <!--Solution results for desktop-->
        <div class="overflow-x-auto hidden sm:block">
          <table class="table ">
            <thead>
              <tr class="text-lg text-center text-secondary">
                <th>Product</th>
                <th>Solution<br>Amount</th>
                <th>Number of<br>Serves</th>
                <th>Product<br>Total Serves</th>
              </tr>
            </thead>
            <tbody>
              {#each result.products as product}
                <SolutionsRowTable {product} />
              {/each}
            </tbody>
          </table>
        </div>

        <!--Solution results for mobile-->
        <div class="block sm:hidden py-4 bg-base-300 rounded-2xl">
          {#each result.products as product, index}
            <SolutionsRow {product} />
            {#if (index != result.nutrients.length - 1)}
              <div class="divider"></div>
            {/if}
          {/each}
        </div>
      </div>

      <div class="p-4 sm:p-8 bg-base-300 rounded-2xl">
        <IntroParagraph
          center={true}  
          text={'This solution will contain the following nutrients.'}
        />

        <!--Solution nutrient results for desktop-->
        <div class="overflow-x-auto hidden sm:block">
          <table class="table">
            <thead>
              <tr class="text-lg text-center text-secondary">
                <th>Required<br>Nutrient</th>
                <th>Nutrient</th>
                <th>Solution<br>Amount</th>
                <th>Target<br>Difference</th>
              </tr>
            </thead>
            <tbody>
              {#each result.nutrients as nutrient}
                <SolutionsNutrientTable {nutrient} />
              {/each}
            </tbody>
          </table>
        </div>

        <!--Solution nutrient results for mobile-->
        <div class="overflow-x-auto block sm:hidden">
          {#each result.nutrients as nutrient, index}
            <SolutionsNutrientRow {nutrient} />
            {#if (index != result.nutrients.length - 1)}
              <div class="divider"></div>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <IntroParagraph
      center={true}  
      text={'Add a solution above, and then add your required nutrients and products. Come back here afterwards to see your final solution.'}
    />
  {/if}

</div>

<style>
  .font-error {
    font-family: var(--font-sans);
  }

  .toggle::before {
    color: color-mix(in oklab, var(--color-base-content) 50%, #0000);
  }
</style>