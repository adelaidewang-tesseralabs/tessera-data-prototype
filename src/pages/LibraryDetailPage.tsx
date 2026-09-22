import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight,
  FileText,
  GitBranch,
  Link2,
  MoreHorizontal,
  Plus,
} from 'lucide-react'
import { INITIAL_POLICY_ACTIVITIES } from '../data/mock'
import { useStore } from '../store'
import { useIaMode } from '../context/IaModeContext'
import { formatFullDate, formatRelative } from '../lib/format'
import { cn } from '../lib/cn'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { StatusPill } from '../components/ui/FeatureHeader'
import { SearchBox } from '../components/ui/SearchBox'

const OPTION2_TABS = [
  'Rules',
  'Execution history',
  'Linked dashboards',
  'Activity logs',
] as const

const DIMENSION_COLORS: Record<string, string> = {
  Activity: 'bg-emerald-500/20 text-emerald-300',
  Sales: 'bg-rose-500/20 text-rose-300',
  'Master Data': 'bg-sky-500/20 text-sky-300',
  Finance: 'bg-amber-500/20 text-amber-300',
  Quality: 'bg-violet-500/20 text-violet-300',
}

const TYPE_COLORS: Record<string, string> = {
  RFC: 'bg-white/10 text-white/80',
  FOUNDRY: 'bg-tlai-mint/15 text-tlai-mint',
  FILE_UPLOAD: 'bg-tlai-blue/15 text-tlai-blue',
  WORKFLOW: 'bg-tlai-purple/20 text-[#c4b8ff]',
}

