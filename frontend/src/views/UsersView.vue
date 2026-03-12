<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-extrabold text-yellow-500 mb-4">User Management (Admin)</h1>
    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h2 class="text-lg font-semibold mb-4 text-emerald-600">Create User Account</h2>
      <form @submit.prevent="createUser" class="flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-sm font-semibold text-emerald-700 mb-1">Username</label>
          <input v-model="newUser.username" required class="rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-emerald-700 mb-1">Password</label>
          <input v-model="newUser.password" type="password" required class="rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-emerald-700 mb-1">Role</label>
          <select v-model="newUser.role" class="rounded-lg border border-slate-300 px-3 py-2">
            <option value="account">Account</option>
            <option value="stock_manager">Stock Manager</option>
            <option value="admin">Admin</option>
            <option value="director">Director</option>
          </select>
        </div>
        <button
          type="submit"
          class="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700"
        >
          Create
        </button>
      </form>
      <p v-if="userError" class="text-red-600 text-sm mt-2">{{ userError }}</p>
    </div>
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-100">
          <tr>
            <th class="px-4 py-2 text-left font-semibold text-slate-900">Username</th>
            <th class="px-4 py-2 text-left font-semibold text-slate-900">Role</th>
            <th class="px-4 py-2 text-left font-semibold text-slate-900">Email</th>
            <th class="px-4 py-2 text-left font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u._id" class="border-t border-slate-200">
            <td class="px-4 py-2 font-semibold text-slate-900">
              <input
                v-if="editingId === u._id"
                v-model="editUser.username"
                class="rounded-lg border border-slate-300 px-2 py-1 text-sm w-full"
              />
              <span v-else>{{ u.username }}</span>
            </td>
            <td class="px-4 py-2 font-semibold text-slate-800">
              <select
                v-if="editingId === u._id"
                v-model="editUser.role"
                class="rounded-lg border border-slate-300 px-2 py-1 text-sm"
              >
                <option value="account">Account</option>
                <option value="stock_manager">Stock Manager</option>
                <option value="admin">Admin</option>
                <option value="director">Director</option>
              </select>
              <span v-else>{{ u.role }}</span>
            </td>
            <td class="px-4 py-2 text-slate-700">
              <input
                v-if="editingId === u._id"
                v-model="editUser.email"
                class="rounded-lg border border-slate-300 px-2 py-1 text-sm w-full"
              />
              <span v-else>{{ u.email || '—' }}</span>
            </td>
            <td class="px-4 py-2 space-x-2">
              <button
                v-if="editingId === u._id"
                type="button"
                class="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                @click="saveEdit(u._id)"
              >
                Save
              </button>
              <button
                v-if="editingId === u._id"
                type="button"
                class="px-3 py-1 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-300"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                v-else
                type="button"
                class="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
                @click="startEdit(u)"
              >
                Edit
              </button>
              <button
                v-if="editingId !== u._id"
                type="button"
                class="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                @click="deleteUser(u._id)"
              >
                Delete
              </button>
            </td>
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
const editingId = ref(null);
const editUser = ref({ username: '', role: 'account', email: '' });

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

function startEdit(user) {
  editingId.value = user._id;
  editUser.value = {
    username: user.username,
    role: user.role,
    email: user.email || '',
  };
}

function cancelEdit() {
  editingId.value = null;
}

async function saveEdit(id) {
  userError.value = '';
  try {
    await client.patch(`/users/${id}`, editUser.value);
    editingId.value = null;
    await load();
  } catch (e) {
    userError.value = e.response?.data?.message || 'Failed to update user';
  }
}

async function deleteUser(id) {
  userError.value = '';
  try {
    await client.delete(`/users/${id}`);
    await load();
  } catch (e) {
    userError.value = e.response?.data?.message || 'Failed to delete user';
  }
}
onMounted(load);
</script>
