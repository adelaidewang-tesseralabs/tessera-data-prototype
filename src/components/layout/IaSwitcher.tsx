import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { IA_OPTIONS, useIaMode, type IaOption } from '../../context/IaModeContext'
import { cn } from '../../lib/cn'

export function IaSwitcher() {
  const { option, setOption, meta } = useIaMode()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const pick = (id: IaOption) => {
    setOption(id)
    setOpen(false)
    const next = IA_OPTIONS.find((o) => o.id === id)
    if (next) navigate(next.home)
  }

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative border-b border-white/10 bg-tlai-2/95 px-3 py-2">
      <div className="mb-1.5 text-[10px] font-semibold tracking-[0.08em] text-white/40">
        IA EXPLORATION
      </div>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-tlai-3 px-2.5 py-2 text-left text-xs text-white transition hover:border-white/20"
      >
        <span className="min-w-0 truncate">{meta.label}</span>
        <ChevronDown
          className={cn('size-3.5 shrink-0 text-white/50 transition', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-full right-3 left-3 z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-tlai-3 py-1 shadow-xl"
        >
          {IA_OPTIONS.map((o) => (
            <li key={o.id} role="option" aria-selected={option === o.id}>
              <button
                type="button"
                onClick={() => pick(o.id)}
                className={cn(
                  'block w-full px-3 py-2 text-left text-xs transition',
                  option === o.id
                    ? 'bg-tlai-mint/15 text-tlai-mint'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                )}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
