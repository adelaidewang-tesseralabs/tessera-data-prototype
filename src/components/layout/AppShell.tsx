import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PanelLeft } from 'lucide-react'
import { NavRail } from './NavRail'
import { NavPanel } from './NavPanel'
import { ChatFAB } from './ChatFAB'

const NARROW_MQ = '(max-width: 699px)'

export function AppShell() {
  const { pathname } = useLocation()
  const showDataPanel =
    pathname.startsWith('/data') ||
    pathname.startsWith('/exports') ||
    pathname.startsWith('/nexus')

  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(NARROW_MQ).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(NARROW_MQ)
    const onChange = () => {
      if (mq.matches) setCollapsed(true)
      else setCollapsed(false)
    }
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <div className="flex h-full bg-tlai-1 text-white">
      <NavRail />
      {showDataPanel && !collapsed && (
        <NavPanel onCollapse={() => setCollapsed(true)} />
      )}
      {showDataPanel && collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex h-full w-9 shrink-0 flex-col items-center border-r border-white/10 bg-tlai-2/90 pt-3 text-white/55 transition hover:bg-white/5 hover:text-white"
          aria-label="Expand side panel"
          title="Expand side panel"
        >
          <PanelLeft className="size-4" />
        </button>
      )}
      <main className="relative min-w-0 flex-1 overflow-hidden bg-tlai-0">
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
      <ChatFAB />
    </div>
  )
}
