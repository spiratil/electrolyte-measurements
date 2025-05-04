<!--Dropdown component-->
<script lang='ts'>
  import { wUnits, lUnits } from "$lib/definitions/definitions";
  let { name,
        tagName, // Used for the id and for attributes
        error = 0, // 2 = border becomes red for error
        selected = $bindable(), // Selected value from dropdown
        tooltip = '', // Tooltip message to display when the user hovers/clicks
        onchange, // Function to call when changed
        form = null, // If a form is provided, assume that units are to be filled
        options = null // If options are provided, fill the options instead
      } = $props();

  // Prepare the required error classes
  let errorType = $derived(error == 0 ? '' : ' border select-error');

  // Determine whether units are to be displayed
  let units = $derived((() => {
    if (form == '' || form == null)
      return [];
    else if (form == 'liquid')
      return [...wUnits, ...lUnits];
    else
      return wUnits;
  })());
</script>

<div class="input-field rounded-md bg-base-100{tooltip != '' ? ' tooltip' : ''}{errorType}" aria-label="Info" data-tip="{tooltip}">
  <label class="floating-label select select-lg select-lg" for="{tagName}">
    <select
      class="dropdown"
      id="{tagName}"
      bind:value={selected}
      {onchange}
    >
      <!--Add the default empty value-->
      {#if selected == ''}
        <option value={''} selected>{'--Choose--'}</option>
      {:else}
        <option value={''}>{'--Choose--'}</option>
      {/if}
      
      <!--Add each unit available to the list-->
      {#if units.length > 0}
        {#each units as unit}
          {#if selected == unit}
            <option value={unit} selected>{unit}</option>
          {:else}
            <option value={unit}>{unit}</option>
          {/if}
        {/each}
      {:else}
        {#each options as option}
          {#if selected == option}
            <option value={option} selected>{option}</option>
          {:else}
            <option value={option}>{option}</option>
          {/if}
        {/each}
      {/if}
    </select>
    <span class="absolute left-0 top-0 text-sm px-2 pointer-events-non">{name}</span>
  </label>
</div>

<style>
  label span {
    color: color-mix(in oklab, currentColor 60%, transparent);
  }

  select {
    background-position: calc(100% - 6px) calc(1px + 50%), calc(100% - 2.1px) calc(1px + 50%);
    background-image: linear-gradient(45deg, #0000 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, #0000 50%);
    text-align: center;
    padding-left: 10px;
    padding-right: 18px;
  }

  .select-error {
    border: var(--border) solid var(--color-error);
  }

  .tooltip::before {
      font-size: larger;
      padding: 20px;
      border-radius: var(--radius-2xl);
    }
</style>