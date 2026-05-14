import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Kanban,
  BarChart2,
  Settings,
  Users,
  Layers,
  ChevronRight,
  Plus,
  FolderOpen,
  Zap,
  Code,
  Box,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import Avatar from '@/components/ui/Avatar'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { setActiveProject } from '@/store/projectsSlice'
import type { Project } from '@/types'

const PROJECT_ICON_MAP: Record<string, React.ElementType> = {
  code: Code,
  zap: Zap,
  layers: Layers,
  box: Box,
  briefcase: FolderOpen,
  star: Layers,
  globe: Layers,
  cpu: Zap,
}

const PROJECT_COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
}

function ProjectNavItem({ project }: { project: Project }) {
  const dispatch = useAppDispatch()
  const IconComp = PROJECT_ICON_MAP[project.icon] || FolderOpen
  const colorClass = PROJECT_COLOR_MAP[project.color] || 'bg-blue-500'

  return (
    <NavLink
      to={`/projects/${project.id}/board`}
      onClick={() => dispatch(setActiveProject(project.id))}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors group',
          isActive
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        )
      }
    >
      <div className={cn('w-5 h-5 rounded flex items-center justify-center flex-shrink-0', colorClass)}>
        <IconComp className="w-3 h-3 text-white" />
      </div>
      <span className="truncate">{project.name}</span>
      <span className="ml-auto text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        {project.key}
      </span>
    </NavLink>
  )
}

export default function Sidebar() {
  const user = useAppSelector((s) => s.auth.user)
  const projects = useAppSelector((s) => s.projects.projects.filter((p) => !p.isArchived))
  const navigate = useNavigate()

  return (
    <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full flex-shrink-0">
      {/* Workspace header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <button className="flex items-center gap-2.5 w-full hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 py-1.5 -mx-2 transition-colors">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AC</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Acme Corp</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pro plan</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <NavLink to="/dashboard" className={({ isActive }) => cn('nav-link', isActive && 'active')}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>

        <NavLink to="/workspace" className={({ isActive }) => cn('nav-link', isActive && 'active')}>
          <Users className="w-4 h-4" />
          Workspace
        </NavLink>

        {/* Projects section */}
        <div className="pt-4 pb-1">
          <div className="flex items-center justify-between px-3 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Projects
            </span>
            <button
              onClick={() => navigate('/projects/new')}
              className="p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="New project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {projects.map((project) => (
              <ProjectNavItem key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Views section */}
        <div className="pt-3 pb-1">
          <div className="px-3 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Views
            </span>
          </div>
          <NavLink to="/board" className={({ isActive }) => cn('nav-link', isActive && 'active')}>
            <Kanban className="w-4 h-4" />
            My Board
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => cn('nav-link', isActive && 'active')}>
            <BarChart2 className="w-4 h-4" />
            Analytics
          </NavLink>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
        <NavLink to="/settings" className={({ isActive }) => cn('nav-link', isActive && 'active')}>
          <Settings className="w-4 h-4" />
          Settings
        </NavLink>

        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
