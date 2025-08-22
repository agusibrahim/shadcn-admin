import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { __COMPONENT__ } from '@/features/__NAME__'
import { roles } from '@/features/__NAME__/data/data'

const __NAME__SearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),
  role: z
    .array(z.enum(roles.map((r) => r.value)))
    .optional()
    .catch([]),
  username: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/__NAME__/')({
  validateSearch: __NAME__SearchSchema,
  component: __COMPONENT__,
})
