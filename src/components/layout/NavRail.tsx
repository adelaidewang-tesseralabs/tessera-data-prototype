import { Link, useLocation } from 'react-router-dom'
import {
  Bell,
  Brain,
  CircleFadingArrowUp,
  Database,
  Hammer,
  Home,
  MessagesSquare,
  Settings,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const UPPER = [
  { id: 'home', label: 'Home', Icon: Home, to: '/placeholder/home' },
  { id: 'chat', label: 'Chat', Icon: MessagesSquare, to: '/placeholder/chat' },
  { id: 'build', label: 'Build', Icon: Hammer, to: '/placeholder/build' },
  { id: 'data', label: 'Data', Icon: Database, to: '/data-harmonization' },
  { id: 'knowledge', label: 'Knowledge', Icon: Brain, to: '/placeholder/knowledge' },
  {
    id: 'modernize',
    label: 'Modernize',
    Icon: CircleFadingArrowUp,
    to: '/placeholder/modernize',
  },
] as const

export function NavRail() {
  const location = useLocation()
  const dataActive =
    location.pathname.startsWith('/data') ||
    location.pathname.startsWith('/exports') ||
    location.pathname.startsWith('/nexus')

  return (
    <aside
      className="flex h-full w-[72px] shrink-0 flex-col items-center bg-tlai-1 py-3"
      aria-label="Primary navigation"
    >
      <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold tracking-tight text-tlai-mint">
        T
      </div>
      <nav className="flex flex-1 flex-col items-center gap-3">
        {UPPER.map(({ id, label, Icon, to }) => {
          const active = id === 'data' ? dataActive : location.pathname.startsWith(to)
          return (
            <Link
              key={id}
              to={to}
              className="group/rail-item flex w-full flex-col items-center gap-1"
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg text-white transition-colors',
                  active ? 'bg-white/10' : 'group-hover/rail-item:bg-tessera-sidebar-accent/40',
                )}
              >
                <Icon className={cn('size-[18px]', !active && 'opacity-70')} />
              </span>
              <span
                className={cn(
                  'text-[11px] leading-none',
                  active ? 'text-white' : 'text-white/55',
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-3">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
        </button>
        <Link to="/placeholder/setup" className="flex flex-col items-center gap-1">
          <span className="flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10">
            <Settings className="size-[18px]" />
          </span>
          <span className="text-[11px] text-white/55">Setup</span>
        </Link>
        <div
          className="mt-1 flex size-8 items-center justify-center rounded-full bg-tlai-4 text-xs font-medium text-white"
          title="Adelaide Wang"
        >
          AW
        </div>
      </div>
    </aside>
  )
}
