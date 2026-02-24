'use client'

interface MetricPoint {
  value: number
  recordedAt: string
}

interface MetricChartProps {
  title: string
  data: MetricPoint[]
  unit?: string
  color?: string
}

const colorClasses: Record<string, { line: string; fill: string; text: string }> = {
  green: { line: 'stroke-green-500', fill: 'fill-green-100', text: 'text-green-600' },
  blue: { line: 'stroke-blue-500', fill: 'fill-blue-100', text: 'text-blue-600' },
  orange: { line: 'stroke-orange-500', fill: 'fill-orange-100', text: 'text-orange-600' },
  purple: { line: 'stroke-purple-500', fill: 'fill-purple-100', text: 'text-purple-600' },
  amber: { line: 'stroke-amber-500', fill: 'fill-amber-100', text: 'text-amber-600' },
}

function formatValue(value: number, unit?: string): string {
  if (unit === 'dollars') {
    return `$${(value / 1000).toFixed(0)}k`
  }
  if (unit === 'percent') {
    return `${value}%`
  }
  return value.toString()
}

export function MetricChart({ title, data, unit, color = 'blue' }: MetricChartProps) {
  const colors = colorClasses[color] || colorClasses.blue

  if (!data || data.length === 0) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="font-medium mb-2">{title}</div>
        <div className="text-sm text-muted-foreground">No data available</div>
      </div>
    )
  }

  const values = data.map((d) => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue || 1

  const width = 300
  const height = 100
  const padding = 20

  // Generate SVG path for line
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((d.value - minValue) / range) * (height - padding * 2)
    return { x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  // Area path (for fill)
  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${height - padding}
    L ${padding} ${height - padding}
    Z
  `

  const currentValue = data[data.length - 1]?.value ?? 0
  const previousValue = data[data.length - 2]?.value ?? currentValue
  const change = currentValue - previousValue
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : '0'

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">Last {data.length} weeks</div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${colors.text}`}>
            {formatValue(currentValue, unit)}
          </div>
          <div className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(Number(changePercent))}%
          </div>
        </div>
      </div>

      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + ratio * (height - padding * 2)}
            x2={width - padding}
            y2={padding + ratio * (height - padding * 2)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} className={colors.fill} opacity="0.3" />

        {/* Line */}
        <path d={linePath} fill="none" className={colors.line} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" className={`${colors.line} fill-white`} strokeWidth="2" />
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-1 px-4">
        <span>{new Date(data[0].recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(data[data.length - 1].recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  )
}





