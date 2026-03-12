<template>
  <nav class="bg-primary-700 text-white shadow-md" aria-label="Main navigation">
    <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
      <router-link
        to="/dashboard"
        class="font-semibold text-lg text-white hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white rounded"
      >
        {{ t('appName', 'Stock Control') }}
      </router-link>
      <ul class="flex items-center gap-4 text-xs">
        <li v-if="auth.isStockManager">
          <router-link to="/products" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            {{ t('nav.products', 'Products') }}
          </router-link>
        </li>
        <li v-if="auth.isDirector">
          <router-link to="/reports" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            {{ t('nav.reports', 'Reports') }}
          </router-link>
        </li>
        <li v-if="auth.isAdmin">
          <router-link to="/users" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            {{ t('nav.users', 'Users') }}
          </router-link>
        </li>
        <li>
          <router-link to="/account" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            {{ t('nav.account', 'Account') }}
          </router-link>
        </li>
        <li>
          <!-- Language selector -->
          <select
            v-model="settings.language"
            @change="onLanguageChange"
            class="bg-primary-800 text-white text-[11px] rounded px-1.5 py-0.5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option value="en">EN</option>
            <option value="rw">RW</option>
            <option value="fr">FR</option>
            <option value="sw">SW</option>
          </select>
        </li>
        <li>
          <!-- Theme toggle -->
          <button
            type="button"
            @click="toggleTheme"
            class="text-white/90 hover:text-white px-2 py-1 rounded border border-white/30 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
          >
            {{ settings.theme === 'light' ? 'Dark' : 'Light' }}
          </button>
        </li>
        <li>
          <button
            type="button"
            @click="auth.logout(); $router.push('/login')"
            class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
          >
            {{ t('nav.logout', 'Logout') }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useSettingsStore } from '../stores/settings';
import { translate } from '../i18n';

const auth = useAuthStore();
const settings = useSettingsStore();

function t(path, fallback) {
  return translate(settings.language, path, fallback);
}

function onLanguageChange(event) {
  settings.setLanguage(event.target.value);
}

function toggleTheme() {
  settings.setTheme(settings.theme === 'light' ? 'dark' : 'light');
}
</script>
