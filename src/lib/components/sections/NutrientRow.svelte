<!--Row for each Nutrient added-->
<script lang='ts'>
  import { wUnits, lUnits, type InputFieldProperties } from '$lib/definitions/definitions';
	import TextInput from '$lib/components/basic/TextInput.svelte';
	import Dropdown from '$lib/components/basic/Dropdown.svelte';
	import ButtonMinus from '$lib/components/basic/ButtonMinus.svelte';
	import ButtonPlus from '$lib/components/basic/ButtonPlus.svelte';

  let {
    solId, // Solution ID
    nutId, // Nutrient ID
    nutrient, // Nutrient data
    single, // Marker for when this is the only row to display
    last, // Marker for if this is the last row to display
    onChange // Function to call on change
  } = $props();
  
  // Object of all input values
  const value: InputFieldProperties = $state({
    name: nutrient.name == '' ? undefined : nutrient.name,
    amount: nutrient.amount == -1 ? undefined : nutrient.amount,
    unit: nutrient.unit
  });

  // Object of all input error states
  const error: InputFieldProperties = $state({
    name: 0,
    amount: 0,
    unit: 0
  });

  function checkFieldEntry(key: string) {
    const newValue = sanitizeEntry(key);
    error[key] = determineErrorState(key, newValue);
    value[key] = newValue;

    // If the field does not contain an error, update the stored data
    if (error[key] == 0)
      onChange(['solutions', solId, 'nutrients', nutId, key], newValue);
  }

  // Ensure the information added by the user is safe
  function sanitizeEntry(key: string): (number|string|undefined) {
    switch (key) {
      case 'name':
      case 'unit':
        return <string> value[key];
      case 'amount':
        if (<number> value[key] <= 0)
          return undefined;
        return <number> value[key];
      default:
        throw new Error('Unknown key name used for Product entry.');
    }
  }

  function determineErrorState(key: string, value: number|string|undefined) {
    switch (key) {
      // Check if the name field is empty or if it matches one of the required nutrients
      case 'name':
        if ((<string> value).replaceAll(' ', '') === '')
          return 2;
        else
          return 0;

      // Check the units
      case 'unit':
        if (value === '')
          return 2;
        return 0;

      // Check the number fields are not empty or 0
      case 'amount':
        if (value == undefined)
          return 2;
        else if (Number(value) == 0)
          return 1;
        return 0;
      default:
        throw new Error('Unknown key name used for Product entry.');
    }
  }
</script>

<!--Desktop-->
<div class="nutrient-row min-w-full flex flex-col md:flex-row md:flex-wrap md:gap-3 justify-center items-center">
  <!--Add the nutrient name field-->
  <div class="hidden md:flex gap-3 justify-center items-center">
    <!--Add the nutrient name field-->
    <TextInput 
      placeholder="Nutrient Name"
      tagName="desktop-nut{nutId}-name"
      error={<number> error.name}
      type="text"
      tooltip="Use the EXACT same name that you will use for your product ingredients."
      bind:value={value.name}
      onchange={() => checkFieldEntry('name')}
    />

    <!--Add the nutrient amount field-->
    <TextInput
      placeholder="Amount"
      tagName="desktop-nut{nutId}-amount"
      error={<number> error.amount}
      tooltip="Enter the amount of this nutrient required in your final solution."
      bind:value={value.amount}
      onchange={() => checkFieldEntry('amount')}
    />

    <!--Add the nutrient unit dropdown-->
    <Dropdown 
      name="Unit"
      tagName="desktop-nut{nutId}-unit"
      error={<number> error.unit}
      bind:selected={value.unit}
      onchange={() => checkFieldEntry('unit')}
      options={[...wUnits, ...lUnits]}
    />

    <!--Don't include a remove button if this is the only row-->
    {#if !single}
      <ButtonMinus onclick={() => onChange(['solutions', solId, 'nutrients'], nutId, 'deleteArrayEntry')} />
    {/if}

    <!--Add a button to add a new row if the last nutrient being added-->
    {#if last}
      <ButtonPlus onclick={() => onChange(['solutions', solId, 'nutrients'], null, 'addArrayEntry')} />
    {:else}
      <div class="w-10 h-1"></div>
    {/if}
  </div>
</div>

<!--Mobile Display-->
<div class="md:hidden flex flex-col justify-center items-center gap-3 p-8 bg-base-300 rounded-2xl">
  <div class="container">
    <!--Add the nutrient name field-->
    <TextInput 
      placeholder="Nutrient Name"
      tagName="mobile-nut{nutId}-name"
      error={<number> error.name}
      type="text"
      bind:value={value.name}
      onchange={() => checkFieldEntry('name')}
    />
  </div>
  <div class="flex justify-center items-center gap-3 md:hidden flex justify-center items-center container ">
    
    <!--Add the nutrient amount field-->
    <TextInput
      placeholder="Amount"
      tagName="mobile-nut{nutId}-amount"
      error={<number> error.amount}
      bind:value={value.amount}
      onchange={() => checkFieldEntry('amount')}
    />

    <!--Add the nutrient unit dropdown-->
    <Dropdown 
      name="Unit"
      tagName="mobile-nut{nutId}-unit"
      error={<number> error.unit}
      bind:selected={value.unit}
      onchange={() => checkFieldEntry('unit')}
      options={wUnits}
    />
  </div>
  <div>
    <!--Don't include a remove button if this is the only row-->
    {#if !single}
      <ButtonMinus onclick={() => onChange(['solutions', solId, 'nutrients'], nutId, 'deleteArrayEntry')} />
    {/if}

    <!--Add a button to add a new row if the last nutrient being added-->
    {#if last}
      <ButtonPlus onclick={() => onChange(['solutions', solId, 'nutrients'], null, 'addArrayEntry')} />
    {/if}
  </div>
</div>