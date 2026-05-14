import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { MOCK_NOTIFICATIONS } from '@/services/mockData'
import type { Notification } from '@/types'

interface NotificationsState {
  notifications: Notification[]
}

const initialState: NotificationsState = {
  notifications: MOCK_NOTIFICATIONS,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find((n) => n.id === action.payload)
      if (notif) notif.isRead = true
    },

    markAllAsRead(state) {
      state.notifications.forEach((n) => {
        n.isRead = true
      })
    },

    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload)
    },

    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
  },
})

export const { markAsRead, markAllAsRead, addNotification, removeNotification } =
  notificationsSlice.actions
export default notificationsSlice.reducer
