import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/join-group/:token',
    component: () => import('./views/GroupJoinView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/groups/:id/members',
    name: 'GroupMembers',
    component: () => import('./views/GroupMemberView.vue'),
    meta: { requiresAuth: true },
  },
]

export default routes
