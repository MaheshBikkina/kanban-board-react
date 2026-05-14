export type SprintStatus = 'planning' | 'active' | 'completed'

export interface Sprint {
  id: string
  name: string
  goal?: string
  projectId: string
  status: SprintStatus
  startDate?: string
  endDate?: string
  taskIds: string[]
  completedTaskIds: string[]
  createdAt: string
  completedAt?: string
}

export interface CreateSprintData {
  name: string
  goal?: string
  projectId: string
  startDate?: string
  endDate?: string
}
