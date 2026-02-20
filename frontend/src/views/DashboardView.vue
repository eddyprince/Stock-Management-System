<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 mb-4">Dashboard</h1>
    <p class="text-slate-600 mb-6">Overview of stock: in stock, out of stock, expired, and damaged.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <p class="text-sm text-slate-500">In Stock</p>
        <p class="text-2xl font-bold text-primary-600">{{ stats.inStock }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <p class="text-sm text-slate-500">Out of Stock</p>
        <p class="text-2xl font-bold text-amber-600">{{ stats.outOfStock }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <p class="text-sm text-slate-500">Expired</p>
        <p class="text-2xl font-bold text-red-600">{{ stats.expired }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <p class="text-sm text-slate-500">Damaged Qty (total)</p>
        <p class="text-2xl font-bold text-slate-700">{{ stats.damaged }}</p>
      </div>
    </div>
    <div class="flex gap-2 mb-4">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="productsStore.setFilter(f.value)"
        :class="productsStore.filter === f.value ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'"
        class="rounded-lg px-4 py-2 text-sm font-medium transition"
      >
        {{ f.label }}
      </button>
    </div>
    <StockTable :products="productsStore.filteredProducts" :show-actions="auth.isStockManager" />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useProductsStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';
import StockTable from '../components/StockTable.vue';

const productsStore = useProductsStore();
const auth = useAuthStore();

const filters = [
  { value: 'all', label: 'All' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'expired', label: 'Expired' },
];

const stats = computed(() => {
  const list = productsStore.products;
  const now = new Date();
  return {
    inStock: list.filter((p) => (p.quantityInStock || 0) > 0).length,
    outOfStock: list.filter((p) => (p.quantityInStock || 0) === 0).length,
    expired: list.filter((p) => p.expiryDate && new Date(p.expiryDate) < now).length,
    damaged: list.reduce((s, p) => s + (p.quantityDamaged || 0), 0),
  };
});

onMounted(async () => {
  await productsStore.fetchProducts();
});
</script>
