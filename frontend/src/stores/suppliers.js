/**
 * Suppliers store: list and create. Used when adding products (where from).
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from '../api/client';

export const useSuppliersStore = defineStore('suppliers', () => {
  const suppliers = ref([]);

  async function fetchSuppliers() {
    const { data } = await client.get('/suppliers');
    suppliers.value = data;
    return data;
  }

  async function addSupplier(payload) {
    const { data } = await client.post('/suppliers', payload);
    suppliers.value = [...suppliers.value, data];
    return data;
  }

  return { suppliers, fetchSuppliers, addSupplier };
});
