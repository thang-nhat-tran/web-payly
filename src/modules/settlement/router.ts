import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/groups/:id/debts/pay',
    name: 'SettleDebt',
    component: () => import('./views/SettleDebtView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/groups/:id/settlements/:settlementId',
    name: 'SettlementDetail',
    component: () => import('./views/SettlementDetailView.vue'),
    meta: { requiresAuth: true },
  },
]

export default routes
