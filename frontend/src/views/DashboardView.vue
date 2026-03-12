<template>
  <div class="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-slate-100">
    <div class="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <!-- Sidebar -->
      <aside
        class="hidden md:flex flex-col w-56 rounded-3xl bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] border border-white/10 shadow-lg overflow-hidden"
        aria-label="Dashboard navigation"
      >
        <div class="px-5 py-4 border-b border-white/10 flex items-center gap-2">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500 text-xs font-bold">SM</span>
          <div>
            <p class="text-xs text-slate-500 uppercase tracking-wide">Stock</p>
            <p class="text-sm font-semibold">Control Center</p>
          </div>
        </div>
        <nav class="flex-1 px-2 py-3 text-xs space-y-1">
          <p class="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Overview</p>
          <button
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800 text-indigo-100 font-semibold"
          >
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/60 text-[11px]">DB</span>
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/70 text-slate-300"
          >
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-fuchsia-500/40 text-[11px]">CH</span>
            <span>Charts</span>
          </button>
          <button
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/70 text-slate-300"
          >
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/40 text-[11px]">ST</span>
            <span>Stock status</span>
          </button>
          <button
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/70 text-slate-300"
          >
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/40 text-[11px]">RP</span>
            <span>Reports</span>
          </button>
        </nav>
        <div class="px-4 py-4 border-t border-white/10 text-[11px] text-slate-500">
          <p class="mb-1 font-semibold">Signed in as</p>
          <p class="truncate text-slate-300">{{ auth.user?.username }}</p>
        </div>
      </aside>

      <!-- Main dashboard -->
      <main class="flex-1 space-y-5">
        <!-- Top bar -->
        <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-50">Dashboard</h1>
            <p class="text-xs text-slate-400 mt-1">
              At a glance: in stock, out of stock, expired and damaged quantities across all products.
            </p>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search products…"
                class="w-full rounded-full bg-slate-900/60 border border-slate-700 px-4 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">Ctrl+K</span>
            </div>
          </div>
        </header>

        <!-- Backend/DB error -->
        <div
          v-if="productsStore.productsError"
          class="mb-4 p-4 rounded-2xl bg-red-900/60 border border-red-700 text-[11px] text-red-100"
          role="alert"
        >
          <p class="font-semibold">Cannot load database</p>
          <p class="mt-1">{{ productsStore.productsError }}</p>
          <p class="mt-2">
            Start the backend:
            <code class="bg-red-800/80 px-1 rounded">cd backend && npm run dev</code>. Ensure MongoDB is running (or set
            MONGODB_URI in backend/.env for Atlas).
          </p>
          <button
            type="button"
            @click="productsStore.fetchProducts()"
            class="mt-2 text-[11px] text-red-100 underline hover:no-underline"
          >
            Retry
          </button>
        </div>

        <!-- KPI cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article class="rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-4 shadow-lg">
            <p class="text-[11px] uppercase tracking-wide text-indigo-100 mb-1">In stock items</p>
            <p class="text-2xl font-extrabold">{{ stats.inStock }}</p>
            <p class="text-[11px] text-indigo-100/80 mt-1">Products currently available</p>
          </article>
          <article class="rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 p-4 shadow-lg">
            <p class="text-[11px] uppercase tracking-wide text-pink-100 mb-1">Out of stock</p>
            <p class="text-2xl font-extrabold">{{ stats.outOfStock }}</p>
            <p class="text-[11px] text-pink-100/80 mt-1">Items that need replenishment</p>
          </article>
          <article class="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 shadow-lg">
            <p class="text-[11px] uppercase tracking-wide text-slate-900 mb-1">Expired products</p>
            <p class="text-2xl font-extrabold text-slate-900">{{ stats.expired }}</p>
            <p class="text-[11px] text-slate-900/80 mt-1">Require immediate attention</p>
          </article>
          <article class="rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 p-4 shadow-lg">
            <p class="text-[11px] uppercase tracking-wide text-emerald-50 mb-1">Damaged quantity</p>
            <p class="text-2xl font-extrabold text-slate-900">{{ stats.damaged }}</p>
            <p class="text-[11px] text-emerald-50/90 mt-1">Total units marked damaged</p>
          </article>
        </section>

        <!-- Middle analytics row -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Stock distribution pseudo-chart -->
          <div class="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 shadow-inner space-y-3">
            <header class="flex items-center justify-between text-xs text-slate-300 mb-1">
              <p class="font-semibold">Stock distribution</p>
              <p class="text-slate-500">By status</p>
            </header>
            <div class="flex items-end gap-2 h-28">
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-6 rounded-t-full bg-gradient-to-t from-indigo-500 to-sky-400" :style="{ height: kpiHeight(stats.inStock) }"></div>
                <span class="text-[10px] text-slate-400">In</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-6 rounded-t-full bg-gradient-to-t from-fuchsia-500 to-pink-400" :style="{ height: kpiHeight(stats.outOfStock) }"></div>
                <span class="text-[10px] text-slate-400">Out</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-6 rounded-t-full bg-gradient-to-t from-amber-400 to-orange-500" :style="{ height: kpiHeight(stats.expired) }"></div>
                <span class="text-[10px] text-slate-400">Expired</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-6 rounded-t-full bg-gradient-to-t from-emerald-500 to-lime-400" :style="{ height: kpiHeight(stats.damaged) }"></div>
                <span class="text-[10px] text-slate-400">Damaged</span>
              </div>
            </div>
          </div>

          <!-- Filter pills + quick info -->
          <div class="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 shadow-inner space-y-3">
            <header class="flex items-center justify-between text-xs text-slate-300 mb-1">
              <p class="font-semibold">Quick filters</p>
              <p class="text-slate-500">Change stock view</p>
            </header>
            <div class="flex flex-wrap gap-2 mb-3">
              <button
                v-for="f in filters"
                :key="f.value"
                @click="productsStore.setFilter(f.value)"
                class="px-3 py-1.5 rounded-full text-[11px] font-medium border transition"
                :class="
                  productsStore.filter === f.value
                    ? 'bg-indigo-500 text-white border-indigo-400 shadow'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                "
              >
                {{ f.label }}
              </button>
            </div>
            <p class="text-[11px] text-slate-400">
              Currently showing
              <span class="font-semibold text-indigo-200">{{ productsStore.filteredProducts.length }}</span>
              products.
            </p>
          </div>

          <!-- Small legend / tip card -->
          <div class="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 shadow-inner space-y-2 text-[11px] text-slate-300">
            <p class="font-semibold mb-1">Usage tips</p>
            <ul class="list-disc list-inside space-y-1 text-slate-400">
              <li>Use <span class="font-semibold text-indigo-200">Products</span> to add or adjust stock.</li>
              <li>Director role focuses on <span class="font-semibold text-amber-200">Reports</span> only.</li>
              <li>Admin can manage users and oversee stock flows.</li>
            </ul>
          </div>
        </section>

        <!-- Table section -->
        <section class="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 shadow-2xl">
          <header class="flex items-center justify-between mb-3">
            <div>
              <p class="text-xs font-semibold text-slate-200">Products overview</p>
              <p class="text-[11px] text-slate-500">Live snapshot of all tracked items.</p>
            </div>
          </header>
          <StockTable :products="productsStore.filteredProducts" :show-actions="auth.isStockManager" />
          <div
            v-if="!productsStore.productsError && productsStore.products.length === 0"
            class="mt-4 p-4 rounded-xl bg-slate-900/80 border border-dashed border-slate-700 text-center text-[12px] text-slate-400"
          >
            <p class="font-medium text-slate-200 mb-1">No products in the database yet.</p>
            <p>
              Log in as Stock Manager or Admin and go to
              <router-link to="/products" class="text-indigo-300 hover:underline">Products</router-link>
              to add items.
            </p>
          </div>
        </section>
      </main>
    </div>
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
  { value: 'in_stock', label: 'In stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
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

function kpiHeight(value) {
  const max = Math.max(stats.value.inStock, stats.value.outOfStock, stats.value.expired, stats.value.damaged, 1);
  const ratio = value / max;
  const minHeight = 20;
  const maxHeight = 100;
  const px = minHeight + ratio * (maxHeight - minHeight);
  return `${px}px`;
}

onMounted(async () => {
  await productsStore.fetchProducts();
});
</script>
