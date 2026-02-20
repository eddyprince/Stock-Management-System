<template>
  <div class="max-w-xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 mb-4">Account</h1>
    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <p class="text-slate-600"><strong>Username:</strong> {{ auth.user?.username }}</p>
      <p class="text-slate-600"><strong>Role:</strong> {{ auth.user?.role }}</p>
      <p v-if="auth.user?.email" class="text-slate-600"><strong>Email:</strong> {{ auth.user.email }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
const auth = useAuthStore();
</script>
