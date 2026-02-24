'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GoalProgressProps {
  id?: number
  title: string
  current: number
  target: number
  unit: string
  status: string
  compact?: boolean
  editable?: boolean
  onUpdate?: (id: number, currentValue: number, status: string) => void
}

const statusColors: Record<string, { bar: string; text: string }> = {
  on_track: { bar: 'bg-green-500', text: 'text-green-600' },
  at_risk: { bar: 'bg-yellow-500', text: 'text-yellow-600' },
  behind: { bar: 'bg-red-500', text: 'text-red-600' },
  completed: { bar: 'bg-blue-500', text: 'text-blue-600' },
}

function formatValue(value: number, unit: string): string {
  if (unit === 'dollars') {
    return `$${(value / 1000).toFixed(0)}k`
  }
  if (unit === 'percent') {
    return `${value}%`
  }
  if (unit === 'months') {
    return `${value} mo`
  }
  if (unit === 'days') {
    return `${value}d`
  }
  if (unit === 'hours') {
    return `${value}h`
  }
  return value.toString()
}

export function GoalProgress({
  id,
  title,
  current,
  target,
  unit,
  status,
  compact = false,
  editable = false,
  onUpdate,
}: GoalProgressProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(current.toString())
  const [editStatus, setEditStatus] = useState(status)

  const colors = statusColors[status] || statusColors.on_track
  const percentage = Math.min(100, Math.round((current / target) * 100))

  const handleSave = () => {
    if (onUpdate && id) {
      onUpdate(id, parseInt(editValue) || 0, editStatus)
    }
    setEditing(false)
  }

  if (compact) {
    return (
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground truncate">{title}</span>
          <span className={`font-medium ${colors.text}`}>
            {formatValue(current, unit)} / {formatValue(target, unit)}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="p-4 border rounded-lg bg-muted/50">
        <div className="font-medium mb-3">{title}</div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Current Value</label>
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="on_track">On Track</option>
              <option value="at_risk">At Risk</option>
              <option value="behind">Behind</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium">{title}</div>
          <div className={`text-sm ${colors.text} capitalize`}>{status.replace('_', ' ')}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{formatValue(current, unit)}</div>
          <div className="text-sm text-muted-foreground">of {formatValue(target, unit)}</div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${colors.bar} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{percentage}% complete</span>
        {editable && (
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </div>
    </div>
  )
}





