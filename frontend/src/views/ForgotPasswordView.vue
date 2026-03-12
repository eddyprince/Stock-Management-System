<template>
  <div class="min-h-screen flex items-center justify-center bg-[#020617] px-4">
    <div
      class="w-full max-w-4xl bg-gradient-to-br from-cyan-500/30 via-cyan-400/20 to-emerald-400/10 rounded-3xl p-[1px] shadow-[0_0_40px_rgba(34,211,238,0.4)]"
    >
      <div class="w-full h-full flex flex-col md:flex-row bg-slate-950 rounded-3xl overflow-hidden">
        <!-- Left banner -->
        <div class="md:w-1/2 relative flex items-center justify-center bg-gradient-to-br from-cyan-500 to-sky-500 p-8">
          <div
            class="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),transparent_60%)]"
          ></div>
          <div class="relative z-10 text-left text-white">
            <p class="text-xs uppercase tracking-[0.25em] text-cyan-100 mb-2">Forgot password?</p>
            <h1 class="text-3xl font-extrabold leading-tight mb-2">Recover access safely.</h1>
            <p class="text-sm text-cyan-50 mb-4 max-w-xs">
              Request a reset code and then set a new password so that only you can access your dashboard.
            </p>
          </div>
        </div>

        <!-- Right form -->
        <div class="md:w-1/2 px-8 py-8 flex flex-col justify-center bg-slate-950">
          <h2 class="text-xl font-semibold text-cyan-100 mb-1 text-center md:text-left">Reset password</h2>
          <p class="text-xs text-slate-400 mb-4 text-center md:text-left">
            Step 1: request a reset code. Step 2: enter the code and your new password.
          </p>

          <!-- Step 1: request code -->
          <form v-if="step === 'request'" @submit.prevent="requestReset" class="space-y-4">
            <div>
              <label for="fp-username" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide">Username</label>
              <input
                id="fp-username"
                v-model="username"
                type="text"
                required
                autocomplete="username"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
              />
            </div>
            <div>
              <label for="fp-email" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide">Email</label>
              <input
                id="fp-email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
              />
            </div>
            <p v-if="info" class="text-xs text-emerald-400" role="status">{{ info }}</p>
            <p v-if="error" class="text-xs text-red-400" role="alert">{{ error }}</p>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-semibold py-2.5 px-4 rounded-full shadow-lg focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 text-sm"
            >
              {{ loading ? 'Sending…' : 'Send reset code' }}
            </button>
          </form>

          <!-- Step 2: verify code + new password -->
          <form v-else @submit.prevent="submitReset" class="space-y-4">
            <div>
              <label for="fp-code" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide"
                >Reset code</label
              >
              <input
                id="fp-code"
                v-model="code"
                type="text"
                required
                minlength="6"
                maxlength="6"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
              />
            </div>
            <div>
              <label for="fp-new" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide"
                >New password</label
              >
              <input
                id="fp-new"
                v-model="newPassword"
                type="password"
                required
                minlength="3"
                autocomplete="new-password"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
              />
            </div>
            <p v-if="info" class="text-xs text-emerald-400" role="status">{{ info }}</p>
            <p v-if="error" class="text-xs text-red-400" role="alert">{{ error }}</p>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-semibold py-2.5 px-4 rounded-full shadow-lg focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 text-sm"
            >
              {{ loading ? 'Updating…' : 'Change password' }}
            </button>
          </form>

          <p class="mt-4 text-center text-xs text-slate-400">
            Remembered your password?
            <router-link to="/login" class="text-cyan-300 hover:underline font-medium">Back to sign in</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

const step = ref('request'); // 'request' | 'reset'
const username = ref('');
const email = ref('');
const code = ref('');
const newPassword = ref('');
const loading = ref(false);
const error = ref('');
const info = ref('');

async function requestReset() {
  error.value = '';
  info.value = '';
  loading.value = true;
  try {
    const { data } = await auth.requestPasswordReset(username.value, email.value);
    if (data?.resetCode) {
      info.value = `Reset code (simulated email): ${data.resetCode}. In a real system this would be sent to ${email.value}.`;
    } else {
      info.value = 'Reset code sent. Check your email (simulated).';
    }
    step.value = 'reset';
  } catch (e) {
    const msg = e.response?.data?.message;
    error.value = msg || e.message || 'Failed to send reset code.';
  } finally {
    loading.value = false;
  }
}

async function submitReset() {
  error.value = '';
  info.value = '';
  loading.value = true;
  try {
    await auth.resetPassword(username.value, code.value, newPassword.value);
    info.value = 'Password changed. You can now log in with your new password.';
  } catch (e) {
    const msg = e.response?.data?.message;
    error.value = msg || e.message || 'Failed to change password.';
  } finally {
    loading.value = false;
  }
}
</script>

