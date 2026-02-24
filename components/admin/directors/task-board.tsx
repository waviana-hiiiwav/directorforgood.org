'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Task {
  id: number
  title: string
  description?: string | null
  priority: string | null
  status: string | null
  blockedReason?: string | null
}

interface TaskBoardProps {
  tasks: Task[]
  onUpdateTask: (id: number, updates: Partial<Task>) => void
  onCreateTask: (task: { title: string; description?: string; priority: string }) => void
}

const columns = [
  { key: 'pending', label: 'Pending', color: 'bg-gray-100' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-blue-100' },
  { key: 'blocked', label: 'Blocked', color: 'bg-red-100' },
  { key: 'completed', label: 'Completed', color: 'bg-green-100' },
]

const priorityColors: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-gray-400',
}

export function TaskBoard({ tasks, onUpdateTask, onCreateTask }: TaskBoardProps) {
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')

  const tasksByStatus = columns.reduce(
    (acc, col) => {
      acc[col.key] = tasks.filter((t) => t.status === col.key)
      return acc
    },
    {} as Record<string, Task[]>
  )

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return
    onCreateTask({
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      priority: newTaskPriority,
    })
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskPriority('medium')
    setShowNewTask(false)
  }

  const moveTask = (taskId: number, newStatus: string) => {
    onUpdateTask(taskId, { status: newStatus })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Tasks</h3>
        <Button size="sm" onClick={() => setShowNewTask(!showNewTask)}>
          {showNewTask ? 'Cancel' : '+ Add Task'}
        </Button>
      </div>

      {showNewTask && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-3">
            <Input
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={2}
            />
            <div className="flex gap-3 items-center">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col.key} className={`rounded-lg ${col.color} p-3 min-h-[300px]`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-sm">{col.label}</h4>
              <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
                {tasksByStatus[col.key]?.length || 0}
              </span>
            </div>
            <div className="space-y-2">
              {tasksByStatus[col.key]?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onMove={(status) => moveTask(task.id, status)}
                  currentStatus={col.key}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TaskCardProps {
  task: Task
  onMove: (status: string) => void
  currentStatus: string
}

function TaskCard({ task, onMove, currentStatus }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className={`bg-white rounded-md p-3 shadow-sm border-l-4 ${priorityColors[task.priority || 'medium']} cursor-pointer`}
      onClick={() => setShowActions(!showActions)}
    >
      <div className="text-sm font-medium mb-1">{task.title}</div>
      {task.description && (
        <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</div>
      )}
      {task.blockedReason && currentStatus === 'blocked' && (
        <div className="text-xs text-red-600 bg-red-50 p-1.5 rounded mb-2">
          ⚠️ {task.blockedReason}
        </div>
      )}
      {showActions && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t">
          {currentStatus !== 'pending' && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove('pending') }}
              className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              → Pending
            </button>
          )}
          {currentStatus !== 'in_progress' && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove('in_progress') }}
              className="text-xs px-2 py-1 bg-blue-200 rounded hover:bg-blue-300"
            >
              → In Progress
            </button>
          )}
          {currentStatus !== 'blocked' && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove('blocked') }}
              className="text-xs px-2 py-1 bg-red-200 rounded hover:bg-red-300"
            >
              → Blocked
            </button>
          )}
          {currentStatus !== 'completed' && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove('completed') }}
              className="text-xs px-2 py-1 bg-green-200 rounded hover:bg-green-300"
            >
              → Done
            </button>
          )}
        </div>
      )}
    </div>
  )
}





