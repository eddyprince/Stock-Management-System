<template>
  <nav class="bg-primary-700 text-white shadow-md" aria-label="Main navigation">
    <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
      <router-link to="/dashboard" class="font-semibold text-lg text-white hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white rounded">
        Stock Control
      </router-link>
      <ul class="flex items-center gap-4">
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
const auth = useAuthStore();
</script>
