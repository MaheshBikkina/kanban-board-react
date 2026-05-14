export type NotificationType =
  | 'task_assigned'
  | 'task_commented'
  | 'task_status_changed'
  | 'sprint_started'
  | 'sprint_completed'
  | 'member_joined'
  | 'mention'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  userId: string
  link?: string
  meta?: Record<string, string>
  createdAt: string
}
