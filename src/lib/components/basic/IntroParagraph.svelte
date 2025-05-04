<!--Paragraph component-->
<script lang="ts">
  let { center = false, text } = $props();
</script>

<p class="text-xl my-3 max-w-2xl {center ? 'text-center' : ''}">{text}</p>