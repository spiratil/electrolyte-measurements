<!--Solutions ratio results box for Mobile only-->
<script lang="ts">
	import Header from "$lib/components/basic/Header.svelte";

  let { product } = $props();
</script>

<div class="my-3">
  <Header type="h3" center title={product.name}/>
  <p class="text-center text-md flex justify-center items-center gap-3 my-2">Req Amount: <span class="text-3xl text-accent">{product.amount} {product.unit}</span></p>
  <p class="text-center text-md flex justify-center items-center gap-3 my-2">No. of Serves: <span class="text-3xl text-accent">{product.serve}</span></p>
  <p class="text-center text-md flex justify-center items-center gap-3 my-2">Total Serves: <span class="text-3xl text-accent">{product.totalServe}</span></p>
</div>