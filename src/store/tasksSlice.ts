import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { MOCK_TASKS } from '@/services/mockData'
import type { Task, TaskStatus, CreateTaskData } from '@/types'

interface TasksState {
  tasks: Task[]
  selectedTaskId: string | null
  filters: {
    search: string
    status: TaskStatus[]
    priority: string[]
    assigneeId: string[]
  }
}

const initialState: TasksState = {
  tasks: MOCK_TASKS,
  selectedTaskId: null,
  filters: {
    search: '',
    status: [],
    priority: [],
    assigneeId: [],
  },
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<CreateTaskData & { id: string; reporterId: string; reporterName: string }>) {
      const { id, reporterId, reporterName, ...data } = action.payload
      const newTask: Task = {
        id,
        reporterId,
        reporterName,
        title: data.title,
        description: data.description || '',
        type: data.type,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        sprintId: data.sprintId,
        assigneeId: data.assigneeId,
        storyPoints: data.storyPoints,
        dueDate: data.dueDate,
        labels: [],
        subtasks: [],
        comments: [],
        attachments: [],
        activity: [
          {
            id: `act-${Date.now()}`,
            type: 'created',
            description: 'Task created',
            userId: reporterId,
            userName: reporterName,
            timestamp: new Date().toISOString(),
          },
        ],
        order: state.tasks.filter((t) => t.status === data.status).length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.tasks.push(newTask)
    },

    updateTask(state, action: PayloadAction<{ id: string } & Partial<Task>>) {
      const { id, ...updates } = action.payload
      const idx = state.tasks.findIndex((t) => t.id === id)
      if (idx !== -1) {
        state.tasks[idx] = {
          ...state.tasks[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },

    moveTask(
      state,
      action: PayloadAction<{ taskId: string; newStatus: TaskStatus; newOrder?: number }>
    ) {
      const { taskId, newStatus, newOrder } = action.payload
      const task = state.tasks.find((t) => t.id === taskId)
      if (!task) return

      const oldStatus = task.status
      task.status = newStatus
      task.updatedAt = new Date().toISOString()

      if (newOrder !== undefined) {
        task.order = newOrder
      }

      // Add activity entry for status change
      if (oldStatus !== newStatus) {
        task.activity.push({
          id: `act-${Date.now()}`,
          type: 'status_change',
          description: `Status changed from ${oldStatus} to ${newStatus}`,
          userId: 'current-user',
          userName: 'Current User',
          timestamp: new Date().toISOString(),
          meta: { from: oldStatus, to: newStatus },
        })
      }
    },

    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },

    addComment(
      state,
      action: PayloadAction<{ taskId: string; comment: Task['comments'][0] }>
    ) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId)
      if (task) {
        task.comments.push(action.payload.comment)
        task.updatedAt = new Date().toISOString()
      }
    },

    toggleSubtask(state, action: PayloadAction<{ taskId: string; subtaskId: string }>) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId)
      if (task) {
        const sub = task.subtasks.find((s) => s.id === action.payload.subtaskId)
        if (sub) sub.isCompleted = !sub.isCompleted
      }
    },

    setSelectedTask(state, action: PayloadAction<string | null>) {
      state.selectedTaskId = action.payload
    },

    setFilters(state, action: PayloadAction<Partial<TasksState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload }
    },

    clearFilters(state) {
      state.filters = { search: '', status: [], priority: [], assigneeId: [] }
    },

    reorderTasks(
      state,
      action: PayloadAction<{ status: TaskStatus; orderedIds: string[] }>
    ) {
      const { status, orderedIds } = action.payload
      orderedIds.forEach((id, idx) => {
        const task = state.tasks.find((t) => t.id === id)
        if (task && task.status === status) {
          task.order = idx + 1
        }
      })
    },
  },
})

export const {
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  addComment,
  toggleSubtask,
  setSelectedTask,
  setFilters,
  clearFilters,
  reorderTasks,
} = tasksSlice.actions

export default tasksSlice.reducer
