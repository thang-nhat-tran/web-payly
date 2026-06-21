import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

/** A single split row (app-side, camelCase). */
export const expenseSplitSchema = z.object({
  userId: z.string().uuid(),
  shareAmount: z.number().nonnegative(),
})

const expenseCreateZodSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  paidBy: z.string().uuid('Chọn người trả'),
  splits: z.array(expenseSplitSchema).min(1, 'Chọn ít nhất một người'),
})

export const expenseCreateSchema = toTypedSchema(expenseCreateZodSchema)

export type ExpenseSplit = z.infer<typeof expenseSplitSchema>
export type ExpenseCreateForm = z.infer<typeof expenseCreateZodSchema>
