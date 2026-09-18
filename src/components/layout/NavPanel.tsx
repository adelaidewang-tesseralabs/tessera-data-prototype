import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'

const SECTIONS = [
  {
    id: 'foundry',
    label: 'FOUNDRY',
    items: [
      { label: 'Console', to: '/data-foundry' },
      { label: 'Exports', to: '/exports' },
    ],
  },
  {
    id: 'harmonization',
    label: 'HARMONIZATION',
    items: [
      { label: 'Dashboards', to: '/data-harmonization' },
      { label: 'Libraries', to: '/data-harmonization/libraries' },
      { label: 'Coverage', to: '/data-harmonization/coverage' },
      { label: 'Admin Portal', to: '/data-harmonization/admin' },
    ],
  },
  {
    id: 'nexus',
    label: 'NEXUS',
    items: [
      { label: 'Mappings', to: '/nexus' },
      { label: 'Library', to: '/nexus/library' },
    ],
  },
] as const

function isActive(pathname: string, to: string) {
  if (to === '/data-harmonization') {
    return pathname === '/data-harmonization' || pathname.startsWith('/data-harmonization/dashboard')
  }
  if (to === '/data-harmonization/libraries') {
    return (
      pathname === '/data-harmonization/libraries' ||
      pathname.startsWith('/data-harmonization/library/')
    )
  }
  if (to === '/nexus') {
    return pathname === '/nexus' || /^\/nexus\/[^/]+$/.test(pathname)
  }
  if (to === '/data-foundry') return pathname === '/data-foundry'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function NavPanel() {
  const { pathname } = useLocation()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-tlai-2/90">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-white">Data</div>
        <div className="mt-0.5 text-xs text-white/45">Foundry · Harmonization · Nexus</div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {SECTIONS.map((section) => (
          <div key={section.id} className="mb-4">
            <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-[0.08em] text-white/40">
              {section.label}
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.to)
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={cn(
                        'block rounded-md px-2.5 py-1.5 text-sm transition-colors',
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-white/65 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  )
}
