import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from '../api/client';

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([]);
  const error = ref('');
  const saving = ref(false);

  async function fetchClients() {
    error.value = '';
    try {
      const { data } = await client.get('/clients');
      clients.value = data;
    } catch (e) {
      error.value = e.response?.data?.message || e.message || 'Failed to load clients';
      clients.value = [];
    }
  }

  async function createClient(payload) {
    saving.value = true;
    try {
      const { data } = await client.post('/clients', payload);
      clients.value.push(data);
      return data;
    } finally {
      saving.value = false;
    }
  }

  async function updateClient(id, payload) {
    saving.value = true;
    try {
      const { data } = await client.patch(`/clients/${id}`, payload);
      const idx = clients.value.findIndex((c) => c._id === id);
      if (idx !== -1) clients.value[idx] = data;
      return data;
    } finally {
      saving.value = false;
    }
  }

  async function deleteClient(id) {
    saving.value = true;
    try {
      await client.delete(`/clients/${id}`);
      clients.value = clients.value.filter((c) => c._id !== id);
    } finally {
      saving.value = false;
    }
  }

  return {
    clients,
    error,
    saving,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
});

