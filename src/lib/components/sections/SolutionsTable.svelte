<!--Solutions ratio results box for Desktop only-->
<script lang="ts">
  let { product } = $props();
</script>

<tr class="text-lg text-center">
  <th class="text-center">{product.name}</th>
  <td class="text-center">{product.amount} {product.unit}</td>
  <td class="text-center">{product.serve}</td>
  <td class="text-center">{product.totalServe}</td>
</tr>