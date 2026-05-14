import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MessageSquare, Paperclip, CheckSquare, Calendar } from 'lucide-react'
import { cn } from '@/utils/cn'
import Avatar from '@/components/ui/Avatar'
import { PriorityBadge, TypeBadge, LabelBadge } from '@/components/ui/Badge'
import { formatShortDate } from '@/utils/formatters'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onClick: () => void
  isDragging?: boolean
}

const priorityDotColor: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-gray-300',
}

export default function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length
  const totalSubtasks = task.subtasks.length
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'task-card p-3 mx-2 mb-2',
        (isDragging || isSortableDragging) && 'opacity-50 rotate-1 shadow-lg'
      )}
      onClick={onClick}
    >
      {/* Priority indicator strip */}
      <div className={cn('absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full', priorityDotColor[task.priority])} />

      <div className="space-y-2.5">
        {/* Top row: type + project key */}
        <div className="flex items-center gap-1.5">
          <TypeBadge type={task.type} />
          <span className="text-[10px] text-gray-400 font-mono ml-auto">
            {task.projectId === 'proj-1' ? 'FRD' :
             task.projectId === 'proj-2' ? 'AGW' : 'MOB'}-{task.id.split('-')[1]}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug line-clamp-2">
          {task.title}
        </p>

        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 3).map((label) => (
              <LabelBadge key={label.id} name={label.name} color={label.color} />
            ))}
            {task.labels.length > 3 && (
              <span className="badge bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                +{task.labels.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bottom row: meta info */}
        <div className="flex items-center gap-2 pt-0.5">
          {/* Story points */}
          {task.storyPoints !== undefined && (
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 w-4 h-4 rounded flex items-center justify-center">
              {task.storyPoints}
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <span className={cn(
              'flex items-center gap-0.5 text-[10px]',
              isOverdue ? 'text-red-500' : 'text-gray-400'
            )}>
              <Calendar className="w-2.5 h-2.5" />
              {formatShortDate(task.dueDate)}
            </span>
          )}

          {/* Comments count */}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <MessageSquare className="w-2.5 h-2.5" />
              {task.comments.length}
            </span>
          )}

          {/* Attachments */}
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <Paperclip className="w-2.5 h-2.5" />
              {task.attachments.length}
            </span>
          )}

          {/* Subtasks */}
          {totalSubtasks > 0 && (
            <span className={cn(
              'flex items-center gap-0.5 text-[10px]',
              completedSubtasks === totalSubtasks ? 'text-green-500' : 'text-gray-400'
            )}>
              <CheckSquare className="w-2.5 h-2.5" />
              {completedSubtasks}/{totalSubtasks}
            </span>
          )}

          {/* Assignee */}
          {task.assigneeName && (
            <div className="ml-auto">
              <Avatar
                name={task.assigneeName}
                src={task.assigneeAvatar}
                size="xs"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
