import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import authRoutes from '@/modules/auth/router'
import groupRoutes from '@/modules/group/router'
import groupMemberRoutes from '@/modules/group-member/router'

const routes = [...authRoutes, ...groupRoutes, ...groupMemberRoutes]

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
