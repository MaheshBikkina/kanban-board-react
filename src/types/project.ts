export type ProjectColor =
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'orange'
  | 'pink'
  | 'teal'
  | 'indigo'

export type ProjectIcon =
  | 'briefcase'
  | 'code'
  | 'layers'
  | 'zap'
  | 'star'
  | 'globe'
  | 'box'
  | 'cpu'

export interface ProjectMember {
  userId: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joinedAt: string
}

export interface Project {
  id: string
  name: string
  key: string // e.g. "PF" for ProjectFlow
  description?: string
  color: ProjectColor
  icon: ProjectIcon
  workspaceId: string
  ownerId: string
  members: ProjectMember[]
  sprintCount: number
  taskCount: number
  completedTaskCount: number
  createdAt: string
  updatedAt: string
  isArchived: boolean
}

export interface CreateProjectData {
  name: string
  key: string
  description?: string
  color: ProjectColor
  icon: ProjectIcon
}
