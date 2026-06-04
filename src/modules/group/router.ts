import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/groups',
    component: () => import('./views/GroupListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/groups/:id',
    name: 'GroupDetail',
    component: () => import('./views/GroupDetailView.vue'),
    meta: { requiresAuth: true },
  },
]

export default routes
