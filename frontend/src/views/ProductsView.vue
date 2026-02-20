<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 mb-4">Products & Stock</h1>
    <p class="text-slate-600 mb-6">Add products with supplier (where from) and total supplied amount. Record in/out/damaged.</p>

    <!-- Add/Edit form -->
    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">{{ editingId ? 'Edit product' : 'Add product' }}</h2>
      <form @submit.prevent="saveProduct" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Product name *</label>
          <input id="name" v-model="form.name" required class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label for="sku" class="block text-sm font-medium text-slate-700 mb-1">SKU</label>
          <input id="sku" v-model="form.sku" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label for="quantityInStock" class="block text-sm font-medium text-slate-700 mb-1">Quantity in stock</label>
          <input id="quantityInStock" v-model.number="form.quantityInStock" type="number" min="0" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label for="totalSupplied" class="block text-sm font-medium text-slate-700 mb-1">Total supplied (amount ever received)</label>
          <input id="totalSupplied" v-model.number="form.totalSupplied" type="number" min="0" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label for="supplierId" class="block text-sm font-medium text-slate-700 mb-1">Supplier (where from)</label>
          <select id="supplierId" v-model="form.supplierId" class="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="">— Select —</option>
            <option v-for="s in suppliersStore.suppliers" :key="s._id" :value="s._id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label for="supplierName" class="block text-sm font-medium text-slate-700 mb-1">Or supplier name (text)</label>
          <input id="supplierName" v-model="form.supplierName" class="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="e.g. ABC Supplies" />
        </div>
        <div>
          <label for="expiryDate" class="block text-sm font-medium text-slate-700 mb-1">Expiry date</label>
          <input id="expiryDate" v-model="form.expiryDate" type="date" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label for="unitPrice" class="block text-sm font-medium text-slate-700 mb-1">Unit price</label>
          <input id="unitPrice" v-model.number="form.unitPrice" type="number" min="0" step="0.01" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div class="md:col-span-2 flex gap-2">
          <button type="submit" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            {{ editingId ? 'Update' : 'Add product' }}
          </button>
          <button type="button" @click="resetForm" class="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Quick add supplier -->
    <div class="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6">
      <h3 class="font-medium text-amber-800 mb-2">Add new supplier</h3>
      <div class="flex gap-2 flex-wrap">
        <input v-model="newSupplier.name" placeholder="Supplier name" class="rounded-lg border border-amber-300 px-3 py-2 flex-1 min-w-[120px]" />
        <input v-model="newSupplier.contact" placeholder="Contact" class="rounded-lg border border-amber-300 px-3 py-2 flex-1 min-w-[120px]" />
        <button type="button" @click="addSupplier" class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">Add supplier</button>
      </div>
    </div>

    <!-- Record transaction (in/out/damaged) -->
    <div v-if="selectedProduct" class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h3 class="font-semibold text-slate-800 mb-2">Record movement: {{ selectedProduct.name }}</h3>
      <div class="flex gap-2 flex-wrap items-end">
        <div>
          <label class="block text-sm text-slate-600 mb-1">Type</label>
          <select v-model="tx.type" class="rounded-lg border border-slate-300 px-3 py-2">
            <option value="in">In</option>
            <option value="out">Out</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-slate-600 mb-1">Quantity</label>
          <input v-model.number="tx.quantity" type="number" min="1" class="rounded-lg border border-slate-300 px-3 py-2 w-24" />
        </div>
        <div>
          <label class="block text-sm text-slate-600 mb-1">Amount (optional)</label>
          <input v-model.number="tx.amount" type="number" min="0" step="0.01" class="rounded-lg border border-slate-300 px-3 py-2 w-28" />
        </div>
        <button type="button" @click="submitTransaction" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Record</button>
        <button type="button" @click="selectedProduct = null" class="text-slate-600 hover:underline">Cancel</button>
      </div>
    </div>

    <StockTable :products="productsStore.products" :show-actions="true" @record="onRecord" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '../stores/products';
import { useSuppliersStore } from '../stores/suppliers';
import StockTable from '../components/StockTable.vue';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const suppliersStore = useSuppliersStore();

const editingId = ref(null);
const selectedProduct = ref(null);
const tx = ref({ type: 'in', quantity: 1, amount: null });
const newSupplier = ref({ name: '', contact: '' });

const form = ref({
  name: '',
  sku: '',
  quantityInStock: 0,
  quantityOutOfStock: 0,
  quantityDamaged: 0,
  totalSupplied: 0,
  supplierId: '',
  supplierName: '',
  expiryDate: '',
  unitPrice: null,
});

function resetForm() {
  editingId.value = null;
  form.value = {
    name: '',
    sku: '',
    quantityInStock: 0,
    quantityOutOfStock: 0,
    quantityDamaged: 0,
    totalSupplied: 0,
    supplierId: '',
    supplierName: '',
    expiryDate: '',
    unitPrice: null,
  };
  router.replace({ query: {} });
}

async function saveProduct() {
  try {
    const payload = {
      ...form.value,
      supplierId: form.value.supplierId || undefined,
      supplierName: form.value.supplierName || undefined,
      expiryDate: form.value.expiryDate || undefined,
    };
    if (editingId.value) {
      await productsStore.updateProduct(editingId.value, payload);
    } else {
      await productsStore.addProduct(payload);
    }
    resetForm();
  } catch (e) {
    alert(e.response?.data?.message || 'Failed to save');
  }
}

async function addSupplier() {
  if (!newSupplier.value.name.trim()) return;
  await suppliersStore.addSupplier({ name: newSupplier.value.name.trim(), contact: newSupplier.value.contact || '' });
  newSupplier.value = { name: '', contact: '' };
}

function onRecord(p) {
  selectedProduct.value = p;
  tx.value = { type: 'in', quantity: 1, amount: null };
}

async function submitTransaction() {
  if (!selectedProduct.value || !tx.value.quantity) return;
  await productsStore.addTransaction(
    selectedProduct.value._id,
    tx.value.type,
    tx.value.quantity,
    tx.value.amount,
    null
  );
  selectedProduct.value = null;
}

watch(
  () => route.query.edit,
  (id) => {
    if (!id) return;
    const p = productsStore.products.find((x) => x._id === id);
    if (p) {
      editingId.value = p._id;
      form.value = {
        name: p.name,
        sku: p.sku || '',
        quantityInStock: p.quantityInStock ?? 0,
        quantityOutOfStock: p.quantityOutOfStock ?? 0,
        quantityDamaged: p.quantityDamaged ?? 0,
        totalSupplied: p.totalSupplied ?? 0,
        supplierId: p.supplierId?._id || p.supplierId || '',
        supplierName: p.supplierName || '',
        expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().slice(0, 10) : '',
        unitPrice: p.unitPrice ?? null,
      };
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await Promise.all([productsStore.fetchProducts(), suppliersStore.fetchSuppliers()]);
});
</script>
