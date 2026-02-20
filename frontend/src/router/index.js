/**
 * Vue Router: routes and navigation guard (requiresAuth, role-based redirect).
 */
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    redirect: (to) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) return { name: 'Login' };
      if (auth.isDirector && !auth.isAdmin) return { name: 'Reports' };
      return { name: 'Dashboard' };
    },
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/ProductsView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'stock_manager'] },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/ReportsView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'director'] },
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/AccountView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/UsersView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }
  if (to.meta.roles && to.meta.roles.length && !to.meta.roles.includes(auth.user?.role)) {
    next({ name: 'Dashboard' });
    return;
  }
  next();
});

export default router;
