<!--Row components for the ingredients section-->
<script lang='ts'>
	import TextInput from '$lib/components/basic/TextInput.svelte';
	import Dropdown from '$lib/components/basic/Dropdown.svelte';
	import ButtonMinus from '$lib/components/basic/ButtonMinus.svelte';
	import ButtonPlus from '$lib/components/basic/ButtonPlus.svelte';
	import type { InputFieldProperties } from '$lib/definitions/definitions';

  let {
    solId, // Solution ID
    prodId, // Product ID
    ingId, // Ingredient ID
    productForm, // Form of the product, powder, capsule, etc
    ingredient, // Ingredient data
    nutrientNames, // Names of the required nutrients for checking if an unknown ingredient name is added
    single, // Marker to check if this is the only product row required
    last, // Marker to check if this is the last product row required
    onChange // Function to call on changes
  } = $props();
  
  // Object containing all values for each input field
  const value: InputFieldProperties = $state({
    name: ingredient.name == '' ? undefined : ingredient.name,
    amountPerServe: ingredient.amountPerServe == -1 ? undefined : ingredient.amountPerServe,
    unit: ingredient.unit
  });

  // Object containing all error state values for each field
  const error: InputFieldProperties = $state({
    name: 0,
    amountPerServe: 0,
    unit: 0
  });

  function checkFieldEntry(key: string) {
    const newValue = sanitizeEntry(key);
    error[key] = determineErrorState(key, newValue);
    value[key] = newValue;

    // If the field does not contain an error, update the stored data
    if (error[key] != 2)
      onChange(['solutions', solId, 'products', prodId, 'ingredients', ingId, key], newValue);
  }

  // Ensure the entered field is safe to use
  function sanitizeEntry(key: string): (number|string|undefined) {
    switch (key) {
      case 'name':
      case 'unit':
        return <string> value[key];
      case 'amountPerServe':
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
        if (nutrientNames.includes(value))
          return 0
        else if ((<string> value).replaceAll(' ', '') == '')
            return 2;
        else
          return 1;

      // Check the units
      case 'unit':
        if (value === '')
          return 2;
        return 0;

      // Check the number fields are not empty or 0
      case 'amountPerServe':
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
<div class="min-w-full hidden md:flex gap-3 justify-center items-center px-5 pt-5 bg-base-300 rounded-2xl">
  <!--Add the product name field-->
  <TextInput 
    placeholder="Product Name"
    tagName="desktop-prod{prodId}-ing{ingId}-name"
    error={<number> error.name}
    type="text"
    tooltip={ error.name == 1
              ? 'This ingredient is not included in your nutrients list. If it should be, check the spelling.'
              : 'Enter the ingredient name EXACTLY the same as entered in the Nutrients tab.'
            }
    bind:value={value.name}
    onchange={() => checkFieldEntry('name')}
  />

  <!--Add the nutrient amount field-->
  <TextInput
    placeholder="Amount"
    tagName="desktop-prod{prodId}-ing{ingId}-amount"
    error={<number> error.amountPerServe}
    tooltip="Enter the amount of this nutrient per serve. This can be found in the nutrition table on the back of your product."
    bind:value={value.amountPerServe}
    onchange={() => checkFieldEntry('amountPerServe')}
  />

  <!--Add the nutrient unit dropdown-->
  <Dropdown 
    name="Unit"
    tagName="desktop-prod{prodId}-ing{ingId}-unit"
    error={<number> error.unit}
    tooltip="Enter the units used per serve for this nutrient. This can be found in the nutrition table on the back of your product."
    bind:selected={value.unit}
    onchange={() => checkFieldEntry('unit')}
    form={productForm}
  />

  <!--Don't include a remove button if this is the only row-->
  {#if !single}
    <ButtonMinus onclick={() => onChange(['solutions', solId, 'products', prodId, 'ingredients'], ingId,  'deleteArrayEntry')} />
  {/if}

  <!--Add a button to add a new row if the last nutrient being added-->
  {#if last}
    <ButtonPlus onclick={() => onChange(['solutions', solId, 'products', prodId, 'ingredients'], null, 'addArrayEntry')} />
  {:else}
    <div class="w-7 h-1"></div>
  {/if}

  <!--Add a divider if there are more ingredients listed below-->
  {#if !last}
    <div class="divider m-0"></div>
  {/if}
</div>

<!--Mobiles-->
<div class="min-w-full flex flex-col gap-3 justify-center items-center md:hidden px-5 pt-5 bg-base-300 rounded-2xl">
  <div class="flex gap-3 justify-center items-center">
    <!--Add the product name field-->
    <TextInput 
      placeholder="Product Name"
      tagName="mobile-prod{prodId}-ing{ingId}-name"
      error={<number> error.name}
      type="text"
      tooltip="Enter the ingredient name EXACTLY the same as entered in the Nutrients tab."
      bind:value={value.name}
      onchange={() => checkFieldEntry('name')}
    />
  </div>

  <div class="flex gap-3 justify-center items-center">
    <!--Add the nutrient amount field-->
    <TextInput
      placeholder="Amount"
      tagName="mobile-prod{prodId}-ing{ingId}-amount"
      error={<number> error.amount}
      classes="w-20"
      tooltip="Enter the amount of this nutrient per serve. This can be found in the nutrition table on the back of your product."
      bind:value={value.amountPerServe}
      onchange={() => checkFieldEntry('amountPerServe')}
    />

    <!--Add the nutrient unit dropdown-->
    <Dropdown 
      name="Unit"
      tagName="mobile-prod{prodId}-ing{ingId}-unit"
      error={<number> error.unit}
      tooltip="Enter the units used per serve for this nutrient. This can be found in the nutrition table on the back of your product."
      bind:selected={value.unit}
      onchange={() => checkFieldEntry('unit')}
      form={productForm}
    />
  </div>

  <div class="flex gap-3 justify-center items-center">
    <!--Don't include a remove button if this is the only row-->
    {#if !single}
      <ButtonMinus onclick={() => onChange(['solutions', solId, 'products', prodId, 'ingredients'], ingId,  'deleteArrayEntry')} />
    {/if}

    <!--Add a button to add a new row if the last nutrient being added-->
    {#if last}
      <ButtonPlus onclick={() => onChange(['solutions', solId, 'products', prodId, 'ingredients'], null, 'addArrayEntry')} />
    {/if}
  </div>
  {#if !last}
    <div class="divider m-0"></div>
  {/if}
</div>