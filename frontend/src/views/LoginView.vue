<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 class="text-2xl font-bold text-primary-700 text-center mb-2">Stock Management System</h1>
        <p class="text-slate-600 text-center mb-6">Sign in to continue</p>
        <LoginForm @success="onLoginSuccess" />
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
