import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/sign-in', component: () => import('./views/SignInView.vue') },
  { path: '/auth/callback', component: () => import('./views/AuthCallback.vue') },
]

export default routes
