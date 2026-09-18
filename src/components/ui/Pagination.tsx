import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

type PaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const maxPage = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex items-center justify-end gap-3 border-t border-white/10 px-3 py-2 text-xs text-white/50">
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="h-8 rounded-md border border-white/10 bg-tlai-3 px-2 text-white/70 outline-none"
      >
        {[10, 25, 50].map((n) => (
          <option key={n} value={n}>
            {n} per page
          </option>
        ))}
      </select>
      <span>
        {start}-{end} of {total}
      </span>
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          disabled={page >= maxPage}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
