import { Crown, Shield, User, Mail } from 'lucide-react'
import { MOCK_WORKSPACE } from '@/services/mockData'
import Avatar from '@/components/ui/Avatar'
import { useAppSelector } from '@/hooks/useAppDispatch'
import { timeAgo } from '@/utils/formatters'

const ROLE_CONFIG = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20' },
  admin: { label: 'Admin', icon: Shield, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' },
  member: { label: 'Member', icon: User, color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700' },
}

export default function WorkspacePage() {
  const currentUser = useAppSelector((s) => s.auth.user)
  const workspace = MOCK_WORKSPACE

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Workspace</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your team and workspace settings
        </p>
      </div>

      {/* Workspace info */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">AC</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{workspace.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{workspace.slug}.projectflow.io</p>
            <span className="inline-flex items-center mt-1 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full capitalize">
              {workspace.plan} plan
            </span>
          </div>
          <div className="ml-auto flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{workspace.projectCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{workspace.memberCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Members ({workspace.members.length})
          </h2>
          <button className="btn-primary btn-sm">
            <Mail className="w-3.5 h-3.5" />
            Invite members
          </button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {workspace.members.map((member) => {
            const roleConf = ROLE_CONFIG[member.role]
            const RoleIcon = roleConf.icon
            const isCurrentUser = member.userId === currentUser?.id

            return (
              <div key={member.userId} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <Avatar name={member.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    {isCurrentUser && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${roleConf.color}`}>
                    <RoleIcon className="w-3 h-3" />
                    {roleConf.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    Joined {timeAgo(member.joinedAt)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
