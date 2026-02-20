<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 mb-4">Reports</h1>
    <p class="text-slate-600 mb-6">Director view: expired stock, in stock, out of stock, damaged quantity, and total supplied.</p>

    <div v-if="loading" class="text-slate-500">Loading report…</div>
    <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-primary-50 rounded-xl border border-primary-200 p-4">
          <p class="text-sm text-primary-700">Total products</p>
          <p class="text-2xl font-bold text-primary-800">{{ report.summary?.totalProducts ?? 0 }}</p>
        </div>
        <div class="bg-green-50 rounded-xl border border-green-200 p-4">
          <p class="text-sm text-green-700">In stock (items)</p>
          <p class="text-2xl font-bold text-green-800">{{ report.summary?.inStock ?? 0 }}</p>
        </div>
        <div class="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <p class="text-sm text-amber-700">Out of stock</p>
          <p class="text-2xl font-bold text-amber-800">{{ report.summary?.outOfStock ?? 0 }}</p>
        </div>
        <div class="bg-red-50 rounded-xl border border-red-200 p-4">
          <p class="text-sm text-red-700">Expired</p>
          <p class="text-2xl font-bold text-red-800">{{ report.summary?.expired ?? 0 }}</p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <p class="text-sm text-slate-600">Total quantity in stock</p>
          <p class="text-xl font-bold text-slate-800">{{ report.summary?.totalQuantityInStock ?? 0 }}</p>
        </div>
        <div class="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <p class="text-sm text-slate-600">Total damaged quantity</p>
          <p class="text-xl font-bold text-slate-800">{{ report.summary?.totalQuantityDamaged ?? 0 }}</p>
        </div>
        <div class="md:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-4">
          <p class="text-sm text-slate-600">Total supplied (all products)</p>
          <p class="text-xl font-bold text-slate-800">{{ report.summary?.totalSuppliedAll ?? 0 }}</p>
        </div>
      </div>

      <section class="mb-8">
        <h2 class="text-lg font-semibold text-slate-800 mb-2">Expired items</h2>
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-100">
              <tr>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">SKU</th>
                <th class="px-4 py-2 text-left">Qty</th>
                <th class="px-4 py-2 text-left">Expiry</th>
                <th class="px-4 py-2 text-left">Supplier</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in report.expiredItems" :key="p._id" class="border-t border-slate-200">
                <td class="px-4 py-2">{{ p.name }}</td>
                <td class="px-4 py-2">{{ p.sku || '—' }}</td>
                <td class="px-4 py-2">{{ p.quantityInStock }}</td>
                <td class="px-4 py-2 text-red-600">{{ formatDate(p.expiryDate) }}</td>
                <td class="px-4 py-2">{{ p.supplierName || '—' }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="!report.expiredItems?.length" class="px-4 py-6 text-slate-500 text-center">No expired items.</p>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold text-slate-800 mb-2">Damaged summary</h2>
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-100">
              <tr>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Damaged qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in report.damagedSummary" :key="p._id" class="border-t border-slate-200">
                <td class="px-4 py-2">{{ p.name }}</td>
                <td class="px-4 py-2">{{ p.quantityDamaged }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="!report.damagedSummary?.length" class="px-4 py-6 text-slate-500 text-center">No damaged items.</p>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import client from '../api/client';

const report = ref({});
const loading = ref(true);

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString() : '';
}

onMounted(async () => {
  try {
    const { data } = await client.get('/reports');
    report.value = data;
  } catch (e) {
    report.value = {};
  } finally {
    loading.value = false;
  }
});
</script>
