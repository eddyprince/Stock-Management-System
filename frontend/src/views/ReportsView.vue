<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-extrabold text-yellow-500 mb-2">Reports</h1>
    <p class="text-sm font-semibold text-yellow-500 mb-6">
      Director view: stock status plus estimated sales and profit/loss based on stock transactions.
    </p>

    <div class="flex flex-wrap items-center gap-2 mb-4">
      <span class="text-xs text-slate-500 mr-1">Export as PDF:</span>
      <button
        type="button"
        class="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 text-white hover:bg-slate-900"
        @click="downloadPdf('summary')"
      >
        Summary
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500 text-white hover:bg-amber-600"
        @click="downloadPdf('expired')"
      >
        Expired
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500 text-white hover:bg-red-600"
        @click="downloadPdf('damaged')"
      >
        Damaged
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-600 text-white hover:bg-slate-700"
        @click="downloadPdf('stock')"
      >
        Full stock report
      </button>
      <button
        type="button"
        class="ml-auto px-3 py-1.5 rounded-full text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-100"
        @click="printPage"
      >
        Print current view
      </button>
    </div>

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
      <!-- Sales & profit/loss -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <p class="text-sm text-emerald-700">Total sales quantity</p>
          <p class="text-xl font-bold text-emerald-800">{{ report.salesSummary?.totalSalesQty ?? 0 }}</p>
        </div>
        <div class="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <p class="text-sm text-emerald-700">Total sales amount</p>
          <p class="text-xl font-bold text-emerald-800">
            {{ (report.salesSummary?.totalSalesAmount ?? 0).toLocaleString() }}
          </p>
        </div>
        <div class="bg-rose-50 rounded-xl border border-rose-200 p-4">
          <p class="text-sm text-rose-700">Estimated loss (damaged)</p>
          <p class="text-xl font-bold text-rose-800">
            {{ (report.salesSummary?.estimatedLoss ?? 0).toLocaleString() }}
          </p>
        </div>
      </div>

      <!-- Payment method breakdown -->
      <section v-if="report.paymentByMethod?.length" class="mb-8">
        <h2 class="text-lg font-extrabold text-yellow-500 mb-2">Payments by Method</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="row in paymentCards"
            :key="row.method"
            class="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <p class="text-sm text-slate-700 mb-1">{{ row.label }}</p>
            <p class="text-xl font-bold text-slate-900">
              {{ row.amount.toLocaleString() }}
            </p>
          </div>
        </div>
      </section>
      <div class="mb-8 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <p class="text-sm text-slate-600 mb-1">Estimated profit / loss</p>
        <p
          class="text-2xl font-bold"
          :class="
            (report.salesSummary?.estimatedProfit ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
          "
        >
          {{ (report.salesSummary?.estimatedProfit ?? 0).toLocaleString() }}
        </p>
        <p class="text-xs text-slate-500 mt-1">
          Profit is calculated as total sales amount minus estimated loss from damaged items
          (using each product's unit price for estimation).
        </p>
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

      <!-- Sales by user (who made sales) -->
      <section v-if="report.salesByUser?.length" class="mb-8">
        <h2 class="text-lg font-extrabold text-yellow-500 mb-2">Sales by User</h2>
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-100 text-slate-900">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">User</th>
                <th class="px-4 py-2 text-left font-semibold">Role</th>
                <th class="px-4 py-2 text-left font-semibold">Total sales qty</th>
                <th class="px-4 py-2 text-left font-semibold">Total sales amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in report.salesByUser" :key="u.userId" class="border-t border-slate-200">
                <td class="px-4 py-2 font-semibold text-slate-900">{{ u.username }}</td>
                <td class="px-4 py-2 text-slate-700">{{ u.role }}</td>
                <td class="px-4 py-2 font-semibold text-slate-900">{{ u.totalSalesQty }}</td>
                <td class="px-4 py-2 font-semibold text-slate-900">
                  {{ (u.totalSalesAmount ?? 0).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-extrabold text-yellow-500 mb-2">Expired Items</h2>
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-100 text-slate-900">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">Name</th>
                <th class="px-4 py-2 text-left font-semibold">SKU</th>
                <th class="px-4 py-2 text-left font-semibold">Qty</th>
                <th class="px-4 py-2 text-left font-semibold">Expiry</th>
                <th class="px-4 py-2 text-left font-semibold">Supplier</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in report.expiredItems" :key="p._id" class="border-t border-slate-200">
                <td class="px-4 py-2 font-semibold text-slate-900">{{ p.name }}</td>
                <td class="px-4 py-2 font-semibold text-slate-900">{{ p.sku || '—' }}</td>
                <td class="px-4 py-2 font-semibold text-slate-900">{{ p.quantityInStock }}</td>
                <td class="px-4 py-2 text-red-600 font-semibold">{{ formatDate(p.expiryDate) }}</td>
                <td class="px-4 py-2 font-semibold text-slate-900">{{ p.supplierName || '—' }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="!report.expiredItems?.length" class="px-4 py-6 text-slate-500 text-center">No expired items.</p>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-extrabold text-yellow-500 mb-2">Damaged Summary</h2>
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-100 text-slate-900">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">Name</th>
                <th class="px-4 py-2 text-left font-semibold">Damaged qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in report.damagedSummary" :key="p._id" class="border-t border-slate-200">
                <td class="px-4 py-2 font-semibold text-slate-900">{{ p.name }}</td>
                <td class="px-4 py-2 font-semibold text-slate-900">{{ p.quantityDamaged }}</td>
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
import { ref, onMounted, computed } from 'vue';
import client from '../api/client';
import { useAuthStore } from '../stores/auth';

const report = ref({});
const loading = ref(true);
const auth = useAuthStore();

const paymentCards = computed(() => {
  const raw = report.value.paymentByMethod || [];
  const labelMap = {
    cash: 'Cash payments',
    phone: 'Phone / mobile money',
    bank: 'Bank transfers',
    code: 'Codes / vouchers',
    debt: 'Debts (unpaid)',
    cheque: 'Cheques',
  };
  return raw.map((row) => ({
    method: row.method,
    label: labelMap[row.method] || row.method,
    amount: row.totalAmount || 0,
  }));
});

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString() : '';
}

function downloadPdf(type) {
  const safeType = type || 'summary';
  const token = auth.token;
  const params = new URLSearchParams({ type: safeType });
  if (token) params.append('token', token);
  const url = `/api/reports/pdf?${params.toString()}`;
  window.open(url, '_blank');
}

function printPage() {
  window.print();
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
