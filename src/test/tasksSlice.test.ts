import { describe, it, expect } from 'vitest'
import tasksReducer, { moveTask, addComment, toggleSubtask } from '@/store/tasksSlice'
import { MOCK_TASKS } from '@/services/mockData'

const initialState = { tasks: MOCK_TASKS, selectedTaskId: null, filters: { search: '', status: [], priority: [], assigneeId: [] } }

describe('tasksSlice', () => {
  it('moves a task to a new status', () => {
    const state = tasksReducer(initialState, moveTask({ taskId: 'task-7', newStatus: 'in_progress' }))
    const moved = state.tasks.find((t) => t.id === 'task-7')
    expect(moved?.status).toBe('in_progress')
  })

  it('records a status_change activity entry on move', () => {
    const state = tasksReducer(initialState, moveTask({ taskId: 'task-7', newStatus: 'done' }))
    const moved = state.tasks.find((t) => t.id === 'task-7')
    const lastActivity = moved?.activity[moved.activity.length - 1]
    expect(lastActivity?.type).toBe('status_change')
  })

  it('does not add activity when status is unchanged', () => {
    const task = MOCK_TASKS.find((t) => t.id === 'task-7')!
    const initialCount = task.activity.length
    const state = tasksReducer(initialState, moveTask({ taskId: 'task-7', newStatus: task.status }))
    const unchanged = state.tasks.find((t) => t.id === 'task-7')
    expect(unchanged?.activity.length).toBe(initialCount)
  })

  it('adds a comment to a task', () => {
    const comment = {
      id: 'c-test',
      content: 'Test comment',
      authorId: 'user-1',
      authorName: 'Alex Morgan',
      createdAt: new Date().toISOString(),
      isEdited: false,
    }
    const state = tasksReducer(initialState, addComment({ taskId: 'task-6', comment }))
    const task = state.tasks.find((t) => t.id === 'task-6')
    expect(task?.comments).toContainEqual(comment)
  })

  it('toggles a subtask completion', () => {
    const task = MOCK_TASKS.find((t) => t.id === 'task-6')!
    const sub = task.subtasks[2]
    const wasCompleted = sub.isCompleted
    const state = tasksReducer(initialState, toggleSubtask({ taskId: 'task-6', subtaskId: sub.id }))
    const updated = state.tasks.find((t) => t.id === 'task-6')
    const updatedSub = updated?.subtasks.find((s) => s.id === sub.id)
    expect(updatedSub?.isCompleted).toBe(!wasCompleted)
  })
})
