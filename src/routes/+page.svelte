<script lang="ts">
  import './style.css';
  import { onMount } from 'svelte';
  import { pageId } from './stores.ts'
  pageId.set('home');

  // Interfaces
  import type { Data, AllSolutions, Results } from '$lib/definitions/definitions.ts';

  // Utilities
  import { ts } from './script.ts';

  // Components
	import SolutionsSection from '$lib/components/sections/SolutionsSection.svelte';
	import Instructions from '$lib/components/sections/Instructions.svelte';
	import NutrientsSection from '$lib/components/sections/NutrientsSection.svelte';
	import ProductsSection from '$lib/components/sections/ProductsSection.svelte';
	import SolutionsSelector from '$lib/components/sections/SolutionsSelector.svelte';

  // Prepare the data object
  let data: AllSolutions = $state({
      selected: 0,
      solutions: []
    });

  // Solution results object
  let results: Results[]|null = $state(null);

  // Load cached data if available on page load
  onMount(() => {
    data = getCookie();
  });

  // Fetch the data from local storage
  function getCookie(): AllSolutions {
    const stored = JSON.parse(<string> localStorage.getItem('data'));

    // Convert the stringified object back into instances of each required class
    if (stored && stored.solutions.length > 0)
      return ts.fromJSON(stored);
    // Prepare an example data object if no Solutions exit
    else
      return ts.setExampleData(data);

  }

  // Save the solutions data to local storage
  function setCookie() {
    localStorage.setItem('data', ts.toJSON(data));
  }

  /**
   * Determine the updates that need to occur as passed by the parameters from the children
   * @param path
   * @param value
   */
  function onChange(path: (string|number)[], value: any, func: (string|null) = null) {
    // Attempt to call a function dynamically from the data script if it exists
    if (func) {
      try { ts[func as keyof Data](data, path, value); }
      catch (err) {
        if (err instanceof Error && err.message == 'ts[func] is not a function')
          console.log(`ts.${func}() is not a function.`);
        else if (err instanceof Error)
          console.log(err);
      }
    }
    // Update the requested property in the data if the called function doesn't exist
    else {
      try { ts.updateData(data, path, value); }
      catch (err) {
        if (err instanceof Error)
          console.log(err.message);
      }
    }
  }

  // On any change to the data object, save it to local storage and update the optimized results
  $effect(() => {
    setCookie();
    results = ts.updateSolutionResults(data);
  });

</script>

<!--Show the solution selector on all pages at the top except for the Home/Instructions page-->
{#if $pageId != 'home'}
<SolutionsSelector 
  {data}
  {onChange}
/>
{/if}

<!--Show the Instructions page section-->
{#if $pageId == 'home'}
  <Instructions />

<!--Show the Nutrients page section-->
{:else if $pageId == 'nutrients'}
  <NutrientsSection
    solId={data.selected}
    nutrients={data.solutions[data.selected] ? data.solutions[data.selected].nutrients : null}
    onChange={onChange}
  />

<!--Show the Products page section-->
{:else if $pageId == 'products'}
  <ProductsSection
    solId={data.selected}
    products={data.solutions[data.selected] ? data.solutions[data.selected].products : null}
    nutrientNames={data.solutions[data.selected] ? data.solutions[data.selected].nutrients.map(entry => entry.name) : null}
    onChange={onChange}
  />

<!--Show the Solutions page section-->
{:else if $pageId == 'solutions'}
  <SolutionsSection
    {results}
  />
{/if}