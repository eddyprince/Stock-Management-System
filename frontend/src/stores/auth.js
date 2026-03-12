/**
 * Auth store: user, token, login, logout, register. Keeps UI in sync with auth state.
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import client from '../api/client';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'));
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isStockManager = computed(() => user.value?.role === 'stock_manager' || user.value?.role === 'admin');
  const isDirector = computed(() => user.value?.role === 'director' || user.value?.role === 'admin');

  function setAuth(tok, u) {
    token.value = tok;
    user.value = u;
    if (tok) {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify(u));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async function login(username, password) {
    const { data } = await client.post('/auth/login', { username, password });
    setAuth(data.token, data.user);
    return data;
  }

  async function register(username, password, role = 'account', email = '') {
    const { data } = await client.post('/auth/register', { username, password, role, email });
    return data;
  }

  function logout() {
    setAuth(null, null);
  }

  async function fetchMe() {
    const { data } = await client.get('/auth/me');
    user.value = data.user;
    if (token.value) localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async function updateProfile(payload) {
    const { data } = await client.patch('/auth/profile', payload);
    user.value = data.user;
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async function changePassword(currentPassword, newPassword) {
    await client.post('/auth/change-password', { currentPassword, newPassword });
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isStockManager,
    isDirector,
    login,
    register,
    logout,
    fetchMe,
    updateProfile,
    changePassword,
    setAuth,
  };
});
