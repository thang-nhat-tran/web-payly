import type { MenuItem } from '@/shared/components/ui/menu/menu.type'
import { BanknoteArrowDownIcon, HandCoinsIcon, UserIcon, WalletIcon } from 'lucide-vue-next'

export const menuItems = [
  { key: 'expense', icon: BanknoteArrowDownIcon, label: 'Khoản chi' },
  { key: 'debt', icon: HandCoinsIcon, label: 'Khoản nợ' },
  { key: 'payment', icon: WalletIcon, label: 'Thanh toán' },
  { key: 'member', icon: UserIcon, label: 'Thành viên' },
] as const satisfies MenuItem[]

export type GroupMenuKeys = (typeof menuItems)[number]['key']
