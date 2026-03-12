<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-slate-50">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 class="text-2xl font-bold text-primary-700 text-center mb-2">Sign in</h1>
        <p class="text-slate-600 text-center mb-6">Sign in to access the dashboard and data.</p>
        <p v-if="route.query.registered === '1'" class="mb-4 text-sm text-green-600 text-center">Account created. Sign in with your new username and password.</p>
        <LoginForm @success="onLoginSuccess" />
        <p class="mt-4 text-center text-sm text-slate-600">
          No account? <router-link to="/register" class="text-primary-600 hover:underline font-medium">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginForm from '../components/LoginForm.vue';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

function onLoginSuccess() {
  const redirect = route.query.redirect || '/';
  if (auth.isDirector && !auth.isAdmin) router.push({ name: 'Reports' });
  else if (redirect && redirect !== '/login') router.push(redirect);
  else router.push({ name: 'Dashboard' });
}
</script>
