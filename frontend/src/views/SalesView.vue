<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-2xl font-extrabold text-yellow-500 mb-2">Sales &amp; Receipts</h1>
    <p class="text-sm font-semibold text-yellow-500 mb-6">
      Stock Manager / Accountant can record sales here. Each sale reduces stock, calculates 18% tax and generates a
      printable receipt for the buyer.
    </p>

    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h2 class="text-lg font-semibold text-emerald-700 mb-4">Create sale</h2>
      <form @submit.prevent="submit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-1">Client / Buyer name</label>
            <input
              v-model="buyerName"
              required
              :readonly="!!selectedClientId"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-semibold bg-white disabled:bg-slate-100 read-only:bg-slate-100"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-1">TIN or phone number</label>
            <input
              v-model="buyerTin"
              :readonly="!!selectedClientId"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-semibold bg-white read-only:bg-slate-100"
              placeholder="e.g. 123456789"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-1">Contact (optional)</label>
            <input
              v-model="buyerContact"
              :readonly="!!selectedClientId"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-semibold bg-white read-only:bg-slate-100"
              placeholder="e.g. 0788..."
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-1">Select existing client (optional)</label>
            <select
              v-model="selectedClientId"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 font-semibold"
            >
              <option value="">-- New client from above details --</option>
              <option v-for="c in clientsStore.clients" :key="c._id" :value="c._id">
                {{ c.name }} ({{ c.tin }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-1">Payment method</label>
            <select
              v-model="paymentMethod"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 font-semibold"
              required
            >
              <option value="cash">Cash</option>
              <option value="phone">Phone / Mobile money</option>
              <option value="bank">Bank transfer</option>
              <option value="code">Code / voucher</option>
              <option value="debt">Debt (unpaid)</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <h3 class="text-sm font-semibold text-slate-900 mb-3">Products in this sale</h3>
          <div
            v-for="(item, index) in items"
            :key="index"
            class="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3 mb-3"
          >
            <div>
              <label class="block text-xs font-semibold text-slate-900 mb-1">Product</label>
              <select
                v-model="item.productId"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 font-semibold"
                required
              >
                <option value="">Select product…</option>
                <option v-for="p in productsStore.products" :key="p._id" :value="p._id">
                  {{ p.name }} (In stock: {{ p.quantityInStock ?? 0 }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-900 mb-1">Qty</label>
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 font-semibold"
                required
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-900 mb-1">Unit price</label>
              <input
                v-model.number="item.unitPrice"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 font-semibold"
                :placeholder="autoUnitPrice(item.productId)"
              />
            </div>
            <div class="text-xs text-slate-900 font-semibold flex flex-col justify-end">
              <span>
                Net:
                <strong>{{
                  formatCurrency((item.unitPrice || autoUnitPrice(item.productId)) * (item.quantity || 0))
                }}</strong>
              </span>
              <span>
                Tax 18%:
                <strong>{{
                  formatCurrency(
                    0.18 * (item.unitPrice || autoUnitPrice(item.productId)) * (item.quantity || 0),
                  )
                }}</strong>
              </span>
            </div>
            <button
              v-if="items.length > 1"
              type="button"
              class="self-end text-xs text-red-600 hover:underline"
              @click="removeItem(index)"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            class="mt-1 text-xs text-sky-700 font-semibold hover:underline"
            @click="addItem"
          >
            + Add another product
          </button>
        </div>

        <p v-if="salesStore.error" class="text-sm text-red-600">{{ salesStore.error }}</p>
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

        <div class="flex items-center justify-between">
          <div class="text-xs text-slate-900 font-semibold">
            <p>
              Subtotal (net): <strong>{{ formatCurrency(totalNet) }}</strong>
            </p>
            <p>
              Tax 18%: <strong>{{ formatCurrency(totalTax) }}</strong>
            </p>
            <p>
              Total to pay: <strong>{{ formatCurrency(totalAmount) }}</strong>
            </p>
          </div>
          <button
            type="submit"
            class="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700"
          >
            Save sale &amp; generate receipt
          </button>
        </div>
      </form>
    </div>

    <div v-if="salesStore.lastSale" class="bg-slate-900 text-slate-50 rounded-xl p-4 text-sm">
      <p class="mb-2">
        Last sale recorded for
        <strong>{{ salesStore.lastSale.buyerName }}</strong> — total
        <strong>{{ formatCurrency(salesStore.lastSale.totalAmount) }}</strong
        >.
      </p>
      <button
        type="button"
        class="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-full text-xs font-semibold"
        @click="openReceipt"
      >
        View / Print receipt
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useProductsStore } from '../stores/products';
import { useSalesStore } from '../stores/sales';
import { useClientsStore } from '../stores/clients';
import { useAuthStore } from '../stores/auth';

const productsStore = useProductsStore();
const salesStore = useSalesStore();
const clientsStore = useClientsStore();
const auth = useAuthStore();

const buyerName = ref('');
const buyerTin = ref('');
const buyerContact = ref('');
const selectedClientId = ref('');
const paymentMethod = ref('cash');
const items = ref([{ productId: '', quantity: 1, unitPrice: null }]);
const formError = ref('');

onMounted(async () => {
  if (!productsStore.products.length) {
    try {
      await productsStore.fetchProducts();
    } catch {
      // handled by productsError elsewhere
    }
  }
  await clientsStore.fetchClients();
});

// When user selects an existing client, auto-fill name / tin / contact
watch(
  () => selectedClientId.value,
  (id) => {
    if (!id) return;
    const c = clientsStore.clients.find((x) => x._id === id);
    if (!c) return;
    buyerName.value = c.name || buyerName.value;
    buyerTin.value = c.tin || buyerTin.value;
    buyerContact.value = c.phone || buyerContact.value;
  },
);

function addItem() {
  items.value.push({ productId: '', quantity: 1, unitPrice: null });
}

function removeItem(index) {
  items.value.splice(index, 1);
}

function autoUnitPrice(productId) {
  const p = productsStore.products.find((x) => x._id === productId);
  return p?.unitPrice || 0;
}

const totalNet = computed(() =>
  items.value.reduce((sum, it) => {
    const price = it.unitPrice || autoUnitPrice(it.productId);
    return sum + price * (it.quantity || 0);
  }, 0),
);

const totalTax = computed(() => totalNet.value * 0.18);
const totalAmount = computed(() => totalNet.value + totalTax.value);

function formatCurrency(num) {
  return (num || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function submit() {
  formError.value = '';
  const phonePattern = /^07(2|3|8|9)\d{7}$/;
  const tinPattern = /^1\d{8}$/;
  const tin = buyerTin.value?.trim();
  const phone = buyerContact.value?.trim();
  if (!tinPattern.test(tin)) {
    formError.value = 'TIN must start with 1 and have exactly 9 digits.';
    return;
  }
  if (phone && !phonePattern.test(phone)) {
    formError.value = 'Phone must start with 078/072/079/073 and have exactly 10 digits.';
    return;
  }
  const payload = {
    buyerName: buyerName.value,
    buyerTin: buyerTin.value,
    buyerContact: buyerContact.value,
    clientId: selectedClientId.value || undefined,
    paymentMethod: paymentMethod.value,
    items: items.value.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
      unitPrice: it.unitPrice || autoUnitPrice(it.productId),
    })),
  };
  await salesStore.createSale(payload);
  // keep form so they can print, but reset items for next sale
  items.value = [{ productId: '', quantity: 1, unitPrice: null }];
}

function openReceipt() {
  if (!salesStore.lastSale?._id) return;
  const params = new URLSearchParams();
  if (auth.token) params.append('token', auth.token);
  const qs = params.toString();
  const url = `/api/sales/${salesStore.lastSale._id}/receipt${qs ? `?${qs}` : ''}`;
  window.open(url, '_blank');
}
</script>

