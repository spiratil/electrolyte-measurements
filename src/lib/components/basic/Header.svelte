<!--Header component-->
<script lang="ts">
  let {
    type, // HTML header type, h1, h2, etc
    title, // Text for the header
    inline = false,
    center = false
  } = $props();
</script>

{#if type == 'h2'}
  <h2 class="text-4xl {inline ? 'inline' : ''} {center ? 'text-center' : ''} font-bold text-primary">{title}</h2>
{:else if type == 'h3'}
  <h3 class="text-2xl {inline ? 'inline' : ''} {center ? 'text-center' : ''} font-semibold text-secondary">{title}</h3>
{:else}
  <h4 class="text-xl {inline ? 'inline' : ''} {center ? 'text-center' : ''} font-medium text-accent">{title}</h4>
{/if}

<style>
  h2, h3, h4 {
    font-family: Oswald;
  }
</style>