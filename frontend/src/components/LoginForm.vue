<template>
  <form @submit.prevent="submit" class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-slate-700 mb-1">Username</label>
      <input
        id="username"
        v-model="username"
        type="text"
        required
        autocomplete="username"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        :aria-describedby="error ? 'login-error' : undefined"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        :aria-describedby="error ? 'login-error' : undefined"
      />
    </div>
    <p v-if="error" id="login-error" class="text-sm text-red-600" role="alert">{{ error }}</p>
    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {{ loading ? 'Signing in…' : 'Sign in' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits(['success']);
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    emit('success');
  } catch (e) {
    error.value = e.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>
