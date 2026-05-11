import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/home', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/login', component: () => import('@/views/LoginView.vue') },
  { path: '/auth/callback', component: () => import('@/views/AuthCallback.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) await auth.init()

  if (to.path === '/') {
    return auth.isAuthenticated ? '/home' : '/login'
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.path === '/login' && auth.isAuthenticated) {
    return '/home'
  }
})

export default router
