<template>
  <div class="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark transition-colors">
    <AppNav v-if="auth.isAuthenticated" />
    <main class="flex-1 p-4 md:p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import AppNav from './components/AppNav.vue';
import { useUiStore } from './stores/ui';

const auth = useAuthStore();
// Initialize UI store so theme/language are applied on load
const ui = useUiStore();
</script>