export function LibraryDetailPage() {
  const { libraryId } = useParams()
  const { libraries, checks, dashboards, executions } = useStore()
  const { option } = useIaMode()
  const library = libraries.find((l) => l.id === libraryId)
  const libChecks = useMemo(
    () => checks.filter((c) => c.libraryId === libraryId),
    [checks, libraryId],
  )
  const rows = useMemo(
    () => (libChecks.length ? libChecks : checks.slice(0, 3)),
    [libChecks, checks],
  )
  const checkNames = useMemo(() => new Set(rows.map((c) => c.name)), [rows])
  const executionHistory = useMemo(
    () => executions.filter((e) => checkNames.has(e.checkName)),
    [executions, checkNames],
  )
  const linkedDashboards = useMemo(
    () => (library ? dashboards.filter((d) => d.linkedSuiteId === library.id) : []),
    [dashboards, library],
  )
  const activityLogs = useMemo(
    () =>
      INITIAL_POLICY_ACTIVITIES.filter((a) => a.libraryId === libraryId).sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
      ),
    [libraryId],
  )

  const [linkOpen, setLinkOpen] = useState(false)
  const [linked, setLinked] = useState(false)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const [tab, setTab] = useState<(typeof OPTION2_TABS)[number]>('Rules')
  const [ruleSearch, setRuleSearch] = useState('')
  const [selectedRules, setSelectedRules] = useState<Set<string>>(() => new Set())
  const [ruleMenuId, setRuleMenuId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const filteredRules = useMemo(() => {
    const q = ruleSearch.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.ruleNo?.toLowerCase().includes(q) ||
        c.issueDescription?.toLowerCase().includes(q) ||
        c.dimension?.toLowerCase().includes(q) ||
        c.checkType?.toLowerCase().includes(q),
    )
  }, [rows, ruleSearch])

  if (!library) {
    return <div className="p-8 text-white/60">Policy not found.</div>
  }

  const policiesPath =
    option === '3' ? '/data-harmonization/workstreams' : '/data-harmonization/policies'
  const policiesLabel = option === '3' ? 'Workstreams' : 'Policies'
  const isOption2 = option === '2'

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  const toggleRule = (id: string) => {
    setSelectedRules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <nav className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-white/50">
          <Link to={policiesPath} className="hover:text-white">
            {policiesLabel}
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-white/30" />
          <span className="truncate text-white">{library.name}</span>
        </nav>
        <div className="relative flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={() => setLinkOpen(true)}>
            <Link2 className="size-4" />
            Link to dashboard
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="More actions"
            onClick={() => setHeaderMenuOpen((v) => !v)}
          >
            <MoreHorizontal className="size-4" />
          </Button>
          {headerMenuOpen && (
            <div className="absolute top-10 right-0 z-30 w-44 overflow-hidden rounded-lg border border-white/10 bg-tlai-3 shadow-xl">
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                onClick={() => {
                  showToast('Edit policy (stub)')
                  setHeaderMenuOpen(false)
                }}
              >
                Edit policy
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                onClick={() => {
                  showToast('Duplicate policy (stub)')
                  setHeaderMenuOpen(false)
                }}
              >
                Duplicate
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-white/5"
                onClick={() => {
                  showToast('Delete policy (stub)')
                  setHeaderMenuOpen(false)
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {library.description && (
          <p className="mb-3 text-sm text-white/50">{library.description}</p>
        )}
        {isOption2 && (
          <p className="mb-4 text-xs text-white/40">
            Rules are definitions. Execution history records runs; Activity logs record changes to
            this policy.
          </p>
        )}

      {isOption2 && (
        <div className="mb-4 flex flex-wrap gap-1 border-b border-white/10">
          {OPTION2_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rounded-t-md px-3 py-2 text-sm transition',
                tab === t
                  ? 'border-b-2 border-tlai-mint text-white'
                  : 'text-white/50 hover:text-white',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div>
        {(!isOption2 || tab === 'Rules') &&
          (isOption2 ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <SearchBox
                  value={ruleSearch}
                  onChange={setRuleSearch}
                  placeholder="Search data checks.."
                  className="min-w-[200px] flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => showToast('Create Data Check (stub)')}
                >
                  <Plus className="size-4" />
                  Create Data Checks
                </Button>
                <Button onClick={() => showToast('Create Workflow Data Check (stub)')}>
                  <GitBranch className="size-4" />
                  Create Workflow Data Check
                </Button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase text-white/50">
                    <tr>
                      <th className="w-10 px-3 py-3" />
                      <th className="px-3 py-3">Data Check Name</th>
                      <th className="px-3 py-3">Rule No.</th>
                      <th className="px-3 py-3">Issue Description</th>
                      <th className="px-3 py-3">Program</th>
                      <th className="px-3 py-3">Priority</th>
                      <th className="px-3 py-3">Dimension</th>
                      <th className="px-3 py-3">Data Check Type</th>
                      <th className="px-3 py-3">Updated At</th>
                      <th className="px-3 py-3">Created At</th>
                      <th className="w-12 px-2 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRules.map((c) => (
                      <tr key={c.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRules.has(c.id)}
                            onChange={() => toggleRule(c.id)}
                            className="accent-tlai-mint"
                            aria-label={`Select ${c.name}`}
                          />
                        </td>
                        <td className="px-3 py-3 font-medium text-white">{c.name}</td>
                        <td className="px-3 py-3 font-mono text-xs text-white/60">
                          {c.ruleNo ?? '—'}
                        </td>
                        <td className="max-w-[180px] truncate px-3 py-3 text-white/55">
                          {c.issueDescription ?? '—'}
                        </td>
                        <td className="px-3 py-3 text-white/45">
                          <FileText className="size-4" />
                        </td>
                        <td className="px-3 py-3 text-white/70">
                          {c.priority ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className={cn(
                                  'inline-block size-1.5 rounded-full',
                                  c.priority === 'High' && 'bg-rose-400',
                                  c.priority === 'Medium' && 'bg-amber-400',
                                  c.priority === 'Low' && 'bg-white/40',
                                )}
                              />
                              {c.priority}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {c.dimension ? (
                            <span
                              className={cn(
                                'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
                                DIMENSION_COLORS[c.dimension] ?? 'bg-white/10 text-white/70',
                              )}
                            >
                              {c.dimension}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {c.checkType ? (
                            <span
                              className={cn(
                                'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                                TYPE_COLORS[c.checkType] ?? 'bg-white/10 text-white/70',
                              )}
                            >
                              {c.checkType}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-white/55">
                          {c.updatedAt ? formatFullDate(c.updatedAt).split(',')[0] : '—'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-white/55">
                          {c.createdAt ? formatFullDate(c.createdAt).split(',')[0] : '—'}
                        </td>
                        <td className="relative px-2 py-3">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setRuleMenuId(ruleMenuId === c.id ? null : c.id)
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                          {ruleMenuId === c.id && (
                            <div className="absolute top-10 right-2 z-20 w-36 overflow-hidden rounded-lg border border-white/10 bg-tlai-3 shadow-xl">
                              <button
                                type="button"
                                className="block w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                                onClick={() => {
                                  showToast(`Edit “${c.name}” (stub)`)
                                  setRuleMenuId(null)
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="block w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-white/5"
                                onClick={() => {
                                  showToast(`Remove “${c.name}” (stub)`)
                                  setRuleMenuId(null)
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase text-white/50">
                  <tr>
                    <th className="px-4 py-3">Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id} className="border-t border-white/5">
                      <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {isOption2 && tab === 'Execution history' && (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {executionHistory.length === 0 ? (
              <p className="p-6 text-sm text-white/50">
                No executions yet. Runs appear here after a linked dashboard applies this policy.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase text-white/50">
                  <tr>
                    <th className="px-4 py-3">Rule</th>
                    <th className="px-4 py-3">Dashboard</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Started</th>
                    <th className="px-4 py-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {executionHistory.map((e) => (
                    <tr key={e.id} className="border-t border-white/5">
                      <td className="px-4 py-3 font-medium text-white">{e.checkName}</td>
                      <td className="px-4 py-3 text-white/60">{e.dashboardName}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={e.status} />
                      </td>
                      <td className="px-4 py-3 text-white/55">{formatRelative(e.startedAt)}</td>
                      <td className="px-4 py-3 text-white/55">
                        {e.durationMs ? `${(e.durationMs / 1000).toFixed(1)}s` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {isOption2 && tab === 'Linked dashboards' && (
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
            {linkedDashboards.length === 0 ? (
              <p className="text-sm text-white/50">
                No dashboards linked yet. Linking applies these rules when the dashboard is created
                or refreshed against imported data.
              </p>
            ) : (
              linkedDashboards.map((d) => (
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

        {isOption2 && tab === 'Activity logs' && (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {activityLogs.length === 0 ? (
              <p className="p-6 text-sm text-white/50">
                No policy changes recorded yet. Rule add/remove/edit and link events appear here.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase text-white/50">
                  <tr>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Detail</th>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">When</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((a) => (
                    <tr key={a.id} className="border-t border-white/5">
                      <td className="px-4 py-3 font-medium text-white">{a.action}</td>
                      <td className="px-4 py-3 text-white/65">{a.detail}</td>
                      <td className="px-4 py-3 text-white/55">{a.actor}</td>
                      <td className="px-4 py-3 text-white/55">{formatRelative(a.at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      </div>

      {toast && (
        <div className="fixed right-6 bottom-6 z-50 rounded-lg border border-white/10 bg-tlai-3 px-4 py-2 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}

      <Dialog
        open={linkOpen}
        onClose={() => {
          setLinkOpen(false)
          setLinked(false)
        }}
        title="Link policy to dashboard"
        footer={
          linked ? (
            <Button
              variant="outline"
              onClick={() => {
                setLinkOpen(false)
                setLinked(false)
              }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setLinkOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setLinked(true)}>Link</Button>
            </>
          )
        }
      >
        {linked ? (
          <p className="text-sm text-tlai-mint">
            Dashboard now applies this policy’s rules to imported data for quality readouts
            (simulated).
          </p>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-white/55">
              Applying a policy runs its rules against the dashboard’s imported data.
            </p>
            <span className="text-white/60">Target dashboard</span>
            <select className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none">
              {dashboards.slice(0, 8).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </Dialog>
    </div>
  )
}
