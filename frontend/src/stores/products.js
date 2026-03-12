/**
 * Products store: list, filters (expired, in_stock, out_of_stock), add, update, fetch.
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import client from '../api/client';

export const useProductsStore = defineStore('products', () => {
  const products = ref([]);
  const productsError = ref(null); // e.g. "Backend not running"
  const filter = ref('all'); // all | in_stock | out_of_stock | expired

  const filteredProducts = computed(() => {
    const list = products.value;
    if (filter.value === 'in_stock') return list.filter((p) => (p.quantityInStock || 0) > 0);
    if (filter.value === 'out_of_stock') return list.filter((p) => (p.quantityInStock || 0) === 0);
    if (filter.value === 'expired') {
      const now = new Date();
      return list.filter((p) => p.expiryDate && new Date(p.expiryDate) < now);
    }
    return list;
  });

  async function fetchProducts(params = {}) {
    productsError.value = null;
    try {
      const query = new URLSearchParams();
      if (params.status) query.set('status', params.status);
      if (params.expired === true) query.set('expired', 'true');
      const url = query.toString() ? `/products?${query}` : '/products';
      const { data } = await client.get(url);
      products.value = data;
      return data;
    } catch (err) {
      productsError.value = err.response?.data?.message || err.message || 'Could not load data. Is the backend running on port 3000?';
      products.value = [];
      throw err;
    }
  }

  async function addProduct(payload) {
    const { data } = await client.post('/products', payload);
    products.value = [data, ...products.value];
    return data;
  }

  async function updateProduct(id, payload) {
    const { data } = await client.put(`/products/${id}`, payload);
    const idx = products.value.findIndex((p) => p._id === id);
    if (idx !== -1) products.value[idx] = data;
    return data;
  }

  async function addTransaction(productId, type, quantity, amount, note) {
    const { data } = await client.post(`/products/${productId}/transaction`, {
      type,
      quantity,
      amount,
      note,
    });
    const idx = products.value.findIndex((p) => p._id === productId);
    if (idx !== -1) products.value[idx] = data.product;
    return data;
  }

  function setFilter(f) {
    filter.value = f;
  }

  return {
    products,
    productsError,
    filter,
    filteredProducts,
    fetchProducts,
    addProduct,
    updateProduct,
    addTransaction,
    setFilter,
  };
});
