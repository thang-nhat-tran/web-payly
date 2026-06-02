import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const groupCreateZodSchema = z.object({
  name: z.string().min(1, 'Tên nhóm không được để trống'),
  description: z.string().nullable().optional(),
})

export const groupCreateSchema = toTypedSchema(groupCreateZodSchema)

export type GroupCreateForm = z.infer<typeof groupCreateZodSchema>
