<!--Nutrient ratio results box for Desktop only-->
<script lang="ts">
  let { nutrient } = $props();
</script>

<tr class="text-lg text-center">
  <td class="flex justify-center">
    {#if nutrient.requirement}
      <svg class="fill-accent lg:transition transition-discrete transform hover:scale-y-110 hover:scale-x-110 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm4.78 7.7-5.67 5.67a.75.75 0 0 1-1.06 0l-2.83-2.83a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06Z"/></svg>
    {/if}
  </td>
  <th class="text-center">{nutrient.name}</th>
  <td class="text-center">{nutrient.amount} {nutrient.unit}</td>
  <td class="text-center">
    {#if nutrient.requirement}
      <!--Display exact is the target difference is 0, otherwise display the difference with the units-->
      <span class="{Number(nutrient.targetDifference) >= 0 ? 'text-success' : 'text-error'}">
        {Number(nutrient.targetDifference) != 0 ? `${Math.abs(nutrient.targetDifference)} ${nutrient.targetUnit} ${nutrient.targetDifference >= 0 ? 'over' : 'under'}` : 'exact'}
      </span>
    {:else}
      extra
    {/if}
  </td>
</tr>