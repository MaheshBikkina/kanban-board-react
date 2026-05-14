import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark' | 'system'

interface UiState {
  theme: Theme
  sidebarCollapsed: boolean
  activeSprintId: string | null
}

const savedTheme = (localStorage.getItem('pf_theme') as Theme) || 'light'

const initialState: UiState = {
  theme: savedTheme,
  sidebarCollapsed: false,
  activeSprintId: 'sprint-2',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      localStorage.setItem('pf_theme', action.payload)

      const root = document.documentElement
      if (action.payload === 'dark') {
        root.classList.add('dark')
      } else if (action.payload === 'light') {
        root.classList.remove('dark')
      } else {
        // system
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', prefersDark)
      }
    },

    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },

    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload
    },

    setActiveSprintId(state, action: PayloadAction<string | null>) {
      state.activeSprintId = action.payload
    },
  },
})

export const { setTheme, toggleSidebar, setSidebarCollapsed, setActiveSprintId } = uiSlice.actions
export default uiSlice.reducer
