import { createFileRoute } from '@tanstack/react-router'
import { __COMPONENT__ } from '@/features/__NAME__'

export const Route = createFileRoute('/_authenticated/__NAME__/')({
  component: __COMPONENT__,
})
