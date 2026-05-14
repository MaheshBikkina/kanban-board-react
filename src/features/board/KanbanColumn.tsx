import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils/cn'
import TaskCard from './TaskCard'
import type { Task, TaskStatus } from '@/types'

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
  color: string
}

const COLUMN_COLORS: Record<TaskStatus, { dot: string; header: string }> = {
  backlog: { dot: 'bg-gray-400', header: 'text-gray-500' },
  todo: { dot: 'bg-blue-400', header: 'text-blue-600' },
  in_progress: { dot: 'bg-purple-400', header: 'text-purple-600' },
  review: { dot: 'bg-amber-400', header: 'text-amber-600' },
  testing: { dot: 'bg-cyan-400', header: 'text-cyan-600' },
  done: { dot: 'bg-green-400', header: 'text-green-600' },
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const [showMenu, setShowMenu] = useState(false)

  const colors = COLUMN_COLORS[id]
  const taskIds = tasks.map((t) => t.id)

  return (
    <div className={cn('kanban-column', isOver && 'ring-2 ring-blue-400 ring-inset')}>
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-3">
        <div className={cn('w-2 h-2 rounded-full flex-shrink-0', colors.dot)} />
        <span className={cn('text-xs font-semibold uppercase tracking-wide', colors.header)}>
          {title}
        </span>
        <span className="text-xs font-medium text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full px-1.5 py-0.5 ml-0.5">
          {tasks.length}
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            onClick={() => onAddTask(id)}
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={`Add task to ${title}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-modal border border-gray-200 dark:border-gray-700 z-10 py-1 text-xs"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Sort by priority
                </button>
                <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Sort by due date
                </button>
                <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Collapse column
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto pb-2 min-h-[60px]"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="mx-2 mt-1 mb-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg py-6 text-center">
            <p className="text-xs text-gray-400">Drop tasks here</p>
          </div>
        )}
      </div>

      {/* Add task button at bottom */}
      <button
        onClick={() => onAddTask(id)}
        className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors rounded-b-xl w-full"
      >
        <Plus className="w-3.5 h-3.5" />
        Add task
      </button>
    </div>
  )
}
