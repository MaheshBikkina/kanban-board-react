import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { MOCK_SPRINTS } from '@/services/mockData'
import type { Sprint, CreateSprintData } from '@/types'

interface SprintsState {
  sprints: Sprint[]
}

const initialState: SprintsState = {
  sprints: MOCK_SPRINTS,
}

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    addSprint(state, action: PayloadAction<CreateSprintData & { id: string }>) {
      const { id, ...data } = action.payload
      state.sprints.push({
        id,
        status: 'planning',
        taskIds: [],
        completedTaskIds: [],
        createdAt: new Date().toISOString(),
        ...data,
      })
    },

    updateSprint(state, action: PayloadAction<{ id: string } & Partial<Sprint>>) {
      const { id, ...updates } = action.payload
      const idx = state.sprints.findIndex((s) => s.id === id)
      if (idx !== -1) {
        state.sprints[idx] = { ...state.sprints[idx], ...updates }
      }
    },

    startSprint(state, action: PayloadAction<{ id: string; startDate: string; endDate: string }>) {
      const sprint = state.sprints.find((s) => s.id === action.payload.id)
      if (sprint) {
        sprint.status = 'active'
        sprint.startDate = action.payload.startDate
        sprint.endDate = action.payload.endDate
      }
    },

    completeSprint(state, action: PayloadAction<string>) {
      const sprint = state.sprints.find((s) => s.id === action.payload)
      if (sprint) {
        sprint.status = 'completed'
        sprint.completedAt = new Date().toISOString()
        sprint.completedTaskIds = [...sprint.taskIds]
      }
    },

    addTaskToSprint(state, action: PayloadAction<{ sprintId: string; taskId: string }>) {
      const sprint = state.sprints.find((s) => s.id === action.payload.sprintId)
      if (sprint && !sprint.taskIds.includes(action.payload.taskId)) {
        sprint.taskIds.push(action.payload.taskId)
      }
    },

    removeTaskFromSprint(state, action: PayloadAction<{ sprintId: string; taskId: string }>) {
      const sprint = state.sprints.find((s) => s.id === action.payload.sprintId)
      if (sprint) {
        sprint.taskIds = sprint.taskIds.filter((id) => id !== action.payload.taskId)
      }
    },
  },
})

export const {
  addSprint,
  updateSprint,
  startSprint,
  completeSprint,
  addTaskToSprint,
  removeTaskFromSprint,
} = sprintsSlice.actions
export default sprintsSlice.reducer
