<!--Input field component-->
<script lang='ts'>
  let {
    placeholder, // Placehold text for the field
    tagName, // Text for the HTML id and for attributes
    classes = null, // Additional classes to add to the input
    type = 'number', // Type of input field
    error = 0, // 1 = yellow border, warning. 2 = red border, error
    value = $bindable(), // The value in the input
    tooltip = '', // Text to display in the tooltip
    onchange // Function to call on change
  } = $props();
  
  // Prepare the error classes
  let errorType = $derived(
    error == 0 ? '' :
      error == 1 ? 'input-warning' : 'input-error'
  );
</script>

<div class="input-field rounded-md bg-base-100 {tooltip != '' ? 'tooltip' : ''}" aria-label="Info" data-tip="{tooltip}">
  <label class="floating-label" for={tagName}>
    <input
      id={tagName}
      class="input text-lg rounded-md text-center py-2 px-0 placeholder:text-center{classes ? ` ${classes}` : ''} {errorType}"
      min="0"
      {type}
      bind:value={value}
      {onchange}
    />
    <span class="label absolute left-0 top-0 text-sm px-2 pointer-events-non">{placeholder}</span>
  </label>
</div>