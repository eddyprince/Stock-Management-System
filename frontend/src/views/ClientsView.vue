<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-2xl font-extrabold text-yellow-500 mb-2">Clients</h1>
    <p class="text-sm font-semibold text-yellow-500 mb-6">
      Stock Manager, Accountant and Admin can register clients (name + TIN). Other details are optional.
    </p>

    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h2 class="text-lg font-semibold text-emerald-700 mb-4">Add client</h2>
      <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-1">Name *</label>
          <input
            v-model="form.name"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-semibold"
            placeholder="Client / company name"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-1">TIN / Number *</label>
          <input
            v-model="form.tin"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-semibold"
            placeholder="e.g. 112326297"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-1">Phone (optional)</label>
          <input
            v-model="form.phone"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-semibold"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-1">Address / Fax (optional)</label>
          <input
            v-model="form.address"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-semibold"
          />
        </div>
        <button
          type="submit"
          class="mt-2 md:mt-0 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700"
        >
          Save client
        </button>
      </form>
      <p v-if="clientsStore.error" class="text-sm text-red-600 mt-2">{{ clientsStore.error }}</p>
      <p v-if="formError" class="text-sm text-red-600 mt-1">{{ formError }}</p>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-100 text-slate-900">
          <tr>
            <th class="px-4 py-2 text-left font-semibold">Name</th>
            <th class="px-4 py-2 text-left font-semibold">TIN / Number</th>
            <th class="px-4 py-2 text-left font-semibold">Phone</th>
            <th v-if="auth.isAdmin" class="px-4 py-2 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in clientsStore.clients" :key="c._id" class="border-t border-slate-200">
            <td class="px-4 py-2 font-semibold text-slate-900">
              <input
                v-if="editingId === c._id"
                v-model="editForm.name"
                class="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900 font-semibold"
              />
              <span v-else>{{ c.name }}</span>
            </td>
            <td class="px-4 py-2 font-semibold text-slate-900">
              <input
                v-if="editingId === c._id"
                v-model="editForm.tin"
                class="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900 font-semibold"
              />
              <span v-else>{{ c.tin }}</span>
            </td>
            <td class="px-4 py-2 text-slate-700">
              <input
                v-if="editingId === c._id"
                v-model="editForm.phone"
                class="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900 font-semibold"
              />
              <span v-else>{{ c.phone || '—' }}</span>
            </td>
            <td v-if="auth.isAdmin" class="px-4 py-2 space-x-2 text-xs">
              <button
                v-if="editingId === c._id"
                type="button"
                class="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                @click="saveEdit(c._id)"
              >
                Save
              </button>
              <button
                v-if="editingId === c._id"
                type="button"
                class="px-3 py-1 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                v-else
                type="button"
                class="px-3 py-1 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700"
                @click="startEdit(c)"
              >
                Edit
              </button>
              <button
                v-if="editingId !== c._id"
                type="button"
                class="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                @click="removeClient(c._id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!clientsStore.clients.length" class="px-4 py-6 text-center text-slate-500">
        No clients yet. Add one above before issuing a receipt.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useClientsStore } from '../stores/clients';
import { useAuthStore } from '../stores/auth';

const clientsStore = useClientsStore();
const auth = useAuthStore();
const form = ref({ name: '', tin: '', phone: '', address: '' });
const editingId = ref(null);
const editForm = ref({ name: '', tin: '', phone: '' });
const formError = ref('');

onMounted(async () => {
  await clientsStore.fetchClients();
});

async function submit() {
  formError.value = '';
  const phone = form.value.phone?.trim();
  const tin = form.value.tin?.trim();
  const phonePattern = /^07(2|3|8|9)\d{7}$/;
  const tinPattern = /^1\d{8}$/;
  if (!tinPattern.test(tin)) {
    formError.value = 'TIN must start with 1 and have exactly 9 digits.';
    return;
  }
  if (phone && !phonePattern.test(phone)) {
    formError.value = 'Phone must start with 078/072/079/073 and have exactly 10 digits.';
    return;
  }
  await clientsStore.createClient(form.value);
  form.value = { name: '', tin: '', phone: '', address: '' };
}

function startEdit(c) {
  if (!auth.isAdmin) return;
  editingId.value = c._id;
  editForm.value = {
    name: c.name,
    tin: c.tin,
    phone: c.phone || '',
  };
}

function cancelEdit() {
  editingId.value = null;
}

async function saveEdit(id) {
  if (!auth.isAdmin) return;
  formError.value = '';
  const phone = editForm.value.phone?.trim();
  const tin = editForm.value.tin?.trim();
  const phonePattern = /^07(2|3|8|9)\d{7}$/;
  const tinPattern = /^1\d{8}$/;
  if (!tinPattern.test(tin)) {
    formError.value = 'TIN must start with 1 and have exactly 9 digits.';
    return;
  }
  if (phone && !phonePattern.test(phone)) {
    formError.value = 'Phone must start with 078/072/079/073 and have exactly 10 digits.';
    return;
  }
  await clientsStore.updateClient(id, editForm.value);
  editingId.value = null;
}

async function removeClient(id) {
  if (!auth.isAdmin) return;
  await clientsStore.deleteClient(id);
}
</script>

