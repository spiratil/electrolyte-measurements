<!--Row for each product-->
<script lang='ts'>
  import { forms, type InputFieldProperties } from '$lib/definitions/definitions';
  import IngredientSection from '$lib/components/sections/IngredientSection.svelte';
	import TextInput from '$lib/components/basic/TextInput.svelte';
	import Dropdown from '$lib/components/basic/Dropdown.svelte';
	import ButtonMinus from '$lib/components/basic/ButtonMinus.svelte';
	import ButtonPlus from '$lib/components/basic/ButtonPlus.svelte';

  let {
    solId, // Solution ID
    prodId, // Product ID
    product, // Product data
    nutrientNames, // List of required nutrient names
    single, // Marker for when this is the only row to display
    last, // Marker for if this is the last row to display
    onChange // Function to call on change
  } = $props();

  // Object of all input values
  const value: InputFieldProperties = $state({
    name: product.name == '' ? undefined : product.name,
    price: product.price == -1 ? undefined : `$${product.price}`,
    form: product.form == '' ? undefined : product.form,
    totalAmount: product.totalAmount == -1 ? undefined : product.totalAmount,
    totalUnits: product.totalUnits,
    serveSize: product.serveSize == -1 ? undefined : product.serveSize,
    serveUnits: product.serveUnits
  });

  // Determine if wider input fields can be used when unnecessary fields are hidden
  let useWiderInputs = $derived(value.form == 'capsule' || value.form == 'tablet' ? true : false);

  // Object of all input error states
  const error: InputFieldProperties = $state({
    name: 0,
    price: 0,
    form: 0,
    totalAmount: 0,
    totalUnits: 0,
    serveSize: 0,
    serveUnits: 0
  });

  function checkFieldEntry(key: string) {
    const newValue = sanitizeEntry(key);
    error[key] = determineErrorState(key, newValue);
    value[key] = key == 'price' ? `$${newValue}` : newValue;

    // If no error is found for the input entry, store the data
    if (error[key] == 0)
      onChange(['solutions', solId, 'products', prodId, key], newValue);
  }

  // Check that the information entered is safe to use
  function sanitizeEntry(key: string): (number|string|undefined) {
    switch (key) {
      case 'name':
      case 'totalUnits':
      case 'serveUnits':
        return <string> value[key];
      case 'form':
        if (value[key] == 'capsule' || value[key] == 'tablet')  {
          value.totalUnits = '';
          value.serveUnits = '';
        }
        return <string> value[key];
      case 'price':
        const extractedValue= (<string> value[key]).match(/[0-9.]*/g)?.join('');
        if (extractedValue)
          return extractedValue;
        return 0;
      case 'totalAmount':
      case 'serveSize':
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
      case 'form':
      case 'totalUnits':
      case 'serveUnits':
        if ((<string> value).replaceAll(' ', '') === '')
          return 2;
        return 0;

      // Check the number fields are not empty or 0
      case 'totalAmount':
      case 'serveSize':
      case 'price':
        if (value == undefined)
          return 2;
        else if (Number(value) == 0)
          return 1;
        return 0;
      default:
        throw new Error('Unknown key name used for Product entry.');
    }
  }
  
  function determineTotalPlaceholder() {
    if (value.form == 'capsule') return 'Total Caps';
    else if (value.form == 'tablet') return 'Total Tabs';
    else return 'Total Amt';
  }

  function determineServePlaceholder() {
    if (value.form == 'capsule') return 'Caps per Serve';
    else if (value.form == 'tablet') return 'Tabs per Serve';
    else return 'Serve Amt';
  }

  function determineTotalTooltip() {
    if (value.form == 'capsule') return 'Enter the total number of capsules in your product.';
    else if (value.form == 'tablet') return 'Enter the total number of tablets in your product.';
    else return 'Enter the total weight/volume of your product.';
  }

  function determineServeTooltip() {
    let tooltip = '';
    if (value.form == 'capsule')
      tooltip += 'Enter the total number of capsules per serve.';
    else if (value.form == 'tablet') 
      tooltip += 'Enter the total number of tablets per serve.';
    else 
      tooltip += 'Enter the total weight/volume per serve of your product.';

    tooltip += 'Check the nutrition table on the back of your product.';
    return tooltip;
  }
</script>

