import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const createGroupZodSchema = z.object({
  name: z.string().min(1, 'Tên nhóm không được để trống'),
  description: z.string().nullable().optional(),
})

export const createGroupSchema = toTypedSchema(createGroupZodSchema)

export type CreateGroupForm = z.infer<typeof createGroupZodSchema>
