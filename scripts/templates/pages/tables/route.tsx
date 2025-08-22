import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { __COMPONENT__ } from '@/features/__NAME__'
import { priorities, statuses } from '@/features/__NAME__/data/data'

const __NAME__SearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.enum(statuses.map((s) => s.value)))
    .optional()
    .catch([]),
  priority: z
    .array(z.enum(priorities.map((p) => p.value)))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/__NAME__/')({
  validateSearch: __NAME__SearchSchema,
  component: __COMPONENT__,
})
