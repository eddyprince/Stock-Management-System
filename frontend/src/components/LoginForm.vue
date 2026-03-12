<template>
  <form @submit.prevent="submit" class="space-y-4">
    <div>
      <label for="username" class="block text-xs font-semibold text-slate-900 mb-1 tracking-wide">Username</label>
      <input
        id="username"
        v-model="username"
        type="text"
        required
        autocomplete="username"
        class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
        :aria-describedby="error ? 'login-error' : undefined"
      />
    </div>
    <div>
      <label for="password" class="block text-xs font-semibold text-slate-900 mb-1 tracking-wide">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
        :aria-describedby="error ? 'login-error' : undefined"
      />
    </div>
    <p v-if="error" id="login-error" class="text-xs text-red-400" role="alert">{{ error }}</p>
    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-semibold py-2.5 px-4 rounded-full shadow-lg focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 text-sm"
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
