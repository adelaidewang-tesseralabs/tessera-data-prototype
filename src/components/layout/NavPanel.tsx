import { NavLink, useLocation } from 'react-router-dom'
import { PanelLeftClose } from 'lucide-react'
import { useIaMode, type IaOption } from '../../context/IaModeContext'
import { cn } from '../../lib/cn'
import { IaSwitcher } from './IaSwitcher'

type NavItem = { label: string; to: string }
type NavSection = { id: string; label: string; items: NavItem[] }

function sectionsForOption(option: IaOption): NavSection[] {
  const foundry: NavSection = {
    id: 'foundry',
    label: 'FOUNDRY',
    items: [
      { label: 'Console', to: '/data-foundry' },
      { label: 'Exports', to: '/exports' },
    ],
  }
  const nexus: NavSection = {
    id: 'nexus',
    label: 'NEXUS',
    items: [
      { label: 'Mappings', to: '/nexus' },
      { label: 'Library', to: '/nexus/library' },
    ],
  }

  if (option === '1') {
    return [
      foundry,
      {
        id: 'harmonization',
        label: 'HARMONIZATION',
        items: [
          { label: 'Data Checks', to: '/data-harmonization/checks' },
          { label: 'Policies', to: '/data-harmonization/policies' },
          { label: 'Dashboards', to: '/data-harmonization' },
          { label: 'Coverage', to: '/data-harmonization/coverage' },
          { label: 'Admin Portal', to: '/data-harmonization/admin' },
        ],
      },
      nexus,
    ]
  }

  if (option === '2') {
    return [
      foundry,
      {
        id: 'quality',
        label: 'QUALITY',
        items: [{ label: 'Policies', to: '/data-harmonization/policies' }],
      },
      {
        id: 'insights',
        label: 'INSIGHTS',
        items: [
          { label: 'Dashboards', to: '/data-harmonization' },
          { label: 'Coverage', to: '/data-harmonization/coverage' },
        ],
      },
      {
        id: 'admin',
        label: 'ADMIN',
        items: [{ label: 'Admin Portal', to: '/data-harmonization/admin' }],
      },
      nexus,
    ]
  }

  if (option === '2-1') {
    return [
      foundry,
      {
        id: 'quality',
        label: 'QUALITY',
        items: [
          { label: 'Policies', to: '/data-harmonization/policies' },
          { label: 'Checks', to: '/data-harmonization/checks' },
          { label: 'Logs', to: '/data-harmonization/logs' },
        ],
      },
      {
        id: 'insights',
        label: 'INSIGHTS',
        items: [
          { label: 'Dashboards', to: '/data-harmonization' },
          { label: 'Coverage', to: '/data-harmonization/coverage' },
        ],
      },
      {
        id: 'admin',
        label: 'ADMIN',
        items: [{ label: 'Admin Portal', to: '/data-harmonization/admin' }],
      },
      nexus,
    ]
  }

  // Option 3 — workstream spine
  return [
    foundry,
    {
      id: 'harmonization',
      label: 'HARMONIZATION',
      items: [
        { label: 'Workstreams', to: '/data-harmonization/workstreams' },
        { label: 'All checks', to: '/data-harmonization/checks' },
        { label: 'All dashboards', to: '/data-harmonization' },
        { label: 'Coverage', to: '/data-harmonization/coverage' },
        { label: 'Admin Portal', to: '/data-harmonization/admin' },
      ],
    },
    nexus,
  ]
}

function isActive(pathname: string, to: string) {
  if (to === '/data-harmonization') {
    return (
      pathname === '/data-harmonization' ||
      pathname.startsWith('/data-harmonization/dashboard')
    )
  }
  if (to === '/data-harmonization/policies') {
    return (
      pathname === '/data-harmonization/policies' ||
      pathname.startsWith('/data-harmonization/policy/') ||
      pathname === '/data-harmonization/templates' ||
      pathname.startsWith('/data-harmonization/template/') ||
      pathname === '/data-harmonization/suites' ||
      pathname.startsWith('/data-harmonization/suite/') ||
      pathname === '/data-harmonization/libraries' ||
      pathname.startsWith('/data-harmonization/library/')
    )
  }
  if (to === '/data-harmonization/workstreams') {
    return (
      pathname === '/data-harmonization/workstreams' ||
      pathname.startsWith('/data-harmonization/workstreams/')
    )
  }
  if (to === '/nexus') {
    return pathname === '/nexus' || /^\/nexus\/[^/]+$/.test(pathname)
  }
  if (to === '/data-foundry') return pathname === '/data-foundry'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function NavPanel({ onCollapse }: { onCollapse: () => void }) {
  const { pathname } = useLocation()
  const { option } = useIaMode()
  const sections = sectionsForOption(option)

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-tlai-2/90">
      <div className="flex items-start justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-white">Data</div>
          <div className="mt-0.5 text-xs text-white/45">Foundry · Harmonization · Nexus</div>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md text-white/45 transition hover:bg-white/10 hover:text-white"
          aria-label="Collapse side panel"
          title="Collapse side panel"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>
      <IaSwitcher />
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-[0.08em] text-white/40">
              {section.label}
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.to)
                return (
                  <li key={`${section.id}-${item.to}`}>
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
