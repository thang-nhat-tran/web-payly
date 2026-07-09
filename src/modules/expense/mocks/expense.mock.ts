import type { PaidExpense, OwedDebt } from '@/modules/expense/types/expense.type'
import type { ExpenseParticipant } from '@/modules/expense/types/expense-participant.type'

const avatar = (u: number) => `https://img.heroui.chat/image/avatar?w=100&h=100&u=${u}`

/** The signed-in user — always the payer when creating an expense. */
export const CURRENT_USER_ID = '00000000-0000-4000-8000-000000000001'

/** Members of the current group, used to pick who an expense is split with. */
export const mockGroupMembers: ExpenseParticipant[] = [
  { id: CURRENT_USER_ID, name: 'Bạn', avatarUrl: avatar(1) },
  { id: '00000000-0000-4000-8000-000000000004', name: 'Trần Thị Lan', avatarUrl: avatar(4) },
  { id: '00000000-0000-4000-8000-000000000005', name: 'Nguyễn Văn Hùng', avatarUrl: avatar(5) },
  { id: '00000000-0000-4000-8000-000000000006', name: 'Lê Minh Khoa', avatarUrl: avatar(6) },
]

/** "Khoản chi" — expenses the current user paid up front; others owe them back. */
export const mockPaidExpenses: PaidExpense[] = [
  {
    kind: 'expense',
    id: 'e1',
    title: 'Ăn tối Nhà hàng Hương Vị',
    paidAt: '2026-05-10T18:30:00',
    totalAmount: 600000,
    amountOwedToMe: 450000,
    debtors: [
      { participant: { id: 'u4', name: 'Trần Thị Lan', avatarUrl: avatar(4) }, amount: 150000, status: 'pending' },
      { participant: { id: 'u5', name: 'Nguyễn Văn Hùng', avatarUrl: avatar(5) }, amount: 150000, status: 'paid' },
      { participant: { id: 'u6', name: 'Lê Minh Khoa', avatarUrl: avatar(6) }, amount: 150000, status: 'pending' },
    ],
  },
  {
    kind: 'expense',
    id: 'e2',
    title: 'Tiền phòng khách sạn',
    paidAt: '2026-05-13T14:00:00',
    totalAmount: 840000,
    amountOwedToMe: 0,
    debtors: [
      { participant: { id: 'u7', name: 'Phạm Bảo Ngọc', avatarUrl: avatar(7) }, amount: 420000, status: 'paid' },
      { participant: { id: 'u8', name: 'Đỗ Gia Bảo', avatarUrl: avatar(8) }, amount: 420000, status: 'paid' },
    ],
  },
  {
    kind: 'expense',
    id: 'e3',
    title: 'Vé xem phim CGV',
    paidAt: '2026-05-16T20:00:00',
    totalAmount: 360000,
    amountOwedToMe: 270000,
    debtors: [
      { participant: { id: 'u4', name: 'Trần Thị Lan', avatarUrl: avatar(4) }, amount: 90000, status: 'pending' },
      { participant: { id: 'u5', name: 'Nguyễn Văn Hùng', avatarUrl: avatar(5) }, amount: 90000, status: 'pending' },
      { participant: { id: 'u6', name: 'Lê Minh Khoa', avatarUrl: avatar(6) }, amount: 90000, status: 'pending' },
    ],
  },
]

/** "Khoản nợ" — expenses someone else paid for; the current user owes their share. */
export const mockOwedDebts: OwedDebt[] = [
  {
    kind: 'debt',
    id: 'd1',
    splitId: 's1',
    title: 'Xăng xe đi Vũng Tàu',
    paidAt: '2026-05-12T09:00:00',
    paidBy: { id: 'u5', name: 'Nguyễn Văn Hùng', avatarUrl: avatar(5) },
    amountIOwe: 85000,
    status: 'pending',
  },
  {
    kind: 'debt',
    id: 'd2',
    splitId: 's2',
    title: 'Vé cáp treo Núi Bà Đen',
    paidAt: '2026-05-15T10:15:00',
    paidBy: { id: 'u7', name: 'Phạm Bảo Ngọc', avatarUrl: avatar(7) },
    amountIOwe: 200000,
    status: 'paid',
    dueAt: '2026-05-20T00:00:00',
  },
  {
    kind: 'debt',
    id: 'd3',
    splitId: 's3',
    title: 'Cà phê sáng',
    paidAt: '2026-05-16T08:00:00',
    paidBy: { id: 'u4', name: 'Trần Thị Lan', avatarUrl: avatar(4) },
    amountIOwe: 45000,
    status: 'paid',
  },
]

export const findPaidExpense = (id: string): PaidExpense | undefined => mockPaidExpenses.find((e) => e.id === id)

export const findOwedDebt = (id: string): OwedDebt | undefined => mockOwedDebts.find((d) => d.id === id)
