<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 mb-4">User management (Admin)</h1>
    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h2 class="text-lg font-semibold mb-4">Create user</h2>
      <form @submit.prevent="createUser" class="flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-sm text-slate-600 mb-1">Username</label>
          <input v-model="newUser.username" required class="rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-slate-600 mb-1">Password</label>
          <input v-model="newUser.password" type="password" required class="rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-slate-600 mb-1">Role</label>
          <select v-model="newUser.role" class="rounded-lg border border-slate-300 px-3 py-2">
            <option value="account">Account</option>
            <option value="stock_manager">Stock Manager</option>
            <option value="admin">Admin</option>
            <option value="director">Director</option>
          </select>
        </div>
        <button type="submit" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Create</button>
      </form>
      <p v-if="userError" class="text-red-600 text-sm mt-2">{{ userError }}</p>
    </div>
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-100">
          <tr>
            <th class="px-4 py-2 text-left">Username</th>
            <th class="px-4 py-2 text-left">Role</th>
            <th class="px-4 py-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u._id" class="border-t border-slate-200">
            <td class="px-4 py-2">{{ u.username }}</td>
            <td class="px-4 py-2">{{ u.role }}</td>
            <td class="px-4 py-2">{{ u.email || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import client from '../api/client';

const users = ref([]);
const newUser = ref({ username: '', password: '', role: 'account' });
const userError = ref('');

async function load() {
  const { data } = await client.get('/users');
  users.value = data;
}
async function createUser() {
  userError.value = '';
  try {
    await client.post('/users', newUser.value);
    newUser.value = { username: '', password: '', role: 'account' };
    await load();
  } catch (e) {
    userError.value = e.response?.data?.message || 'Failed to create user';
  }
}
onMounted(load);
</script>
