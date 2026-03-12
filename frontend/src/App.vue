<template>
  <div class="min-h-screen flex flex-col">
    <AppNav v-if="auth.isAuthenticated" />
    <main class="flex-1 p-4 md:p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useAuthStore } from './stores/auth';
import { useSettingsStore } from './stores/settings';
import AppNav from './components/AppNav.vue';

const auth = useAuthStore();
const settings = useSettingsStore();

// Keep CSS theme in sync if theme changes at runtime
watch(
  () => settings.theme,
  (next) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = next;
    }
  },
  { immediate: true },
);
</script>
