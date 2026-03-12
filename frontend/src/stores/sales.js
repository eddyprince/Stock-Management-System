import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from '../api/client';

export const useSalesStore = defineStore('sales', () => {
  const lastSale = ref(null);
  const error = ref('');

  async function createSale(payload) {
    error.value = '';
    try {
      const { data } = await client.post('/sales', payload);
      lastSale.value = data.sale;
      return data.sale;
    } catch (e) {
      error.value = e.response?.data?.message || e.message || 'Failed to record sale';
      throw e;
    }
  }

  return {
    lastSale,
    error,
    createSale,
  };
});

