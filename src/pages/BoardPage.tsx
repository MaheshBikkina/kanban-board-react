import { useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Filter, SlidersHorizontal, Zap, ChevronDown } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { moveTask, reorderTasks, setSelectedTask } from '@/store/tasksSlice'
import KanbanColumn from '@/features/board/KanbanColumn'
import TaskCard from '@/features/board/TaskCard'
import TaskModal from '@/features/board/TaskModal'
import CreateTaskModal from '@/features/board/CreateTaskModal'
import Modal from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import type { Task, TaskStatus } from '@/types'

const BOARD_COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'gray' },
  { id: 'todo', title: 'Todo', color: 'blue' },
  { id: 'in_progress', title: 'In Progress', color: 'purple' },
  { id: 'review', title: 'Review', color: 'amber' },
  { id: 'testing', title: 'Testing', color: 'cyan' },
  { id: 'done', title: 'Done', color: 'green' },
]

export default function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const dispatch = useAppDispatch()
  const project = useAppSelector((s) =>
    s.projects.projects.find((p) => p.id === projectId)
  )
  const allTasks = useAppSelector((s) => s.tasks.tasks)
  const filters = useAppSelector((s) => s.tasks.filters)
  const activeSprint = useAppSelector((s) => s.sprints.sprints.find((sp) => sp.status === 'active' && sp.projectId === projectId))

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTaskLocal] = useState<Task | null>(null)
  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sprintFilter, setSprintFilter] = useState<'active' | 'backlog' | 'all'>('active')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // Filter tasks for this project
  const projectTasks = useMemo(() => {
    let tasks = allTasks.filter((t) => t.projectId === projectId)

    if (sprintFilter === 'active' && activeSprint) {
      tasks = tasks.filter((t) => t.sprintId === activeSprint.id || t.status === 'backlog')
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(q))
    }

    if (filters.priority.length > 0) {
      tasks = tasks.filter((t) => filters.priority.includes(t.priority))
    }

    if (filters.assigneeId.length > 0) {
      tasks = tasks.filter((t) => t.assigneeId && filters.assigneeId.includes(t.assigneeId))
    }

    return tasks
  }, [allTasks, projectId, filters, sprintFilter, activeSprint])

  const getColumnTasks = useCallback(
    (status: TaskStatus) =>
      projectTasks
        .filter((t) => t.status === status)
        .sort((a, b) => a.order - b.order),
    [projectTasks]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = allTasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeTask = allTasks.find((t) => t.id === active.id)
    if (!activeTask) return

    // Check if dropped over a column (droppable) or task (sortable)
    const overIsColumn = BOARD_COLUMNS.some((col) => col.id === over.id)
    const overTask = allTasks.find((t) => t.id === over.id)

    const newStatus = overIsColumn
      ? (over.id as TaskStatus)
      : overTask?.status

    if (newStatus && newStatus !== activeTask.status) {
      dispatch(moveTask({ taskId: activeTask.id, newStatus }))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || active.id === over.id) return

    const activeTaskData = allTasks.find((t) => t.id === active.id)
    const overTaskData = allTasks.find((t) => t.id === over.id)

    if (!activeTaskData || !overTaskData) return
    if (activeTaskData.status !== overTaskData.status) return

    // Reorder within same column
    const columnTasks = getColumnTasks(activeTaskData.status)
    const oldIdx = columnTasks.findIndex((t) => t.id === active.id)
    const newIdx = columnTasks.findIndex((t) => t.id === over.id)

    if (oldIdx !== newIdx) {
      const reordered = arrayMove(columnTasks, oldIdx, newIdx)
      dispatch(
        reorderTasks({
          status: activeTaskData.status,
          orderedIds: reordered.map((t) => t.id),
        })
      )
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTaskLocal(task)
    dispatch(setSelectedTask(task.id))
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Project not found
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Board toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{project.name}</h2>
          {activeSprint && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {activeSprint.name} · {activeSprint.goal}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Sprint filter */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {(['active', 'all', 'backlog'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSprintFilter(f)}
                className={`px-3 py-1 text-xs rounded-md font-medium capitalize transition-colors ${
                  sprintFilter === f
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {f === 'active' ? 'Sprint' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Member avatars filter */}
          <div className="flex items-center -space-x-1">
            {project.members.slice(0, 5).map((member) => (
              <button
                key={member.userId}
                title={member.name}
                className="ring-2 ring-white dark:ring-gray-900 rounded-full hover:ring-blue-400 transition-all"
              >
                <Avatar name={member.name} size="xs" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>

          {activeSprint && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              <Zap className="w-3.5 h-3.5" />
              Complete Sprint
            </button>
          )}
        </div>
      </div>

      {/* Board columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 p-4 h-full min-w-max">
            {BOARD_COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                color={col.color}
                tasks={getColumnTasks(col.id)}
                onTaskClick={handleTaskClick}
                onAddTask={(status) => setCreateStatus(status)}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
            {activeTask && (
              <div className="rotate-2 scale-105">
                <TaskCard task={activeTask} onClick={() => {}} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task detail modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => { setSelectedTaskLocal(null); dispatch(setSelectedTask(null)) }}
        size="xl"
      >
        {selectedTask && (
          <TaskModal
            task={allTasks.find((t) => t.id === selectedTask.id) || selectedTask}
            onClose={() => { setSelectedTaskLocal(null); dispatch(setSelectedTask(null)) }}
          />
        )}
      </Modal>

      {/* Create task modal */}
      <Modal
        isOpen={!!createStatus}
        onClose={() => setCreateStatus(null)}
        title="Create task"
        size="md"
      >
        {createStatus && (
          <CreateTaskModal
            projectId={project.id}
            defaultStatus={createStatus}
            sprintId={activeSprint?.id}
            onClose={() => setCreateStatus(null)}
          />
        )}
      </Modal>
    </div>
  )
}
