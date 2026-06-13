export const GROUP_MESSAGES = {
  CREATE_SUCCESS: 'Tạo nhóm thành công',
  CREATE_ERROR: 'Tạo nhóm thất bại',
} as const

export const GROUP_DETAIL_TABS = {
  EXPENSES: 'expenses',
  DEBT: 'debt',
} as const

export type GroupDetailTab = (typeof GROUP_DETAIL_TABS)[keyof typeof GROUP_DETAIL_TABS]

export const TAB_EMPTY_MESSAGE: Record<GroupDetailTab, string> = {
  [GROUP_DETAIL_TABS.EXPENSES]: 'Chưa có khoản chi nào.',
  [GROUP_DETAIL_TABS.DEBT]: 'Chưa có khoản nợ nào.',
}
