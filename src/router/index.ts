import { useAuthStore } from '@/features/auth/stores/auth.store'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/groups', component: () => import('@/features/group/views/GroupListView.vue'), meta: { requiresAuth: true } },
  { path: '/sign-in', component: () => import('@/features/auth/views/SignInView.vue') },
  { path: '/auth/callback', component: () => import('@/features/auth/views/AuthCallback.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) await auth.init()

  if (to.path === '/') {
    return auth.isAuthenticated ? '/groups' : '/sign-in'
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/sign-in'
  }

  if (to.path === '/sign-in' && auth.isAuthenticated) {
    return '/groups'
  }
})

export default router
