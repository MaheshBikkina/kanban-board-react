import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch'
import { addProject } from '@/store/projectsSlice'
import { generateId } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import type { ProjectColor, ProjectIcon } from '@/types'

const COLORS: ProjectColor[] = ['blue', 'green', 'purple', 'red', 'orange', 'pink', 'teal', 'indigo']
const ICONS: ProjectIcon[] = ['code', 'zap', 'layers', 'briefcase', 'star', 'globe', 'box', 'cpu']

const COLOR_CLASSES: Record<ProjectColor, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
}

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  key: z.string().min(2).max(6).regex(/^[A-Z]+$/, 'Key must be uppercase letters only'),
  description: z.string().max(500).optional(),
  color: z.enum(['blue', 'green', 'purple', 'red', 'orange', 'pink', 'teal', 'indigo'] as const),
  icon: z.enum(['code', 'zap', 'layers', 'briefcase', 'star', 'globe', 'box', 'cpu'] as const),
})

type FormData = z.infer<typeof schema>

export default function ProjectsNewPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { color: 'blue', icon: 'code' },
  })

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  const onSubmit = (data: FormData) => {
    if (!user) return
    const id = `proj-${generateId()}`
    dispatch(
      addProject({
        ...data,
        id,
        workspaceId: 'ws-1',
        ownerId: user.id,
        ownerName: user.name,
        ownerEmail: user.email,
      })
    )
    toast.success(`Project "${data.name}" created!`)
    navigate(`/projects/${id}/board`)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">New project</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div>
          <label className="label">Project name *</label>
          <input
            {...register('name')}
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="e.g. Customer Portal"
            autoFocus
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Project key *</label>
          <input
            {...register('key')}
            className={`input ${errors.key ? 'input-error' : ''}`}
            placeholder="e.g. CP"
            style={{ textTransform: 'uppercase' }}
            onChange={(e) => setValue('key', e.target.value.toUpperCase())}
          />
          <p className="mt-1 text-xs text-gray-400">
            Short identifier for task IDs, 2–6 uppercase letters
          </p>
          {errors.key && <p className="mt-1 text-xs text-red-500">{errors.key.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            {...register('description')}
            className="input resize-none"
            rows={3}
            placeholder="What is this project about?"
          />
        </div>

        {/* Color picker */}
        <div>
          <label className="label">Color</label>
          <div className="flex gap-2 mt-1">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={cn(
                  'w-7 h-7 rounded-full transition-transform',
                  COLOR_CLASSES[color],
                  selectedColor === color && 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                )}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Icon picker */}
        <div>
          <label className="label">Icon</label>
          <div className="flex gap-2 mt-1">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setValue('icon', icon)}
                className={cn(
                  'w-9 h-9 rounded-lg border-2 text-xs font-mono flex items-center justify-center transition-all',
                  selectedIcon === icon
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                )}
                title={icon}
              >
                {icon.slice(0, 2)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">Create project</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}
