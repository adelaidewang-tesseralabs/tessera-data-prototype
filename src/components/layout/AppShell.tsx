import { Outlet, useLocation } from 'react-router-dom'
import { NavRail } from './NavRail'
import { NavPanel } from './NavPanel'
import { ChatFAB } from './ChatFAB'

export function AppShell() {
  const { pathname } = useLocation()
  const showDataPanel =
    pathname.startsWith('/data') ||
    pathname.startsWith('/exports') ||
    pathname.startsWith('/nexus')

  return (
    <div className="flex h-full bg-tlai-1 text-white">
      <NavRail />
      {showDataPanel && <NavPanel />}
      <main className="relative min-w-0 flex-1 overflow-hidden bg-tlai-0">
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
      <ChatFAB />
    </div>
  )
}
