<!--Ingredients page section-->
<script lang='ts'>
	import Header from "$lib/components/basic/Header.svelte";
  import IngredientRow from "$lib/components/sections/IngredientRow.svelte";

  let {
    solId, // Solution ID
    product, // Product data
    nutrientNames, // List of required nutrient names
    onChange // Function to call on change
  } = $props();
</script>

<div class="ingredients-container">
  <Header type="h4" center={true} title="{product.name} Ingredients"></Header>
  
  {#if product}
    <div>
      {#each product.ingredients as ingredient (ingredient.id)}
        <IngredientRow
          {solId}
          prodId={product.id}
          ingId={ingredient.id}
          productForm={product.form}
          {ingredient}
          {nutrientNames}
          single={product.ingredients.length == 1}
          last={ingredient.id == product.ingredients.length - 1}
          {onChange}
        />
      {/each}
    </div>
  {/if}
</div>