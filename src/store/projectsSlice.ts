import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { MOCK_PROJECTS } from '@/services/mockData'
import type { Project, CreateProjectData } from '@/types'

interface ProjectsState {
  projects: Project[]
  activeProjectId: string | null
}

const initialState: ProjectsState = {
  projects: MOCK_PROJECTS,
  activeProjectId: null,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setActiveProject(state, action: PayloadAction<string | null>) {
      state.activeProjectId = action.payload
    },

    addProject(state, action: PayloadAction<CreateProjectData & { id: string; workspaceId: string; ownerId: string; ownerName: string; ownerEmail: string }>) {
      const { id, workspaceId, ownerId, ownerName, ownerEmail, ...data } = action.payload
      const newProject: Project = {
        id,
        workspaceId,
        ownerId,
        members: [
          {
            userId: ownerId,
            name: ownerName,
            email: ownerEmail,
            role: 'owner',
            joinedAt: new Date().toISOString(),
          },
        ],
        sprintCount: 0,
        taskCount: 0,
        completedTaskCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
        ...data,
      }
      state.projects.push(newProject)
    },

    updateProject(state, action: PayloadAction<{ id: string } & Partial<Project>>) {
      const { id, ...updates } = action.payload
      const idx = state.projects.findIndex((p) => p.id === id)
      if (idx !== -1) {
        state.projects[idx] = {
          ...state.projects[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },

    deleteProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((p) => p.id !== action.payload)
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = null
      }
    },

    archiveProject(state, action: PayloadAction<string>) {
      const project = state.projects.find((p) => p.id === action.payload)
      if (project) project.isArchived = true
    },
  },
})

export const { setActiveProject, addProject, updateProject, deleteProject, archiveProject } =
  projectsSlice.actions
export default projectsSlice.reducer
