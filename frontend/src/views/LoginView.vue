<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-800 via-sky-700 to-sky-500 px-4">
    <div
      class="w-full max-w-5xl rounded-3xl bg-white/95 text-slate-900 shadow-[0_28px_80px_rgba(15,23,42,0.7)] border border-sky-100 overflow-hidden"
    >
      <!-- Header tabs -->
      <header class="bg-sky-900 text-white px-8 py-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-sky-200 mb-1">Welcome to</p>
          <h1 class="text-xl md:text-2xl font-bold leading-tight">Stock Control System</h1>
          <p class="text-[11px] md:text-xs text-sky-100/80">
            Optimize your inventory efficiently with role‑based dashboards.
          </p>
        </div>
        <div class="flex items-end gap-2 text-sm">
          <button
            type="button"
            class="px-4 py-2 rounded-t-md border border-b-0"
            :class="'bg-white text-sky-900 border-sky-100 font-semibold'"
          >
            Login
          </button>
          <router-link
            to="/register"
            class="px-4 py-2 rounded-t-md border border-sky-700/60 text-sky-100/80 hover:text-white hover:bg-sky-800/80 text-sm"
          >
            Register
          </router-link>
        </div>
      </header>

      <!-- Body -->
      <div class="px-8 py-6 grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        <!-- Login form column -->
        <section aria-label="Login form" class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Log in</h2>
            <router-link to="/" class="text-xs text-sky-600 hover:underline">Back to landing</router-link>
          </div>
          <p class="text-xs text-slate-500">
            Use your username and password to access the dashboard for your role (Stock Manager, Account, or Director /
            Manager).
          </p>
          <p
            v-if="route.query.registered === '1'"
            class="mt-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2"
          >
            Account created. Sign in with your new username and password.
          </p>
          <div class="mt-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
            <LoginForm @success="onLoginSuccess" />
          </div>
          <div class="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-600">
            <p>
              No account?
              <router-link to="/register" class="text-sky-700 font-semibold hover:underline">Sign up</router-link>
            </p>
            <p>
              Forgot password?
              <router-link to="/forgot-password" class="text-sky-700 font-semibold hover:underline"
                >Reset it here</router-link
              >
            </p>
          </div>
        </section>

        <!-- Right explanation / role cards -->
        <aside class="space-y-4 text-xs">
          <div class="rounded-2xl bg-sky-50 border border-sky-100 p-4">
            <p class="text-[11px] font-semibold text-sky-900 mb-1">Why log in?</p>
            <p class="text-slate-600 mb-2">
              See live stock levels, usage charts and alerts so that no item goes missing without you knowing.
            </p>
            <ul class="list-disc list-inside space-y-1 text-slate-600">
              <li>Track every product in and out.</li>
              <li>Compare in‑stock, out‑of‑stock, expired and damaged quantities.</li>
              <li>View daily sales and profit / loss reports.</li>
            </ul>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl bg-gradient-to-br from-sky-900 to-sky-700 text-white p-4 shadow-md">
              <p class="text-xs font-semibold mb-2">Accountant Login</p>
              <p class="text-[11px] text-sky-100">
                Account users focus on daily sales and cash records, checking that every transaction is recorded and
                that profit / loss reports are correct.
              </p>
            </div>
            <div class="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 shadow-md">
              <p class="text-xs font-semibold mb-2">Stock Manager Login</p>
              <p class="text-[11px] text-slate-100">
                Stock managers are responsible for updating quantities when products come in, go out, are damaged or
                expire, keeping stock levels accurate.
              </p>
            </div>
          </div>
        </aside>
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
