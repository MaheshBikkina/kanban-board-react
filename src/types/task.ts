export type TaskStatus =
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'testing'
  | 'done'

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export type TaskType = 'story' | 'bug' | 'task' | 'epic' | 'subtask'

export interface TaskLabel {
  id: string
  name: string
  color: string
}

export interface TaskComment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  createdAt: string
  updatedAt?: string
  isEdited: boolean
}

export interface TaskAttachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
}

export interface SubTask {
  id: string
  title: string
  isCompleted: boolean
  assigneeId?: string
}

export interface TaskActivity {
  id: string
  type: 'status_change' | 'assignment' | 'comment' | 'created' | 'priority_change' | 'due_date_change'
  description: string
  userId: string
  userName: string
  timestamp: string
  meta?: Record<string, string>
}

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  sprintId?: string
  parentTaskId?: string
  assigneeId?: string
  assigneeName?: string
  assigneeAvatar?: string
  reporterId: string
  reporterName: string
  labels: TaskLabel[]
  subtasks: SubTask[]
  comments: TaskComment[]
  attachments: TaskAttachment[]
  activity: TaskActivity[]
  storyPoints?: number
  dueDate?: string
  startDate?: string
  estimatedHours?: number
  loggedHours?: number
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateTaskData {
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  sprintId?: string
  assigneeId?: string
  labelIds?: string[]
  storyPoints?: number
  dueDate?: string
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string
}

export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigneeId?: string[]
  labelIds?: string[]
  sprintId?: string
  search?: string
}
