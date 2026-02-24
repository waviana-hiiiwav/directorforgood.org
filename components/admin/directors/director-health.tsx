'use client'

interface DirectorHealthProps {
  health: 'green' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const healthConfig = {
  green: {
    label: 'On Track',
    bgColor: 'bg-green-500',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
  },
  yellow: {
    label: 'At Risk',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
  },
  red: {
    label: 'Behind',
    bgColor: 'bg-red-500',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
  },
}

const sizeConfig = {
  sm: { dot: 'w-2 h-2', text: 'text-xs' },
  md: { dot: 'w-3 h-3', text: 'text-sm' },
  lg: { dot: 'w-4 h-4', text: 'text-base' },
}

export function DirectorHealth({ health, size = 'md', showLabel = true }: DirectorHealthProps) {
  const config = healthConfig[health]
  const sizeStyles = sizeConfig[size]

  return (
    <div className="flex items-center gap-1.5">
      <span className={`${sizeStyles.dot} rounded-full ${config.dotColor} animate-pulse`} />
      {showLabel && (
        <span className={`${sizeStyles.text} font-medium ${config.textColor}`}>
          {config.label}
        </span>
      )}
    </div>
  )
}





