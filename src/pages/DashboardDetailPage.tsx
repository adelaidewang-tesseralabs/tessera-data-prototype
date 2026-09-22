import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Play, Send, Settings, Star } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DASHBOARD_CHART_DATA, QUALITY_TREND } from '../data/mock'
import { useStore } from '../store'
import { useIaMode } from '../context/IaModeContext'
import { formatFullDate, formatRelative } from '../lib/format'
import { cn } from '../lib/cn'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Dialog } from '../components/ui/Dialog'
import { StatusPill } from '../components/ui/FeatureHeader'

const TABS = ['Progress Overview', 'Views', 'Error Tracking'] as const

export function DashboardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { option } = useIaMode()
  const { dashboards, favorites, checks, libraries, toggleFavorite, runChecks } = useStore()
  const dashboard = dashboards.find((d) => d.id === id)

  const modeBlurb =
    option === '3'
      ? 'Option 3: run checks inside the workstream workspace. This dashboard only shows quality readouts.'
      : option === '2-1'
        ? 'Option 2-1: Policies lead Quality. This dashboard subscribes to a policy for readouts.'
        : option === '2'
          ? 'Option 2: Quality is Policies only. Rules run when a dashboard applies a policy to imported data; Logs live on the policy.'
          : 'Option 1: Checks are first-class. This dashboard consumes a linked policy — no embedded Data Checks tab.'

  const [tab, setTab] = useState<(typeof TABS)[number]>('Progress Overview')
  const [shareOpen, setShareOpen] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)

  const linkedSuite = useMemo(
    () => libraries.find((l) => l.id === dashboard?.linkedSuiteId),
    [libraries, dashboard?.linkedSuiteId],
  )

  const suiteChecks = useMemo(() => {
    if (!linkedSuite) return checks.slice(0, 6)
    const rows = checks.filter((c) => c.libraryId === linkedSuite.id)
    return rows.length ? rows : checks.slice(0, 6)
  }, [checks, linkedSuite])

  if (!dashboard) {
    return (
      <div className="p-8 text-white/60">
        Dashboard not found.{' '}
        <Link to="/data-harmonization" className="text-tlai-mint underline">
          Back to list
        </Link>
      </div>
    )
  }

  const fav = favorites.includes(dashboard.id)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-4">
        <button
          type="button"
          onClick={() => navigate('/data-harmonization')}
          className="mb-2 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> Dashboards
        </button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-medium text-white">{dashboard.name}</h1>
              {dashboard.workstream && <Chip value={dashboard.workstream} />}
            </div>
            <div className="mt-1 text-sm text-white/50">
              Last execution:{' '}
              {dashboard.lastExecution ? formatFullDate(dashboard.lastExecution) : 'Never'}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-white/45">Quality from policy:</span>
              {linkedSuite ? (
                <Link
                  to={`/data-harmonization/policy/${linkedSuite.id}`}
                  className="rounded-md bg-tlai-mint/10 px-2 py-0.5 text-tlai-mint ring-1 ring-tlai-mint/25 hover:bg-tlai-mint/15"
                >
                  {linkedSuite.name}
                </Link>
              ) : (
                <span className="text-white/40">None linked — attach a policy from Policies</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              disabled={!suiteChecks.length}
              onClick={() => runChecks(suiteChecks.map((c) => c.id))}
            >
              <Play className="size-4" />
              {option === '3' ? 'Re-run workstream checks' : 'Re-run linked policy'}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => toggleFavorite(dashboard.id)}
              aria-label="Favorite"
            >
              <Star className={cn('size-4', fav && 'fill-white text-white')} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShareOpen(true)} aria-label="Share">
              <Send className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setPrefsOpen(true)}
              aria-label="Preferences"
            >
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 flex gap-1 border-b border-transparent">
          {TABS.map((t) => (
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
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-4 rounded-lg border border-tlai-mint/20 bg-tlai-mint/5 px-3 py-2 text-xs text-tlai-mint/90">
          {modeBlurb}
        </div>

        {tab === 'Progress Overview' && (
          <div className="grid gap-4 lg:grid-cols-3">
            <MetricCard
              label="Data Quality Score"
              value={
                dashboard.qualityScore == null ? 'N/A' : `${dashboard.qualityScore.toFixed(1)}%`
              }
            />
            <MetricCard label="Open Issues" value="329" />
            <MetricCard label="Policy rules" value={String(suiteChecks.length)} />
            {linkedSuite && (
              <div className="rounded-xl border border-white/10 bg-tlai-3/40 p-4 lg:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-white">Linked policy status</div>
                  <Link
                    to={`/data-harmonization/policy/${linkedSuite.id}`}
                    className="text-xs text-tlai-mint hover:underline"
                  >
                    Open policy
                  </Link>
                </div>
                <div className="overflow-hidden rounded-lg border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-xs uppercase text-white/50">
                      <tr>
                        <th className="px-4 py-2">Check</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Issues</th>
                        <th className="px-4 py-2">Last run</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suiteChecks.map((c) => (
                        <tr key={c.id} className="border-t border-white/5">
                          <td className="px-4 py-2 text-white">{c.name}</td>
                          <td className="px-4 py-2">
                            <StatusPill status={c.status} />
                          </td>
                          <td className="px-4 py-2 text-white/70">{c.issueCount}</td>
                          <td className="px-4 py-2 text-white/55">
                            {c.lastRun ? formatRelative(c.lastRun) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="rounded-xl border border-white/10 bg-tlai-3/40 p-4 lg:col-span-2">
              <div className="mb-3 text-sm font-medium text-white">Issues by dimension</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DASHBOARD_CHART_DATA}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#1f1f1f',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                      }}
                    />
                    <Bar dataKey="issues" fill="#8e7aff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-tlai-3/40 p-4">
              <div className="mb-3 text-sm font-medium text-white">Quality trend</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={QUALITY_TREND}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#1f1f1f',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#afffde"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'Views' && (
          <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-white/50">
            Custom views are stubbed in this prototype. Create views in the product to pin tabular
            slices of execution results.
          </div>
        )}

        {tab === 'Error Tracking' && (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="px-4 py-3">Error</th>
                  <th className="px-4 py-3">Count</th>
                  <th className="px-4 py-3">Severity</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Missing payment terms', 210, 'High'],
                  ['Invalid tax ID format', 48, 'Medium'],
                  ['Blank vendor name', 12, 'High'],
                  ['Country mismatch on bank', 33, 'Low'],
                ].map(([err, count, sev]) => (
                  <tr key={err as string} className="border-t border-white/5">
                    <td className="px-4 py-3 text-white">{err}</td>
                    <td className="px-4 py-3 text-white/70">{count}</td>
                    <td className="px-4 py-3 text-white/55">{sev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share dashboard"
        footer={
          <Button variant="outline" onClick={() => setShareOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-white/65">
          ACL sharing is stubbed. In product you can grant EDITOR / VIEWER per user or group.
        </p>
      </Dialog>

      <Dialog
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        title="Dashboard preferences"
        footer={
          <Button variant="outline" onClick={() => setPrefsOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-white/65">
          Link or change the subscribed policy here in the product. Data sources and schedules stay
          under preferences.
        </p>
      </Dialog>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-tlai-3/40 p-4">
      <div className="text-xs text-white/45">{label}</div>
      <div className="mt-2 text-2xl font-medium text-white">{value}</div>
    </div>
  )
}
