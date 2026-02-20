<template>
  <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-100 text-slate-700">
          <tr>
            <th class="px-4 py-3 font-medium">Name</th>
            <th class="px-4 py-3 font-medium">SKU</th>
            <th class="px-4 py-3 font-medium">In Stock</th>
            <th class="px-4 py-3 font-medium">Out</th>
            <th class="px-4 py-3 font-medium">Damaged</th>
            <th class="px-4 py-3 font-medium">Total Supplied</th>
            <th class="px-4 py-3 font-medium">From (Supplier)</th>
            <th class="px-4 py-3 font-medium">Expiry</th>
            <th v-if="showActions" class="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p._id" class="border-t border-slate-200 hover:bg-slate-50">
            <td class="px-4 py-3 font-medium text-slate-800">{{ p.name }}</td>
            <td class="px-4 py-3 text-slate-600">{{ p.sku || '—' }}</td>
            <td class="px-4 py-3">{{ p.quantityInStock ?? 0 }}</td>
            <td class="px-4 py-3">{{ p.quantityOutOfStock ?? 0 }}</td>
            <td class="px-4 py-3">{{ p.quantityDamaged ?? 0 }}</td>
            <td class="px-4 py-3">{{ p.totalSupplied ?? 0 }}</td>
            <td class="px-4 py-3 text-slate-600">{{ p.supplierName || (p.supplierId && p.supplierId.name) || '—' }}</td>
            <td class="px-4 py-3">
              <span v-if="p.expiryDate" :class="isExpired(p) ? 'text-red-600 font-medium' : 'text-slate-600'">
                {{ formatDate(p.expiryDate) }}
                <span v-if="isExpired(p)">(Expired)</span>
              </span>
              <span v-else>—</span>
            </td>
            <td v-if="showActions" class="px-4 py-3 space-x-2">
              <router-link :to="{ name: 'Products', query: { edit: p._id } }" class="text-primary-600 hover:underline">Edit</router-link>
              <button type="button" @click="$emit('record', p)" class="text-accent-600 hover:underline">Record</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!products.length" class="px-4 py-8 text-center text-slate-500">No products to show.</p>
  </div>
</template>

<script setup>
defineEmits(['record']);
const props = defineProps({
  products: { type: Array, default: () => [] },
  showActions: { type: Boolean, default: false },
});

function isExpired(p) {
  if (!p.expiryDate) return false;
  return new Date(p.expiryDate) < new Date();
}
function formatDate(d) {
  return d ? new Date(d).toLocaleDateString() : '';
}
</script>
