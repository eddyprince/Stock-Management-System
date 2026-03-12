<template>
  <nav class="bg-primary-700 text-white shadow-md dark:bg-slate-900" aria-label="Main navigation">
    <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
      <router-link to="/dashboard" class="font-semibold text-lg text-white hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white rounded">
        Stock Control
      </router-link>
      <ul class="flex items-center gap-3">
        <li v-if="auth.isStockManager">
          <router-link to="/products" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            Products
          </router-link>
        </li>
        <li v-if="auth.isDirector">
          <router-link to="/reports" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            Reports
          </router-link>
        </li>
        <li v-if="auth.isAdmin">
          <router-link to="/users" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            Users
          </router-link>
        </li>
        <li>
          <router-link to="/account" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            Account
          </router-link>
        </li>
        <!-- Language selector -->
        <li>
          <label for="lang" class="sr-only">Language</label>
          <select
            id="lang"
            v-model="ui.language"
            @change="onLanguageChange"
            class="text-xs bg-primary-600/80 border border-white/30 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label="Select language"
          >
            <option value="en">EN</option>
            <option value="rw">RW</option>
            <option value="fr">FR</option>
            <option value="sw">SW</option>
          </select>
        </li>
        <!-- Theme toggle -->
        <li>
          <button
            type="button"
            @click="ui.toggleTheme"
            class="text-xs px-2 py-1 rounded border border-white/30 bg-primary-600/80 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
            :aria-pressed="ui.theme === 'dark'"
            aria-label="Toggle light or dark mode"
          >
            {{ ui.theme === 'dark' ? 'Light' : 'Dark' }} mode
          </button>
        </li>
        <li>
          <button type="button" @click="auth.logout(); $router.push('/login')" class="text-white/90 hover:text-white px-2 py-1 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useUiStore } from '../stores/ui';

const auth = useAuthStore();
const ui = useUiStore();

function onLanguageChange(event) {
  ui.setLanguage(event.target.value);
}
</script>
