import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Send,
  Settings,
  Star,
} from 'lucide-react'
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
import { formatFullDate, formatRelative } from '../lib/format'
import { cn } from '../lib/cn'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Dialog } from '../components/ui/Dialog'
import { StatusPill } from '../components/ui/FeatureHeader'

const TABS = ['Progress Overview', 'Data Checks', 'Views', 'Error Tracking'] as const

export function DashboardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dashboards, favorites, checks, toggleFavorite, simulateExecuteAll } = useStore()
  const dashboard = dashboards.find((d) => d.id === id)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Progress Overview')
  const [shareOpen, setShareOpen] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [executeOpen, setExecuteOpen] = useState(false)
  const [running, setRunning] = useState(false)

  const dashChecks = useMemo(() => checks.slice(0, 6), [checks])

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
          <ArrowLeft className="size-3.5" /> Data Harmonization
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
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setExecuteOpen(true)}
              disabled={running}
            >
              <Play className="size-4" />
              {running ? 'Running…' : 'Execute All'}
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
        {tab === 'Progress Overview' && (
          <div className="grid gap-4 lg:grid-cols-3">
            <MetricCard
              label="Data Quality Score"
              value={
                dashboard.qualityScore == null ? 'N/A' : `${dashboard.qualityScore.toFixed(1)}%`
              }
            />
            <MetricCard label="Open Issues" value="329" />
            <MetricCard label="Checks Run" value="18" />
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

        {tab === 'Data Checks' && (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="px-4 py-3">Check</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Issues</th>
                  <th className="px-4 py-3">Scanned</th>
                  <th className="px-4 py-3">Last run</th>
                </tr>
              </thead>
              <tbody>
                {dashChecks.map((c) => (
                  <tr key={c.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <Link
                        to={`/data-harmonization/dashboard/${dashboard.id}/execution/${c.id}`}
                        className="font-medium text-white hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-white/70">{c.issueCount}</td>
                    <td className="px-4 py-3 text-white/70">{c.scanned.toLocaleString()}</td>
                    <td className="px-4 py-3 text-white/55">
                      {c.lastRun ? formatRelative(c.lastRun) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <tr key={err} className="border-t border-white/5">
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
        open={executeOpen}
        onClose={() => setExecuteOpen(false)}
        title="Execute all data checks?"
        footer={
          <>
            <Button variant="outline" onClick={() => setExecuteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setExecuteOpen(false)
                setRunning(true)
                simulateExecuteAll(dashboard.id)
                window.setTimeout(() => setRunning(false), 1800)
              }}
            >
              Execute
            </Button>
          </>
        }
      >
        <p className="text-sm text-white/65">
          Runs every check attached to this dashboard. Progress is simulated locally.
        </p>
      </Dialog>

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
          Data sources, schedules, settings, and vignettes live here in the product.
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