<!--Desktop-->
<div class="min-w-full hidden md:flex flex-col gap-3 justify-center items-center p-8 bg-base-300 rounded-2xl {error ? 'input-error' : ''}">
  <div class="flex gap-3 justify-center items-center">
    <!--Add the product name field-->
    <TextInput 
      placeholder="Product Name"
      tagName="desktop-prod{prodId}-name"
      error={<number> error.name}
      type="text"
      classes="max-w-40"
      bind:value={value.name}
      onchange={() => checkFieldEntry('name')}
    />

    <!--Add the product prices field-->
    <TextInput
      placeholder="Price"
      tagName="desktop-prod{prodId}-price"
      error={<number> error.price}
      type="text"
      classes={useWiderInputs ? 'max-w-20' : 'max-w-15'}
      tooltip="Enter how much you paid per product to possibly optimize your solution by cost. If 0 is entered, the product will be assumed to have no cost."
      bind:value={value.price}
      onchange={() => checkFieldEntry('price')}
    />

    <!--Add the product form dropdown-->
    <Dropdown
      name="Form"
      tagName="desktop-prod{prodId}-form"
      error={<number> error.form}
      tooltip="The product form is important in calculating your required amounts. Take note of the following field prompts depending on your form entered here."
      bind:selected={value.form}
      onchange={() => checkFieldEntry('form')}
      options={forms}
    />

    <!--Add the product amount field-->
    <TextInput
      placeholder={determineTotalPlaceholder()}
      tagName="desktop-prod{prodId}-totalAmt"
      error={<number> error.totalAmount}
      classes={useWiderInputs ? 'max-w-20' : 'max-w-15'}
      tooltip={determineTotalTooltip()}
      bind:value={value.totalAmount}
      onchange={() => checkFieldEntry('totalAmount')}
    />

    <!--Add the product total unit dropdown-->
    {#if value.form != 'capsule' && value.form != 'tablet'}
      <Dropdown
        name="Unit"
        tagName="desktop-prod{prodId}-totalUnit"
        tooltip="Check the front of your product for the units used in the total weight/volume."
        bind:selected={value.totalUnits}
        onchange={() => checkFieldEntry('totalUnits')}
        form={value.form}
      />
    {/if}

    <!--Add the product serve size field-->
    <TextInput
      placeholder={determineServePlaceholder()}
      tagName="desktop-prod{prodId}-serveAmt"
      error={<number> error.serveSize}
      classes={useWiderInputs ? 'max-w-20' : 'max-w-15'}
      tooltip={determineServeTooltip()}
      bind:value={value.serveSize}
      onchange={() => checkFieldEntry('serveSize')}
    />

    <!--Add the product serve unit dropdown-->
    {#if value.form != 'capsule' && value.form != 'tablet'}
      <Dropdown
        name="Unit"
        tagName="desktop-prod{prodId}-serveUnit"
        tooltip="Check the nutrition table on the back of your product for the units used per serve."
        bind:selected={value.serveUnits}
        onchange={() => checkFieldEntry('serveUnits')}
        form={value.form}
      />
    {/if}

    <!--Don't include a remove button if this is the only row-->
    {#if !single}
      <ButtonMinus primary={true} onclick={() => onChange(['solutions', solId, 'products'], prodId, 'deleteArrayEntry')} />
    {/if}

    <!--Add a button to add a new row if the last nutrient being added-->
    {#if last}
      <ButtonPlus primary={true} onclick={() => onChange(['solutions', solId, 'products'], null, 'addArrayEntry')} />
    {:else}
      <div class="w-13 h-1"></div>
    {/if}
  </div>
  <div class="divider m-0"></div>
  <IngredientSection 
    {solId}
    {product}
    {nutrientNames}
    {onChange}
  />
</div>

<!--Mobile-->
<div class="product-row min-w-full flex flex-col gap-3 justify-center items-center md:hidden p-8 bg-base-300 rounded-2xl {error ? 'input-error' : ''}">
  <div class="flex gap-3 justify-center items-center">
    <!--Add the product name field-->
    <TextInput 
      placeholder="Product Name"
      tagName="mobile-prod{prodId}-name"
      error={<number> error.name}
      type="text"
      bind:value={value.name}
      onchange={() => checkFieldEntry('name')}
    />
  </div>

  <div class="flex gap-3 justify-center items-center">
    <!--Add the product form dropdown-->
    <Dropdown
      name="Form"
      tagName="mobile-prod{prodId}-form"
      error={<number> error.form}
      tooltip="The product form is important in calculating your required amounts. Take note of the following field prompts depending on your form entered here."
      bind:selected={value.form}
      onchange={() => checkFieldEntry('form')}
      options={forms}
    />

    <!--Add the product prices field-->
    <TextInput
      placeholder="Price"
      tagName="mobile-prod{prodId}-price"
      error={<number> error.price}
      type="text"
      classes="w-20"
      tooltip="Enter how much you paid per product to possibly optimize your solution by cost. If 0 is entered, the product will be assumed to have no cost."
      bind:value={value.price}
      onchange={() => checkFieldEntry('price')}
    />
  </div>

  {#if value.form == 'capsule' || value.form == 'tablet'}
    <div class="flex gap-3 justify-center items-center">
      <!--Add the product amount field-->
      <TextInput
        placeholder={determineTotalPlaceholder()}
        tagName="desktop-prod{prodId}-totalAmt"
        error={<number> error.totalAmount}
        classes={useWiderInputs ? 'max-w-20' : 'max-w-15'}
        tooltip={determineTotalTooltip()}
        bind:value={value.totalAmount}
        onchange={() => checkFieldEntry('totalAmount')}
      />

      <!--Add the product serve size field-->
      <TextInput
        placeholder={determineServePlaceholder()}
        tagName="desktop-prod{prodId}-serveAmt"
        error={<number> error.serveSize}
        classes={useWiderInputs ? 'max-w-20' : 'max-w-15'}
        tooltip={determineServeTooltip()}
        bind:value={value.serveSize}
        onchange={() => checkFieldEntry('serveSize')}
      />
    </div>
  {:else}
    <div class="flex gap-3 justify-center items-center">
      <!--Add the product amount field-->
      <TextInput
        placeholder={determineTotalPlaceholder()}
        tagName="desktop-prod{prodId}-totalAmt"
        error={<number> error.totalAmount}
        classes={useWiderInputs ? 'max-w-20' : 'max-w-15'}
        tooltip={determineTotalTooltip()}
        bind:value={value.totalAmount}
        onchange={() => checkFieldEntry('totalAmount')}
      />

      <!--Add the product total unit dropdown-->
      <Dropdown
        name="Unit"
        tagName="desktop-prod{prodId}-totalUnit"
        tooltip="Check the front of your product for the units used in the total weight/volume."
        bind:selected={value.totalUnits}
        onchange={() => checkFieldEntry('totalUnits')}
        form={value.form}
      />
    </div>
    <div class="flex gap-3 justify-center items-center">
      <!--Add the product serve size field-->
      <TextInput
        placeholder={determineServePlaceholder()}
        tagName="desktop-prod{prodId}-serveAmt"
        error={<number> error.serveSize}
        classes={useWiderInputs ? 'max-w-20' : 'max-w-15'}
        tooltip={determineServeTooltip()}
        bind:value={value.serveSize}
        onchange={() => checkFieldEntry('serveSize')}
      />

      <!--Add the product serve unit dropdown-->
      <Dropdown
        name="Unit"
        tagName="desktop-prod{prodId}-serveUnit"
        tooltip="Check the nutrition table on the back of your product for the units used per serve."
        bind:selected={value.serveUnits}
        onchange={() => checkFieldEntry('serveUnits')}
        form={value.form}
      />
    </div>
  {/if}

  <div>
    <!--Don't include a remove button if this is the only row-->
    {#if !single}
      <ButtonMinus primary={true} onclick={() => onChange(['solutions', solId, 'products'], prodId, 'deleteArrayEntry')} />
    {/if}

    <!--Add a button to add a new row if the last nutrient being added-->
    {#if last}
      <ButtonPlus primary={true} onclick={() => onChange(['solutions', solId, 'products'], null, 'addArrayEntry')} />
    {/if}
  </div>
  <div class="divider m-0"></div>
  <IngredientSection 
    {solId}
    {product}
    {nutrientNames}
    {onChange}
  />
</div>

<style>
  .divider {
    --divider-color: var(--color-primary);
  }
</style>