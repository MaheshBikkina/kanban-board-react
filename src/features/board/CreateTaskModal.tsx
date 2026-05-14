import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch'
import { addTask } from '@/store/tasksSlice'
import { generateId } from '@/utils/formatters'
import type { TaskStatus, TaskPriority, TaskType } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  type: z.enum(['story', 'bug', 'task', 'epic', 'subtask']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  storyPoints: z.coerce.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface CreateTaskModalProps {
  projectId: string
  defaultStatus: TaskStatus
  sprintId?: string
  onClose: () => void
}

export default function CreateTaskModal({
  projectId,
  defaultStatus,
  sprintId,
  onClose,
}: CreateTaskModalProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const project = useAppSelector((s) =>
    s.projects.projects.find((p) => p.id === projectId)
  )

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'task',
      priority: 'medium',
    },
  })

  const onSubmit = (data: FormData) => {
    if (!user) return
    dispatch(
      addTask({
        id: `task-${generateId()}`,
        reporterId: user.id,
        reporterName: user.name,
        title: data.title,
        description: data.description || '',
        type: data.type as TaskType,
        priority: data.priority as TaskPriority,
        status: defaultStatus,
        projectId,
        sprintId,
        storyPoints: data.storyPoints,
        dueDate: data.dueDate,
        assigneeId: data.assigneeId || undefined,
      })
    )
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
      <div>
        <label className="label">Title *</label>
        <input
          {...register('title')}
          className={`input ${errors.title ? 'input-error' : ''}`}
          placeholder="What needs to be done?"
          autoFocus
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          {...register('description')}
          className="input resize-none"
          rows={3}
          placeholder="Add more context..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Type</label>
          <select {...register('type')} className="input">
            <option value="task">Task</option>
            <option value="story">Story</option>
            <option value="bug">Bug</option>
            <option value="epic">Epic</option>
          </select>
        </div>

        <div>
          <label className="label">Priority</label>
          <select {...register('priority')} className="input">
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Assignee</label>
          <select {...register('assigneeId')} className="input">
            <option value="">Unassigned</option>
            {project?.members.map((m) => (
              <option key={m.userId} value={m.userId}>{m.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Story points</label>
          <input
            {...register('storyPoints')}
            type="number"
            className="input"
            placeholder="0"
            min={0}
            max={100}
          />
        </div>
      </div>

      <div>
        <label className="label">Due date</label>
        <input {...register('dueDate')} type="date" className="input" />
      </div>

      <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" className="btn-primary flex-1">Create task</button>
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </form>
  )
}
