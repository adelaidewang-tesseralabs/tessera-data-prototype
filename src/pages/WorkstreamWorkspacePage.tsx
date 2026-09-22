import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Database, LayoutDashboard, ListChecks } from 'lucide-react'
import { useStore } from '../store'
import { formatRelative } from '../lib/format'
import { Button } from '../components/ui/Button'
import { StatusPill } from '../components/ui/FeatureHeader'
import { cn } from '../lib/cn'

const TABS = [
  { id: 'sources', label: 'Sources', Icon: Database },
  { id: 'checks', label: 'Checks', Icon: ListChecks },
  { id: 'dashboards', label: 'Dashboards', Icon: LayoutDashboard },
] as const

export function WorkstreamWorkspacePage() {
  const { workstreamId } = useParams()
  const { workstreams, dashboards, checks, libraries, runChecks } = useStore()
  const ws = workstreams.find((w) => w.id === workstreamId)
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('checks')

  const wsDashboards = useMemo(
    () => dashboards.filter((d) => d.workstream === ws?.name).slice(0, 12),
    [dashboards, ws?.name],
  )

  const wsLibraries = useMemo(
    () => libraries.filter((l) => l.workstream === ws?.name),
    [libraries, ws?.name],
  )

  const wsChecks = useMemo(() => {
    const libIds = new Set(wsLibraries.map((l) => l.id))
    if (libIds.size === 0) return checks.slice(0, 5)
    return checks.filter((c) => libIds.has(c.libraryId))
  }, [checks, wsLibraries])

  if (!ws) {
    return (
      <div className="p-8 text-white/60">
        Workstream not found.{' '}
        <Link to="/data-harmonization/workstreams" className="text-tlai-mint underline">
          Back
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-4">
        <Link
          to="/data-harmonization/workstreams"
          className="mb-2 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> Workstreams
        </Link>
        <h1 className="text-xl font-medium text-white">{ws.name}</h1>
        <p className="mt-1 text-sm text-white/50">{ws.description}</p>

        <div className="mt-4 flex gap-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-t-md px-3 py-2 text-sm',
                tab === id
                  ? 'border-b-2 border-tlai-mint text-white'
                  : 'text-white/50 hover:text-white',
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'sources' && (
          <div className="space-y-2">
            <p className="mb-3 text-sm text-white/50">
              Linked Foundry / ERP sources for this engagement (mock).
            </p>
            {['erp.vendor_master', 'erp.customer_bp', 'lake.dh_execution_results']
              .slice(0, ws.sourceCount)
              .map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm"
                >
                  <span className="font-mono text-tlai-blue">{name}</span>
                  <Link to="/data-foundry" className="text-xs text-white/50 hover:text-white">
                    Open in Foundry
                  </Link>
                </div>
              ))}
          </div>
        )}

        {tab === 'checks' && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-white/50">Run validation before dashboards consume results.</p>
              <Button
                size="sm"
                onClick={() => runChecks(wsChecks.map((c) => c.id))}
                disabled={wsChecks.length === 0}
              >
                Run all in workstream
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase text-white/50">
                  <tr>
                    <th className="px-4 py-3">Check</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Issues</th>
                    <th className="px-4 py-3">Last run</th>
                  </tr>
                </thead>
                <tbody>
                  {wsChecks.map((c) => (
                    <tr key={c.id} className="border-t border-white/5">
                      <td className="px-4 py-3 text-white">{c.name}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-4 py-3 text-white/70">{c.issueCount}</td>
                      <td className="px-4 py-3 text-white/55">
                        {c.lastRun ? formatRelative(c.lastRun) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'dashboards' && (
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
            {wsDashboards.length === 0 ? (
              <p className="text-sm text-white/50">No dashboards tagged to this workstream yet.</p>
            ) : (
              wsDashboards.map((d) => (
                <Link
                  key={d.id}
                  to={`/data-harmonization/dashboard/${d.id}`}
                  className="rounded-xl border border-white/10 bg-tlai-card p-4 hover:border-white/20"
                >
                  <div className="text-sm font-medium text-white">{d.name}</div>
                  <div className="mt-2 text-xs text-white/45">
                    Quality{' '}
                    {d.qualityScore == null ? 'N/A' : `${d.qualityScore.toFixed(1)}%`}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
