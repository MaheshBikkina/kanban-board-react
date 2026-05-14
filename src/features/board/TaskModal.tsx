import { useState } from 'react'
import {
  X, Calendar, User, Tag, Flag, MessageSquare,
  CheckSquare, Plus, Trash2, Edit2, Link, Paperclip,
  Clock, ChevronDown,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch'
import { updateTask, addComment, toggleSubtask, deleteTask } from '@/store/tasksSlice'
import { PriorityBadge, StatusBadge, TypeBadge, LabelBadge } from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { timeAgo, formatDateTime, generateId } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import type { Task, TaskStatus, TaskPriority } from '@/types'

interface TaskModalProps {
  task: Task
  onClose: () => void
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'testing', label: 'Testing' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

interface CommentFormData {
  content: string
}

export default function TaskModal({ task, onClose }: TaskModalProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { register, handleSubmit, reset, watch } = useForm<CommentFormData>()
  const commentContent = watch('content', '')

  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(task.title)
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [descValue, setDescValue] = useState(task.description || '')

  const handleStatusChange = (status: TaskStatus) => {
    dispatch(updateTask({ id: task.id, status }))
  }

  const handlePriorityChange = (priority: TaskPriority) => {
    dispatch(updateTask({ id: task.id, priority }))
  }

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue !== task.title) {
      dispatch(updateTask({ id: task.id, title: titleValue.trim() }))
    }
    setIsEditingTitle(false)
  }

  const handleDescSave = () => {
    dispatch(updateTask({ id: task.id, description: descValue }))
    setIsEditingDesc(false)
  }

  const submitComment = (data: CommentFormData) => {
    if (!user || !data.content.trim()) return
    dispatch(
      addComment({
        taskId: task.id,
        comment: {
          id: `comment-${generateId()}`,
          content: data.content.trim(),
          authorId: user.id,
          authorName: user.name,
          authorAvatar: user.avatar,
          createdAt: new Date().toISOString(),
          isEdited: false,
        },
      })
    )
    reset()
  }

  const handleDelete = () => {
    if (confirm('Delete this task? This cannot be undone.')) {
      dispatch(deleteTask(task.id))
      onClose()
    }
  }

  // Close on backdrop click handled by parent Modal, this is for click on inner X
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <TypeBadge type={task.type} />
            <span className="text-xs font-mono text-gray-400">
              {task.projectId === 'proj-1' ? 'FRD' :
               task.projectId === 'proj-2' ? 'AGW' : 'MOB'}-{task.id.split('-')[1]}
            </span>
          </div>

          {isEditingTitle ? (
            <input
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') setIsEditingTitle(false) }}
              className="w-full text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 outline-none"
            />
          ) : (
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-white cursor-text hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setIsEditingTitle(true)}
              title="Click to edit"
            >
              {task.title}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleDelete}
            className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 -mx-6 px-6">
            {(['details', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-2.5 text-sm font-medium capitalize border-b-2 transition-colors',
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                {tab}
                {tab === 'activity' && task.activity.length > 0 && (
                  <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 rounded-full">
                    {task.activity.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <>
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Description
                </h3>
                {isEditingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      autoFocus
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      rows={4}
                      className="input resize-none"
                      placeholder="Add a description..."
                    />
                    <div className="flex gap-2">
                      <button onClick={handleDescSave} className="btn-primary btn-sm">Save</button>
                      <button onClick={() => setIsEditingDesc(false)} className="btn-secondary btn-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'text-sm text-gray-700 dark:text-gray-300 rounded-lg p-2 -mx-2 cursor-text hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
                      !task.description && 'text-gray-400 italic'
                    )}
                    onClick={() => setIsEditingDesc(true)}
                  >
                    {task.description || 'Add a description...'}
                  </div>
                )}
              </div>

              {/* Subtasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Subtasks ({task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length})
                  </h3>
                </div>
                {task.subtasks.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${task.subtasks.length > 0 ? (task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100 : 0}%` }}
                      />
                    </div>
                    {task.subtasks.map((sub) => (
                      <label
                        key={sub.id}
                        className="flex items-center gap-2.5 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={sub.isCompleted}
                          onChange={() => dispatch(toggleSubtask({ taskId: task.id, subtaskId: sub.id }))}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={cn(
                          'text-sm text-gray-700 dark:text-gray-300',
                          sub.isCompleted && 'line-through text-gray-400 dark:text-gray-500'
                        )}>
                          {sub.title}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Comments ({task.comments.length})
                </h3>

                <div className="space-y-4 mb-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar name={comment.authorName} src={comment.authorAvatar} size="sm" className="flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-xl rounded-tl-sm px-3 py-2">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add comment */}
                <form onSubmit={handleSubmit(submitComment)} className="flex gap-3">
                  {user && <Avatar name={user.name} src={user.avatar} size="sm" className="flex-shrink-0 mt-1" />}
                  <div className="flex-1">
                    <textarea
                      {...register('content')}
                      placeholder="Add a comment..."
                      rows={2}
                      className="input resize-none text-sm"
                    />
                    {commentContent.trim() && (
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="btn-primary btn-sm">Comment</button>
                        <button type="button" onClick={() => reset()} className="btn-secondary btn-sm">Cancel</button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {task.activity.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No activity yet</p>
              ) : (
                task.activity.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{entry.userName}</span>{' '}
                        {entry.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(entry.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar metadata */}
        <div className="w-52 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4 overflow-y-auto">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Flag className="w-3 h-3" /> Status
            </p>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="input text-xs py-1.5"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Flag className="w-3 h-3" /> Priority
            </p>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
              className="input text-xs py-1.5"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3" /> Assignee
            </p>
            {task.assigneeName ? (
              <div className="flex items-center gap-2">
                <Avatar name={task.assigneeName} src={task.assigneeAvatar} size="xs" />
                <span className="text-xs text-gray-700 dark:text-gray-300">{task.assigneeName}</span>
              </div>
            ) : (
              <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Assign
              </button>
            )}
          </div>

          {/* Reporter */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3" /> Reporter
            </p>
            <div className="flex items-center gap-2">
              <Avatar name={task.reporterName} size="xs" />
              <span className="text-xs text-gray-700 dark:text-gray-300">{task.reporterName}</span>
            </div>
          </div>

          {/* Story points */}
          {task.storyPoints !== undefined && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Story points
              </p>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{task.storyPoints}</span>
            </div>
          )}

          {/* Due date */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Due date
            </p>
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => dispatch(updateTask({ id: task.id, dueDate: e.target.value }))}
              className="input text-xs py-1.5"
            />
          </div>

          {/* Labels */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Labels
            </p>
            <div className="flex flex-wrap gap-1">
              {task.labels.map((label) => (
                <LabelBadge key={label.id} name={label.name} color={label.color} />
              ))}
              {task.labels.length === 0 && (
                <span className="text-xs text-gray-400">None</span>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1.5">
            <p className="text-[10px] text-gray-400">
              Created {timeAgo(task.createdAt)}
            </p>
            <p className="text-[10px] text-gray-400">
              Updated {timeAgo(task.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
