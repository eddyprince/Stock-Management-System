<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <AppNav v-if="auth.isAuthenticated" />
    <main class="flex-1 p-4 md:p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import AppNav from './components/AppNav.vue';

const auth = useAuthStore();
</script>
