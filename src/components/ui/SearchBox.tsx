import { Search } from 'lucide-react'
import { cn } from '../../lib/cn'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBox({ value, onChange, placeholder = 'Search...', className }: SearchBoxProps) {
  return (
    <div className={cn('relative flex-1', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-white/10 bg-tlai-3/80 pr-3 pl-9 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/25"
      />
    </div>
  )
}
