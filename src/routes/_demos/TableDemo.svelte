<script lang="ts">
  import Table from '$lib/components/Table.svelte';
</script>

<div class="demo-stack">
  <Table caption="Recent orders">
    <thead>
      <tr>
        <th>Reference</th>
        <th>Item</th>
        <th class="is-numeric">Qty</th>
        <th class="is-numeric">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>FW-1042</td>
        <td>Blueprint grid</td>
        <td class="is-numeric">2</td>
        <td class="is-numeric">1,280.00</td>
      </tr>
      <tr>
        <td>FW-1043</td>
        <td>Prussian ground</td>
        <td class="is-numeric">1</td>
        <td class="is-numeric">640.00</td>
      </tr>
    </tbody>
  </Table>

  <Table caption="Same orders, dense" dense>
    <thead>
      <tr>
        <th>Reference</th>
        <th>Item</th>
        <th class="is-numeric">Qty</th>
        <th class="is-numeric">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>FW-1042</td>
        <td>Blueprint grid</td>
        <td class="is-numeric">2</td>
        <td class="is-numeric">1,280.00</td>
      </tr>
      <tr>
        <td>FW-1043</td>
        <td>Prussian ground</td>
        <td class="is-numeric">1</td>
        <td class="is-numeric">640.00</td>
      </tr>
    </tbody>
  </Table>
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
