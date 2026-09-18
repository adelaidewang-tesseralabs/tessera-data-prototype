import { chipColor } from '../../lib/format'
import { cn } from '../../lib/cn'

export function Chip({ value, className }: { value: string; className?: string }) {
  const color = chipColor(value)
  return (
    <span
      className={cn(
        'inline-flex max-w-full truncate rounded-md border px-2 py-0.5 text-xs font-medium',
        className,
      )}
      style={{ background: color.bg, color: color.text, borderColor: color.border }}
    >
      {value}
    </span>
  )
}
