import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import { useAppSelector } from '@/hooks/useAppDispatch'

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#94a3b8',
}

const STATUS_COLORS: Record<string, string> = {
  backlog: '#94a3b8',
  todo: '#3b82f6',
  in_progress: '#8b5cf6',
  review: '#f59e0b',
  testing: '#06b6d4',
  done: '#22c55e',
}

// Mock burndown data for current sprint
const BURNDOWN_DATA = [
  { day: 'May 20', ideal: 21, actual: 21 },
  { day: 'May 21', ideal: 19, actual: 20 },
  { day: 'May 22', ideal: 17, actual: 19 },
  { day: 'May 23', ideal: 15, actual: 17 },
  { day: 'May 24', ideal: 13, actual: 15 },
  { day: 'May 27', ideal: 11, actual: 14 },
  { day: 'May 28', ideal: 9, actual: 11 },
  { day: 'May 29', ideal: 7, actual: 9 },
  { day: 'May 30', ideal: 5, actual: null },
  { day: 'May 31', ideal: 0, actual: null },
]

const VELOCITY_DATA = [
  { sprint: 'Sprint 1', committed: 11, completed: 11 },
  { sprint: 'Sprint 2', committed: 20, completed: 5 },
]

export default function AnalyticsPage() {
  const tasks = useAppSelector((s) => s.tasks.tasks)

  // Task distribution by status
  const statusData = Object.entries(
    tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#94a3b8' }))

  // Priority distribution
  const priorityData = Object.entries(
    tasks.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: PRIORITY_COLORS[name] || '#94a3b8',
  }))

  const totalTasks = tasks.length
  const doneTasks = tasks.filter((t) => t.status === 'done').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Sprint performance and project health
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total tasks', value: totalTasks },
          { label: 'Completed', value: doneTasks },
          { label: 'In progress', value: inProgressTasks },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Burndown chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Sprint 2 Burndown
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={BURNDOWN_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="4 4" dot={false} name="Ideal" />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sprint velocity */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Sprint Velocity
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={VELOCITY_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="committed" fill="#e0e7ff" name="Committed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#3b82f6" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Task Distribution by Status
          </h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 flex-1">
              {statusData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                      {entry.name.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority distribution */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Task Distribution by Priority
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" name="Tasks" radius={[0, 4, 4, 0]}>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
