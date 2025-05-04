<!--Solutions selector box-->
<script lang="ts">
  import Header from "$lib/components/basic/Header.svelte";
  import IntroParagraph from "$lib/components/basic/IntroParagraph.svelte";
  import TextInput from "$lib/components/basic/TextInput.svelte";
	import ButtonPlus from "$lib/components/basic/ButtonPlus.svelte";
	import ButtonMinus from "$lib/components/basic/ButtonMinus.svelte";

  let {
    data, // All solutions data
    onChange // Function to call on change
  } = $props();

  let selectedId = $derived(data.selected);
  let newSolutionName = $state('');
  let error = $state(0);

  function addNewSolution() {
    error = checkNewSolutionName(newSolutionName);
    if (error == 2) // Display a red border around the name input
      return;

    onChange(['solutions'], newSolutionName, 'addArrayEntry');
    newSolutionName = '';
  }

  // Ensure that a name is included when adding new solutions
  function checkNewSolutionName(newName: string): number {
    return newName.replaceAll(' ', '') === '' ? 2 : 0;
  }
</script>

<!--Solutions selector box-->
<div class="m-5 lg:m-10 p-5 lg:p-15 bg-base-200 rounded-2xl flex flex-col justify-center items-center gap-3 outline-2">
  <Header type='h2' title='Current Solution' />
  <IntroParagraph
    center={true}  
    text={'Choose your active solution or add a new one.'}
  />
  
  <div class="flex flex-wrap justify-center items-center gap-3 lg:gap-10">
    <!--Solution selector dropdown menu-->
    {#if data.solutions.length != 0}
      <div class="flex gap-3 items-center justify-center {data.length == 0 ? "hide" : "show"}">
        <label class="floating-label select select-lg" for="solution-selector">
          <select
            class="dropdown"
            id="solution-selector"
            bind:value={selectedId}
            onchange={() => onChange(['selected'], selectedId)}>
            {#each data.solutions as solution, i}
              {#if data.selected == solution.id}
                <option value={i} selected>{solution.name}</option>
              {:else}
                <option value={i}>{solution.name}</option>
              {/if}
            {/each}
          </select>
          <span class="absolute left-0 top-0 text-sm px-2 pointer-events-non">Solution</span>
        </label>
        <ButtonMinus onclick={onChange(['solutions'], selectedId, 'deleteArrayEntry')} />
      </div>
    {/if}

    <!--New solution adder-->
    <form class="flex gap-3 items-center justify-center">
      <TextInput
        placeholder="New Solution Name"
        tagName="solution-adder"
        type="text"
        bind:value={newSolutionName}
        {error}
        onchange={null}
      />
      <ButtonPlus onclick={addNewSolution} />
    </form>
  </div>
</div>

<style>
  label span {
    color: color-mix(in oklab, currentColor 60%, transparent);
  }

  select {
    min-width: 100px;
    background-position: calc(100% - 6px) calc(1px + 50%), calc(100% - 2.1px) calc(1px + 50%);
    background-image: linear-gradient(45deg, #0000 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, #0000 50%);
    text-align: center;
    padding-left: 10px;
    padding-right: 18px;
  }
</style>