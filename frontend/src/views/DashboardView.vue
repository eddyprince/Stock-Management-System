<template>
  <div class="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-sky-900 via-sky-800 to-sky-700 text-slate-100">
    <div class="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <!-- Top title and search -->
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">Stock Control Dashboard</h1>
          <p class="text-xs text-sky-100/80 mt-1">
            Monitor current stock levels, distribution, usage and alerts from one central place.
          </p>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <div class="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search products…"
              class="w-full rounded-full bg-sky-900/70 border border-sky-500/60 px-4 py-2 text-xs placeholder:text-sky-200/70 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-sky-200/80">Ctrl+K</span>
          </div>
        </div>
      </header>

      <!-- Tab row like reference (Stock Overview, Stock Distribution, Usage Reports, Alerts) -->
      <nav
        class="rounded-2xl bg-sky-950/60 border border-sky-700/60 px-3 py-2 flex flex-wrap items-center gap-2 text-[11px]"
        aria-label="Dashboard sections"
      >
        <button
          type="button"
          class="px-3 py-1.5 rounded-full font-semibold"
          :class="activePanel === 'overview' ? 'bg-white text-sky-900 shadow' : 'text-sky-100 hover:bg-sky-800/80'"
          @click="activePanel = 'overview'"
        >
          Stock Overview
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-full font-semibold"
          :class="activePanel === 'distribution' ? 'bg-white text-sky-900 shadow' : 'text-sky-100 hover:bg-sky-800/80'"
          @click="activePanel = 'distribution'"
        >
          Stock Distribution
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-full font-semibold"
          :class="activePanel === 'usage' ? 'bg-white text-sky-900 shadow' : 'text-sky-100 hover:bg-sky-800/80'"
          @click="activePanel = 'usage'"
        >
          Usage Reports
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-full font-semibold"
          :class="activePanel === 'alerts' ? 'bg-white text-sky-900 shadow' : 'text-sky-100 hover:bg-sky-800/80'"
          @click="activePanel = 'alerts'"
        >
          Alerts
        </button>
        <div class="ml-auto hidden sm:flex items-center gap-2 text-[11px] text-sky-100/70">
          <span class="h-7 w-7 inline-flex items-center justify-center rounded-full bg-sky-700/70 font-semibold">SM</span>
          <div class="leading-tight">
            <p class="font-semibold text-sky-50 text-[11px]">Signed in as</p>
            <p class="truncate text-sky-100 text-[11px]">{{ auth.user?.username }}</p>
          </div>
        </div>
      </nav>

      <!-- Main dashboard card -->
      <main class="rounded-3xl bg-sky-100/40 border border-sky-200 p-4 space-y-5 shadow-[0_24px_70px_rgba(15,23,42,0.5)] text-slate-900">

        <!-- Backend/DB error -->
        <div
          v-if="productsStore.productsError"
          class="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-[11px] text-red-800"
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

        <!-- KPI cards / quick summary -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article class="rounded-2xl bg-white p-4 shadow-md border border-sky-100">
            <p class="text-[11px] uppercase tracking-wide text-sky-700 mb-1">In stock items</p>
            <p class="text-2xl font-extrabold text-slate-900">{{ stats.inStock }}</p>
            <p class="text-[11px] text-slate-500 mt-1">Products currently available</p>
          </article>
          <article class="rounded-2xl bg-white p-4 shadow-md border border-rose-100">
            <p class="text-[11px] uppercase tracking-wide text-rose-700 mb-1">Out of stock</p>
            <p class="text-2xl font-extrabold text-slate-900">{{ stats.outOfStock }}</p>
            <p class="text-[11px] text-slate-500 mt-1">Items that need replenishment</p>
          </article>
          <article class="rounded-2xl bg-white p-4 shadow-md border border-amber-100">
            <p class="text-[11px] uppercase tracking-wide text-amber-700 mb-1">Expired products</p>
            <p class="text-2xl font-extrabold text-slate-900">{{ stats.expired }}</p>
            <p class="text-[11px] text-slate-500 mt-1">Require immediate attention</p>
          </article>
          <article class="rounded-2xl bg-white p-4 shadow-md border border-emerald-100">
            <p class="text-[11px] uppercase tracking-wide text-emerald-700 mb-1">Damaged quantity</p>
            <p class="text-2xl font-extrabold text-slate-900">{{ stats.damaged }}</p>
            <p class="text-[11px] text-slate-500 mt-1">Total units marked damaged</p>
          </article>
        </section>

        <!-- Middle analytics row and table: content depends on activePanel -->
        <section v-if="activePanel === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Stock distribution pseudo-chart -->
          <div class="rounded-2xl bg-white border border-sky-100 p-4 shadow-md space-y-3">
            <header class="flex items-center justify-between text-xs text-slate-700 mb-1">
              <p class="font-semibold">Stock Distribution</p>
              <p class="text-slate-400">By status</p>
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

          <!-- Stock details and filters combined -->
          <div class="rounded-2xl bg-white border border-sky-100 p-4 shadow-md space-y-3">
            <header class="flex items-center justify-between text-xs text-slate-700 mb-1">
              <p class="font-semibold">Stock Details</p>
              <p class="text-slate-400">Quick filters</p>
            </header>
            <div class="flex flex-wrap gap-2 mb-3">
              <button
                v-for="f in filters"
                :key="f.value"
                @click="productsStore.setFilter(f.value)"
                class="px-3 py-1.5 rounded-full text-[11px] font-medium border transition"
                :class="
                  productsStore.filter === f.value
                    ? 'bg-sky-600 text-white border-sky-500 shadow'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                "
              >
                {{ f.label }}
              </button>
            </div>
            <p class="text-[11px] text-slate-500">
              Currently showing
              <span class="font-semibold text-sky-700">{{ productsStore.filteredProducts.length }}</span>
              products in the table below.
            </p>
          </div>

          <!-- Small legend / tip card -->
          <div class="rounded-2xl bg-white border border-sky-100 p-4 shadow-md space-y-2 text-[11px] text-slate-600">
            <p class="font-semibold mb-1">Usage tips</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Use <span class="font-semibold text-sky-700">Products</span> to add or adjust stock.</li>
              <li>Directors focus on <span class="font-semibold text-amber-700">Reports</span> only.</li>
              <li>Admins can manage users and oversee stock flows.</li>
            </ul>
          </div>
        </section>

        <!-- Distribution only -->
        <section v-else-if="activePanel === 'distribution'" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="rounded-2xl bg-white border border-sky-100 p-4 shadow-md space-y-3 lg:col-span-2">
            <header class="flex items-center justify-between text-xs text-slate-700 mb-1">
              <p class="font-semibold">Stock Distribution</p>
              <p class="text-slate-400">By status</p>
            </header>
            <div class="flex items-end gap-3 h-40">
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-8 rounded-t-full bg-gradient-to-t from-indigo-500 to-sky-400" :style="{ height: kpiHeight(stats.inStock) }"></div>
                <span class="text-[11px] text-slate-700 font-medium">In stock</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-8 rounded-t-full bg-gradient-to-t from-fuchsia-500 to-pink-400" :style="{ height: kpiHeight(stats.outOfStock) }"></div>
                <span class="text-[11px] text-slate-700 font-medium">Out of stock</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-8 rounded-t-full bg-gradient-to-t from-amber-400 to-orange-500" :style="{ height: kpiHeight(stats.expired) }"></div>
                <span class="text-[11px] text-slate-700 font-medium">Expired</span>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-8 rounded-t-full bg-gradient-to-t from-emerald-500 to-lime-400" :style="{ height: kpiHeight(stats.damaged) }"></div>
                <span class="text-[11px] text-slate-700 font-medium">Damaged</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Usage / reports only -->
        <section v-else-if="activePanel === 'usage'" class="rounded-2xl bg-white border border-sky-100 p-4 shadow-md">
          <p class="text-sm font-semibold text-slate-900 mb-2">Usage Reports / How to use this dashboard</p>
          <ul class="list-decimal list-inside text-[12px] text-slate-600 space-y-1">
            <li>Check the top cards to see how many items are in stock, out of stock, expired and damaged.</li>
            <li>Use the Stock status panel to see the full products table and record movements (in, out, damaged).</li>
            <li>Use the Stock distribution panel to compare statuses and detect unusual patterns (e.g. many damaged items).</li>
            <li>Directors focus on the Reports section to understand totals and trends without editing data.</li>
          </ul>
        </section>

        <!-- Alerts only -->
        <section v-else-if="activePanel === 'alerts'" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          <div class="rounded-2xl bg-white border border-sky-100 p-4 shadow-md">
            <p class="text-sm font-semibold text-slate-900 mb-2">Alerts &amp; notifications</p>
            <ul class="space-y-1 text-slate-700">
              <li v-if="stats.outOfStock > 0">• Low stock alert: {{ stats.outOfStock }} items are out of stock.</li>
              <li v-if="stats.expired > 0">• Expiry warning: {{ stats.expired }} products are already expired.</li>
              <li v-if="stats.damaged > 0">• Damage alert: Total damaged quantity is {{ stats.damaged }} units.</li>
              <li v-if="stats.inStock === 0 && stats.outOfStock === 0 && stats.expired === 0 && stats.damaged === 0">
                • No alerts yet. Add products to start receiving notifications.
              </li>
            </ul>
          </div>
          <div class="rounded-2xl bg-white border border-sky-100 p-4 shadow-md">
            <p class="text-sm font-semibold text-slate-900 mb-2">How to act on alerts</p>
            <ul class="list-decimal list-inside space-y-1 text-slate-700">
              <li>Use the Products screen to re‑order out‑of‑stock or low‑stock items.</li>
              <li>Quickly remove expired products from shelves and update damaged quantities.</li>
              <li>Open Reports to see how alerts are impacting daily sales and profit.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useProductsStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';
import StockTable from '../components/StockTable.vue';

const productsStore = useProductsStore();
const auth = useAuthStore();
const activePanel = ref('overview');

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
