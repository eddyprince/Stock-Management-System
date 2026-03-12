<template>
  <div class="max-w-xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 mb-4">Personal profile</h1>

    <!-- Profile info & edit -->
    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Your account</h2>
      <div v-if="!editing" class="space-y-2">
        <p class="text-slate-600"><strong>Username:</strong> {{ auth.user?.username }}</p>
        <p class="text-slate-600"><strong>Display name:</strong> {{ auth.user?.displayName || '—' }}</p>
        <p class="text-slate-600"><strong>Role:</strong> {{ auth.user?.role }}</p>
        <p class="text-slate-600"><strong>Email:</strong> {{ auth.user?.email || '—' }}</p>
        <button type="button" @click="editing = true; profileForm = { email: auth.user?.email || '', displayName: auth.user?.displayName || '' }" class="mt-4 text-primary-600 hover:underline font-medium">Edit profile</button>
      </div>
      <form v-else @submit.prevent="saveProfile" class="space-y-4">
        <div>
          <label for="displayName" class="block text-sm font-medium text-slate-700 mb-1">Display name (optional)</label>
          <input id="displayName" v-model="profileForm.displayName" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="e.g. Eddy" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email (optional)</label>
          <input id="email" v-model="profileForm.email" type="email" class="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="you@example.com" />
        </div>
        <p v-if="profileError" class="text-sm text-red-600">{{ profileError }}</p>
        <div class="flex gap-2">
          <button type="submit" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Save</button>
          <button type="button" @click="editing = false" class="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Change password -->
    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Change password</h2>
      <form @submit.prevent="savePassword" class="space-y-4">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-slate-700 mb-1">Current password</label>
          <input id="currentPassword" v-model="passwordForm.currentPassword" type="password" required class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1">New password</label>
          <input id="newPassword" v-model="passwordForm.newPassword" type="password" required minlength="3" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1">Confirm new password</label>
          <input id="confirmPassword" v-model="passwordForm.confirmPassword" type="password" required class="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <p v-if="passwordMismatch" class="text-sm text-red-600 mt-1">Passwords do not match</p>
        </div>
        <p v-if="passwordError" class="text-sm text-red-600">{{ passwordError }}</p>
        <p v-if="passwordSuccess" class="text-sm text-green-600">Password updated.</p>
        <button type="submit" :disabled="passwordMismatch" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">Change password</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const editing = ref(false);
const profileForm = ref({ email: '', displayName: '' });
const profileError = ref('');
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' });
const passwordError = ref('');
const passwordSuccess = ref(false);

const passwordMismatch = computed(() => {
  const { newPassword, confirmPassword } = passwordForm.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword;
});

async function saveProfile() {
  profileError.value = '';
  try {
    await auth.updateProfile({
      email: profileForm.value.email || undefined,
      displayName: profileForm.value.displayName || undefined,
    });
    editing.value = false;
  } catch (e) {
    profileError.value = e.response?.data?.message || 'Update failed';
  }
}

async function savePassword() {
  if (passwordMismatch.value) return;
  passwordError.value = '';
  passwordSuccess.value = false;
  try {
    await auth.changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword);
    passwordSuccess.value = true;
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  } catch (e) {
    passwordError.value = e.response?.data?.message || 'Failed to change password';
  }
}
</script>
