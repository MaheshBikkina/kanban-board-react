import { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { markAsRead, markAllAsRead } from '@/store/notificationsSlice'
import { timeAgo } from '@/utils/formatters'
import { cn } from '@/utils/cn'

const typeIcons: Record<string, string> = {
  task_assigned: '📋',
  task_commented: '💬',
  task_status_changed: '🔄',
  sprint_started: '🚀',
  sprint_completed: '✅',
  member_joined: '👋',
  mention: '@',
}

export default function NotificationDropdown() {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector((s) => s.notifications.notifications)
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-modal border border-gray-200 dark:border-gray-700 z-50 animate-scale-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    'flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors',
                    !notif.isRead && 'bg-blue-50/50 dark:bg-blue-900/10'
                  )}
                  onClick={() => dispatch(markAsRead(notif.id))}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {typeIcons[notif.type] || '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm text-gray-800 dark:text-gray-200',
                      !notif.isRead && 'font-medium'
                    )}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.createdAt)}</p>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch(markAsRead(notif.id))
                      }}
                      className="flex-shrink-0 mt-1 text-blue-500 hover:text-blue-700"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-xs text-center text-blue-600 dark:text-blue-400 hover:underline py-1">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
