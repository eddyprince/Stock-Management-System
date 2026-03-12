<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-800 via-sky-700 to-sky-500 px-4">
    <div
      class="w-full max-w-5xl rounded-3xl bg-white/95 text-slate-900 shadow-[0_28px_80px_rgba(15,23,42,0.7)] border border-sky-100 overflow-hidden"
    >
      <!-- Header tabs -->
      <header class="bg-sky-900 text-white px-8 py-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-sky-200 mb-1">Create your account</p>
          <h1 class="text-xl md:text-2xl font-bold leading-tight">Stock Control System</h1>
          <p class="text-[11px] md:text-xs text-sky-100/80">
            Register as an account user, stock manager, admin‑approved staff or director / manager.
          </p>
        </div>
        <div class="flex items-end gap-2 text-sm">
          <router-link
            to="/login"
            class="px-4 py-2 rounded-t-md border border-sky-700/60 text-sky-100/80 hover:text-white hover:bg-sky-800/80 text-sm"
          >
            Login
          </router-link>
          <button
            type="button"
            class="px-4 py-2 rounded-t-md border border-b-0 bg-white text-sky-900 border-sky-100 font-semibold"
          >
            Register
          </button>
        </div>
      </header>

      <div class="px-8 py-6 grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-start">
        <!-- Form column -->
        <section aria-label="Register form">
          <p class="text-xs text-slate-600 mb-4">
            Choose your role, provide an email and set an initial password. A verification code is generated for this
            demo (in a real app it would be emailed to you).
          </p>
          <form v-if="step === 'form'" @submit.prevent="submit" class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
            <div>
              <label for="reg-username" class="block text-xs font-semibold text-slate-900 mb-1 tracking-wide">Username</label>
              <input
                id="reg-username"
                v-model="username"
                type="text"
                required
                autocomplete="username"
                class="w-full rounded-full border border-sky-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
              />
            </div>
            <div>
              <label for="reg-email" class="block text-xs font-semibold text-slate-900 mb-1 tracking-wide">Email</label>
              <input
                id="reg-email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="w-full rounded-full border border-sky-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
              />
            </div>
            <div>
              <label for="reg-role" class="block text-xs font-semibold text-slate-900 mb-1 tracking-wide">Role</label>
              <select
                id="reg-role"
                v-model="role"
                class="w-full rounded-full border border-sky-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
              >
                <option value="account">Account (basic user)</option>
                <option value="stock_manager">Stock manager</option>
                <option value="director">Director (reports only)</option>
              </select>
              <p class="mt-1 text-[10px] text-slate-400">
                Admin role is reserved and cannot be self-created.
              </p>
            </div>
            <div>
              <label for="reg-password" class="block text-xs font-semibold text-slate-900 mb-1 tracking-wide">Password</label>
              <input
                id="reg-password"
                v-model="password"
                type="password"
                required
                minlength="3"
                autocomplete="new-password"
                class="w-full rounded-full border border-sky-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
              />
            </div>
            <div>
              <label for="reg-confirm" class="block text-xs font-semibold text-slate-900 mb-1 tracking-wide"
                >Confirm password</label
              >
              <input
                id="reg-confirm"
                v-model="confirmPassword"
                type="password"
                required
                autocomplete="new-password"
                class="w-full rounded-full border border-sky-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
              />
              <p v-if="confirmError" class="text-xs text-red-400 mt-1">{{ confirmError }}</p>
            </div>
            <p v-if="verificationInfo" class="text-xs text-emerald-400" role="status">
              {{ verificationInfo }}
            </p>
            <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-full shadow-md focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-100 disabled:opacity-60 text-sm"
            >
              {{ loading ? 'Creating…' : 'Sign up' }}
            </button>
          </form>
          <!-- Verification step -->
          <form v-else @submit.prevent="verify" class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
            <p class="text-xs text-slate-300">
              We generated a verification code for <span class="font-semibold text-cyan-200">{{ pendingUsername }}</span>.
              In a real system this would be sent to your email. Enter the code you received from the admin or email to
              activate your account.
            </p>
            <div>
              <label for="verify-code" class="block text-xs font-semibold text-slate-900 mb-1 tracking-wide"
                >Verification code</label
              >
              <input
                id="verify-code"
                v-model="code"
                type="text"
                required
                minlength="6"
                maxlength="6"
                class="w-full rounded-full border border-sky-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
              />
            </div>
            <p v-if="verificationInfo" class="text-xs text-emerald-400" role="status">
              {{ verificationInfo }}
            </p>
            <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-full shadow-md focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-100 disabled:opacity-60 text-sm"
            >
              {{ loading ? 'Verifying…' : 'Verify account' }}
            </button>
          </form>
          <p class="mt-4 text-center text-xs text-slate-600">
            Already have an account?
            <router-link to="/login" class="text-sky-700 hover:underline font-semibold">Sign in</router-link>
          </p>
        </section>

        <!-- Right info column -->
        <aside class="space-y-4 text-xs">
          <div class="rounded-2xl bg-sky-50 border border-sky-100 p-4">
            <p class="text-[11px] font-semibold text-sky-900 mb-1">Who is this for?</p>
            <p class="text-slate-600 mb-2">
              Shop owners, accountants, stock managers and directors who want a clear picture of stock and profit.
            </p>
            <ul class="list-disc list-inside space-y-1 text-slate-600">
              <li>Record where each product comes from and its purchase price.</li>
              <li>Track in‑stock, out‑of‑stock, expired and damaged quantities.</li>
              <li>See daily sales and profit / loss reports automatically.</li>
            </ul>
          </div>
          <div class="rounded-2xl bg-gradient-to-br from-sky-900 to-sky-700 text-white p-4 shadow-md">
            <p class="text-xs font-semibold mb-2">Secure, role‑based access</p>
            <p class="text-[11px] text-sky-100">
              Admin approves roles, stock managers update quantities, account users handle day‑to‑day sales and directors
              focus on reports only.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const email = ref('');
const role = ref('account');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const confirmError = ref('');
const loading = ref(false);
const verificationInfo = ref('');
const step = ref('form'); // 'form' | 'verify'
const pendingUsername = ref('');
const code = ref('');

async function submit() {
  error.value = '';
  confirmError.value = '';
  if (password.value !== confirmPassword.value) {
    confirmError.value = 'Passwords do not match';
    return;
  }
  if (password.value.length < 3) {
    error.value = 'Password must be at least 3 characters';
    return;
  }
  loading.value = true;
  try {
    const { data } = await auth.register(username.value, password.value, role.value, email.value);
    if (data?.verificationCode) {
      verificationInfo.value = `Verification code (simulated email): ${data.verificationCode}. In a real system this would be sent to ${email.value}.`;
    }
    pendingUsername.value = username.value;
    step.value = 'verify';
  } catch (e) {
    const msg = e.response?.data?.message;
    error.value = msg || e.message || 'Registration failed. Try another username or sign in if you already have an account.';
  } finally {
    loading.value = false;
  }
}

async function verify() {
  error.value = '';
  verificationInfo.value = '';
  if (!pendingUsername.value) {
    error.value = 'Registration step is missing. Please fill the form again.';
    step.value = 'form';
    return;
  }
  loading.value = true;
  try {
    await auth.verifyRegistrationCode(pendingUsername.value, code.value);
    verificationInfo.value = 'Account verified. You can now sign in.';
    router.push({ name: 'Login', query: { registered: '1' } });
  } catch (e) {
    const msg = e.response?.data?.message;
    error.value = msg || e.message || 'Verification failed. Check the code and try again.';
  } finally {
    loading.value = false;
  }
}
</script>
