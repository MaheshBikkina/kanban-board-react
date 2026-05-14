import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sun, Moon, Monitor, Bell, User, Shield, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { updateUser } from '@/store/authSlice'
import { setTheme } from '@/store/uiSlice'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'

type TabId = 'profile' | 'appearance' | 'notifications' | 'security'

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

interface ProfileFormData {
  name: string
  email: string
}

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const theme = useAppSelector((s) => s.ui.theme)
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  const { register, handleSubmit, formState: { isDirty } } = useForm<ProfileFormData>({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  const saveProfile = (data: ProfileFormData) => {
    dispatch(updateUser({ name: data.name, email: data.email }))
    toast.success('Profile updated')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your account preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Tab nav */}
        <nav className="w-44 flex-shrink-0 space-y-0.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors',
                activeTab === id
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                {user && <Avatar name={user.name} src={user.avatar} size="lg" />}
                <div>
                  <button className="btn-secondary btn-sm">Change photo</button>
                  <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(saveProfile)} className="space-y-4">
                <div>
                  <label className="label">Full name</label>
                  <input {...register('name')} className="input" />
                </div>
                <div>
                  <label className="label">Email address</label>
                  <input {...register('email')} type="email" className="input" />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={!isDirty} className="btn-primary">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Appearance</h2>

              <div>
                <label className="label">Theme</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => {
                        dispatch(setTheme(value as 'light' | 'dark' | 'system'))
                        toast.success(`Switched to ${label.toLowerCase()} mode`)
                      }}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                        theme === value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      )}
                    >
                      <Icon className={cn('w-5 h-5', theme === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500')} />
                      <span className={cn('text-sm font-medium', theme === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300')}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notifications</h2>

              <div className="space-y-4">
                {[
                  { label: 'Task assigned to me', desc: 'When someone assigns a task to you' },
                  { label: 'Comments on my tasks', desc: 'When someone comments on tasks you own or are assigned to' },
                  { label: 'Mentions', desc: 'When someone @mentions you in a comment' },
                  { label: 'Sprint updates', desc: 'When a sprint starts or completes' },
                  { label: 'Status changes', desc: 'When tasks assigned to you change status' },
                ].map(({ label, desc }) => (
                  <label key={label} className="flex items-start justify-between gap-4 cursor-pointer group">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-blue-500 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Security</h2>

              <div className="space-y-4">
                <div>
                  <label className="label">Current password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New password</label>
                  <input type="password" className="input" placeholder="Min. 8 characters" />
                </div>
                <div>
                  <label className="label">Confirm new password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <button className="btn-primary" onClick={() => toast.success('Password updated')}>
                  Update password
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Danger zone
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Permanently delete your account and all associated data.
                </p>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => toast.error('Account deletion is disabled in demo')}
                >
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
