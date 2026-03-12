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
            <p class="text-xs uppercase tracking-[0.25em] text-cyan-100 mb-2">New here?</p>
            <h1 class="text-3xl font-extrabold leading-tight mb-2">Secure your stock today.</h1>
            <p class="text-sm text-cyan-50 mb-4 max-w-xs">
              Create an account as a shop owner, stock manager or director and let the system watch every item for you.
            </p>
            <ul class="text-[11px] space-y-1 text-cyan-50/90">
              <li>• Choose your role and email</li>
              <li>• Receive a verification code (simulated)</li>
              <li>• Start tracking daily sales, remaining stock and profit</li>
            </ul>
          </div>
        </div>

        <!-- Right form -->
        <div class="md:w-1/2 px-8 py-8 flex flex-col justify-center bg-slate-950">
          <h2 class="text-xl font-semibold text-cyan-100 mb-1 text-center md:text-left">Register</h2>
          <p class="text-xs text-slate-400 mb-4 text-center md:text-left">
            Choose your role, provide an email, and set an initial password. A verification code is simulated for this
            demo (in a real app it would be emailed).
          </p>
          <form v-if="step === 'form'" @submit.prevent="submit" class="space-y-4">
            <div>
              <label for="reg-username" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide">Username</label>
              <input
                id="reg-username"
                v-model="username"
                type="text"
                required
                autocomplete="username"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
              />
            </div>
            <div>
              <label for="reg-email" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide">Email</label>
              <input
                id="reg-email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
              />
            </div>
            <div>
              <label for="reg-role" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide">Role</label>
              <select
                id="reg-role"
                v-model="role"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
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
              <label for="reg-password" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide">Password</label>
              <input
                id="reg-password"
                v-model="password"
                type="password"
                required
                minlength="3"
                autocomplete="new-password"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
              />
            </div>
            <div>
              <label for="reg-confirm" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide"
                >Confirm password</label
              >
              <input
                id="reg-confirm"
                v-model="confirmPassword"
                type="password"
                required
                autocomplete="new-password"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
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
              class="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-semibold py-2.5 px-4 rounded-full shadow-lg focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 text-sm"
            >
              {{ loading ? 'Creating…' : 'Create account' }}
            </button>
          </form>
          <!-- Verification step -->
          <form v-else @submit.prevent="verify" class="space-y-4">
            <p class="text-xs text-slate-300">
              We generated a verification code for <span class="font-semibold text-cyan-200">{{ pendingUsername }}</span>.
              In a real system this would be sent to your email. Enter the code you received from the admin or email to
              activate your account.
            </p>
            <div>
              <label for="verify-code" class="block text-xs font-medium text-slate-200 mb-1 tracking-wide"
                >Verification code</label
              >
              <input
                id="verify-code"
                v-model="code"
                type="text"
                required
                minlength="6"
                maxlength="6"
                class="w-full rounded-full border border-cyan-400/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
              />
            </div>
            <p v-if="verificationInfo" class="text-xs text-emerald-400" role="status">
              {{ verificationInfo }}
            </p>
            <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-900 font-semibold py-2.5 px-4 rounded-full shadow-lg focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 text-sm"
            >
              {{ loading ? 'Verifying…' : 'Verify account' }}
            </button>
          </form>
          <p class="mt-4 text-center text-xs text-slate-400">
            Already have an account?
            <router-link to="/login" class="text-cyan-300 hover:underline font-medium">Sign in</router-link>
          </p>
        </div>
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
