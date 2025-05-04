<!--Product page section-->
<script lang="ts">
	import Header from "$lib/components/basic/Header.svelte";
	import IntroParagraph from "$lib/components/basic/IntroParagraph.svelte";
	import ProductRow from "$lib/components/sections/ProductRow.svelte";

  let {
    solId, // Solution ID
    products, // Products data
    nutrientNames, // List of required nutrient names
    onChange // Function to call on change
  } = $props();
</script>

<!--Desktop and Mobile Display-->
<div class="m-5 lg:m-10 p-5 lg:p-15 flex flex-col gap-3 items-center justify-center bg-base-200 rounded-2xl outline-2">
  <Header type="h2" title="Products" />
  {#if products}
    <IntroParagraph
      center={true}  
      text={'Add your bought products\' information here.'}
    />
    <div class="min-w-full flex flex-col gap-3 justify-center items-center">
      {#each products as product (product.id)}
        <div class="individual-product-container">
          <ProductRow
            {solId}
            prodId={product.id}
            {product}
            {nutrientNames}
            single={products.length == 1}
            last={product.id == products.length - 1}
            {onChange}
          />
        </div>
      {/each}
    </div>
  {:else}
    <IntroParagraph
      center={true}  
      text={'Add a solution above to begin adding your products.'}
    />
  {/if}
</div>