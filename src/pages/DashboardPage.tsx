import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Zap,
  Code,
  Layers,
  FolderOpen,
} from 'lucide-react'
import { useAppSelector } from '@/hooks/useAppDispatch'
import Avatar from '@/components/ui/Avatar'
import { PriorityBadge } from '@/components/ui/Badge'
import { timeAgo, formatDate } from '@/utils/formatters'
import type { Project } from '@/types'

const PROJECT_COLOR_STYLES: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
  orange: 'from-orange-500 to-orange-600',
  pink: 'from-pink-500 to-pink-600',
  teal: 'from-teal-500 to-teal-600',
  indigo: 'from-indigo-500 to-indigo-600',
}

const PROJECT_ICON_MAP: Record<string, React.ElementType> = {
  code: Code,
  zap: Zap,
  layers: Layers,
  box: FolderOpen,
  briefcase: FolderOpen,
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const Icon = PROJECT_ICON_MAP[project.icon] || FolderOpen
  const gradientClass = PROJECT_COLOR_STYLES[project.color] || 'from-blue-500 to-blue-600'
  const progress = project.taskCount > 0
    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
    : 0

  return (
    <div
      className="card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-200 group"
      onClick={() => navigate(`/projects/${project.id}/board`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
          {project.key}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.name}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
        {project.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{project.completedTaskCount} / {project.taskCount} tasks</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradientClass} rounded-full transition-all`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex -space-x-1.5">
          {project.members.slice(0, 4).map((m) => (
            <Avatar key={m.userId} name={m.name} size="xs" className="ring-2 ring-white dark:ring-gray-800" />
          ))}
          {project.members.length > 4 && (
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-[9px] text-gray-600 dark:text-gray-300 font-medium">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-400">{project.sprintCount} sprints</span>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  change,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  change?: string
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {change && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {change}
        </p>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const projects = useAppSelector((s) => s.projects.projects.filter((p) => !p.isArchived))
  const tasks = useAppSelector((s) => s.tasks.tasks)
  const notifications = useAppSelector((s) => s.notifications.notifications)

  const myTasks = tasks.filter((t) => t.assigneeId === user?.id && t.status !== 'done')
  const completedThisWeek = tasks.filter((t) => t.status === 'done').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
  )

  const recentActivity = notifications.slice(0, 5)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {formatDate(new Date().toISOString())} · {inProgress} tasks in progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="My open tasks"
          value={myTasks.length}
          icon={Clock}
          color="bg-blue-500"
        />
        <StatCard
          label="Completed"
          value={completedThisWeek}
          icon={CheckCircle2}
          color="bg-green-500"
          change="+3 this week"
        />
        <StatCard
          label="In progress"
          value={inProgress}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          label="Overdue"
          value={overdueTasks.length}
          icon={AlertCircle}
          color={overdueTasks.length > 0 ? 'bg-red-500' : 'bg-gray-400'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Projects</h2>
            <button
              onClick={() => navigate('/projects/new')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              New project <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* My tasks */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              My tasks
            </h2>
            {myTasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">All caught up!</p>
            ) : (
              <div className="space-y-2">
                {myTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/projects/${task.projectId}/board`)}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <PriorityBadge priority={task.priority} className="text-[10px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <p className={`text-[11px] mt-0.5 ${
                          new Date(task.dueDate) < new Date()
                            ? 'text-red-500'
                            : 'text-gray-400'
                        }`}>
                          Due {formatDate(task.dueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {myTasks.length > 5 && (
                  <p className="text-xs text-gray-400 text-center pt-1">
                    +{myTasks.length - 5} more
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Recent activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm flex-shrink-0">
                    {item.type === 'task_assigned' ? '📋' :
                     item.type === 'task_commented' ? '💬' :
                     item.type === 'sprint_started' ? '🚀' : '👋'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                      {item.message}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(item.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
