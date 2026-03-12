<template>
  <div class="min-h-screen flex items-center justify-center bg-[#020617] px-4">
    <div
      class="w-full max-w-4xl bg-gradient-to-br from-cyan-500/30 via-cyan-400/20 to-emerald-400/10 rounded-3xl p-[1px] shadow-[0_0_40px_rgba(34,211,238,0.4)]"
    >
      <div class="w-full h-full flex flex-col md:flex-row bg-slate-950 rounded-3xl overflow-hidden">
        <!-- Left banner -->
        <div class="md:w-1/2 relative flex items-center justify-center bg-gradient-to-br from-cyan-500 to-sky-500 p-8">
          <div class="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),transparent_60%)]" />
          <div class="relative z-10 text-left text-white">
            <p class="text-xs uppercase tracking-[0.25em] text-cyan-100 mb-2">Welcome back</p>
            <h1 class="text-3xl font-extrabold leading-tight mb-2">Secure your stock.</h1>
            <p class="text-sm text-cyan-50 mb-4 max-w-xs">
              Log in to see live stock levels, daily sales totals and profit so no item goes missing without you knowing.
            </p>
            <ul class="text-[11px] space-y-1 text-cyan-50/90">
              <li>• Track every product in and out</li>
              <li>• Detect losses and theft quickly</li>
              <li>• Separate dashboards for admin, stock manager and director</li>
            </ul>
          </div>
        </div>

        <!-- Right form -->
        <div class="md:w-1/2 px-8 py-8 flex flex-col justify-center bg-slate-950">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xl font-semibold text-cyan-100 text-center md:text-left">Sign in</h2>
            <router-link
              to="/"
              class="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-200"
            >
              ← Back to landing
            </router-link>
          </div>
          <p class="text-xs text-slate-400 mb-4 text-center md:text-left">
            Use your username and password to access your role‑based dashboard.
          </p>
          <router-link
            to="/"
            class="md:hidden mb-3 inline-flex items-center justify-center text-[11px] text-slate-400 hover:text-cyan-200"
          >
            ← Back to landing
          </router-link>
          <p
            v-if="route.query.registered === '1'"
            class="mb-3 text-xs text-emerald-400 text-center md:text-left"
          >
            Account created. Sign in with your new username and password.
          </p>
          <LoginForm @success="onLoginSuccess" />
          <div class="mt-4 flex flex-col items-center gap-1 text-xs text-slate-400">
            <p>
              No account?
              <router-link to="/register" class="text-cyan-300 hover:underline font-medium">Create one</router-link>
            </p>
            <p>
              Forgot password?
              <router-link to="/forgot-password" class="text-cyan-300 hover:underline font-medium"
                >Reset it here</router-link
              >
            </p>
          </div>
        </div>
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
