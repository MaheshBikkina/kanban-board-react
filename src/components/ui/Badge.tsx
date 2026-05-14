import { cn } from '@/utils/cn'
import type { TaskPriority, TaskStatus, TaskType } from '@/types'

// Priority badge
const priorityConfig: Record<TaskPriority, { label: string; classes: string }> = {
  critical: { label: 'Critical', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  high: { label: 'High', classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  medium: { label: 'Medium', classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  low: { label: 'Low', classes: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
}

// Status badge
const statusConfig: Record<TaskStatus, { label: string; classes: string }> = {
  backlog: { label: 'Backlog', classes: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
  todo: { label: 'Todo', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress: { label: 'In Progress', classes: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  review: { label: 'Review', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  testing: { label: 'Testing', classes: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  done: { label: 'Done', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
}

// Task type badge
const typeConfig: Record<TaskType, { label: string; classes: string }> = {
  story: { label: 'Story', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  bug: { label: 'Bug', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  task: { label: 'Task', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  epic: { label: 'Epic', classes: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  subtask: { label: 'Subtask', classes: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
}

interface PriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  return (
    <span className={cn('badge', config.classes, className)}>
      {config.label}
    </span>
  )
}

interface StatusBadgeProps {
  status: TaskStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={cn('badge', config.classes, className)}>
      {config.label}
    </span>
  )
}

interface TypeBadgeProps {
  type: TaskType
  className?: string
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const config = typeConfig[type]
  return (
    <span className={cn('badge', config.classes, className)}>
      {config.label}
    </span>
  )
}

interface LabelBadgeProps {
  name: string
  color: string
  className?: string
}

export function LabelBadge({ name, color, className }: LabelBadgeProps) {
  return (
    <span
      className={cn('badge', className)}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {name}
    </span>
  )
}
