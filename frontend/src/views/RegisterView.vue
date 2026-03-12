<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 class="text-2xl font-bold text-primary-700 text-center mb-2">Create account</h1>
        <p class="text-slate-600 text-center mb-6">Set a username and password to access the dashboard.</p>
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label for="reg-username" class="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              id="reg-username"
              v-model="username"
              type="text"
              required
              autocomplete="username"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label for="reg-password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              id="reg-password"
              v-model="password"
              type="password"
              required
              minlength="3"
              autocomplete="new-password"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label for="reg-confirm" class="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
            <input
              id="reg-confirm"
              v-model="confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <p v-if="confirmError" class="text-sm text-red-600 mt-1">{{ confirmError }}</p>
          </div>
          <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ loading ? 'Creating…' : 'Create account' }}
          </button>
        </form>
        <p class="mt-4 text-center text-sm text-slate-600">
          Already have an account?
          <router-link to="/login" class="text-primary-600 hover:underline font-medium">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const confirmError = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  confirmError.value = '';
  if (password.value !== confirmPassword.value) {
    confirmError.value = 'Passwords do not match';
    return;
  }
  if (password.value.length < 3) {
    error.value = 'Password must be at least 3 characters';
    return;
  }
  loading.value = true;
  try {
    await auth.register(username.value, password.value, 'account', '');
    router.push({ name: 'Login', query: { registered: '1' } });
  } catch (e) {
    const msg = e.response?.data?.message;
    error.value = msg || e.message || 'Registration failed. Try another username or sign in if you already have an account.';
  } finally {
    loading.value = false;
  }
}
</script>
