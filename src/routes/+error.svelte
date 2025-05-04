<script lang="ts">
  import Header from '$lib/components/basic/Header.svelte';
	import IntroParagraph from '$lib/components/basic/IntroParagraph.svelte';
import './style.css';
</script>

<div class="m-5 lg:m-10 p-5 lg:p-15 bg-base-200 rounded-2xl flex flex-col justify-center items-center gap-3 outline-2">
  <h2 class="text-9xl font-bold text-primary">404</h2>
  <p class="text-3xl mt-10">This page does not exist.</p>
  <IntroParagraph text="" center />
</div>

<style>
  h2 {
    font-family: Oswald;
  }
</style>