<!--Minus button component-->
<script lang='ts'>
  let { 
    primary = false, // Show button color as the primary color
    onclick // function to call when clicked
  } = $props();
</script>

<button class="btn btn-ghost btn-circle w-10" aria-label="Minus" {onclick}>
  <svg class="{primary ? 'fill-primary' : 'fill-secondary'} hover:fill-accent lg:transition transition-discrete transform hover:scale-y-110 hover:scale-x-110" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm6 0a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Z" clip-rule="evenodd"/></svg>
</button>