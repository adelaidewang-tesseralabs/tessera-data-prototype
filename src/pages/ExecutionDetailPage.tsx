import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../store'
import { formatRelative } from '../lib/format'
import { StatusPill } from '../components/ui/FeatureHeader'

export function ExecutionDetailPage() {
  const { id, checkId } = useParams()
  const { dashboards, checks } = useStore()
  const dashboard = dashboards.find((d) => d.id === id)
  const check = checks.find((c) => c.id === checkId)

  if (!dashboard || !check) {
    return <div className="p-8 text-white/60">Execution not found.</div>
  }

  return (
    <div className="p-5">
      <Link
        to={`/data-harmonization/dashboard/${dashboard.id}`}
        className="mb-3 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" /> {dashboard.name}
      </Link>
      <h1 className="text-xl font-medium text-white">{check.name}</h1>
      <div className="mt-2 flex items-center gap-2 text-sm text-white/55">
        <StatusPill status={check.status} />
        <span>Last run {check.lastRun ? formatRelative(check.lastRun) : '—'}</span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 p-4">
          <h2 className="mb-3 text-sm font-medium text-white">Error detail</h2>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-white/45">
              <tr>
                <th className="py-2">Record</th>
                <th className="py-2">Field</th>
                <th className="py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['V10003', 'payment_terms', 'Value is blank'],
                ['V10008', 'payment_terms', 'Value is blank'],
                ['V10019', 'payment_terms', 'Unknown code Z99'],
              ].map(([rec, field, msg]) => (
                <tr key={rec + field} className="border-t border-white/5">
                  <td className="py-2 font-mono text-xs text-tlai-blue">{rec}</td>
                  <td className="py-2 text-white/70">{field}</td>
                  <td className="py-2 text-white/70">{msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="rounded-xl border border-white/10 p-4">
          <h2 className="mb-3 text-sm font-medium text-white">Execution history</h2>
          <ul className="space-y-2 text-sm">
            {[
              { when: '4 hours ago', status: 'COMPLETED', duration: '3.2s' },
              { when: '1 day ago', status: 'FAILED', duration: '1.1s' },
              { when: '3 days ago', status: 'COMPLETED', duration: '2.8s' },
            ].map((row) => (
              <li
                key={row.when}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
              >
                <span className="text-white/70">{row.when}</span>
                <StatusPill status={row.status} />
                <span className="text-white/45">{row.duration}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
