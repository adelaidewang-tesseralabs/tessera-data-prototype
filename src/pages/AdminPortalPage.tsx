import { useMemo, useState } from 'react'
import { Shield } from 'lucide-react'
import { useStore } from '../store'
import { formatRelative } from '../lib/format'
import { FeatureHeader } from '../components/ui/FeatureHeader'
import { StatusPill } from '../components/ui/FeatureHeader'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'

export function AdminPortalPage() {
  const { executions, dashboards } = useStore()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') return executions
    return executions.filter((e) => e.status === statusFilter)
  }, [executions, statusFilter])

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const completed = executions.filter((e) => e.status === 'COMPLETED').length
  const failed = executions.filter((e) => e.status === 'FAILED').length
  const running = executions.filter((e) => e.status === 'RUNNING').length

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-5">
      <FeatureHeader title="Admin Portal" Icon={Shield} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Dashboards" value={String(dashboards.length)} />
        <Metric label="Completed" value={String(completed)} />
        <Metric label="Failed" value={String(failed)} />
        <Metric label="Running" value={String(running)} />
      </div>

      <section className="rounded-xl border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Recent executions</h2>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="h-8 rounded-md border border-white/10 bg-tlai-3 px-2 text-xs text-white/70 outline-none"
          >
            <option value="ALL">All statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="RUNNING">Running</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase text-white/50">
              <tr>
                <th className="px-3 py-2">Dashboard</th>
                <th className="px-3 py-2">Check</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Started</th>
                <th className="px-3 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-t border-white/5">
                  <td className="px-3 py-2 text-white">{e.dashboardName}</td>
                  <td className="px-3 py-2 text-white/70">{e.checkName}</td>
                  <td className="px-3 py-2">
                    <StatusPill status={e.status} />
                  </td>
                  <td className="px-3 py-2 text-white/55">{formatRelative(e.startedAt)}</td>
                  <td className="px-3 py-2 text-white/55">
                    {e.durationMs ? `${(e.durationMs / 1000).toFixed(1)}s` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s)
              setPage(1)
            }}
          />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 p-4">
          <h2 className="mb-2 text-sm font-medium text-white">Import / Export packages</h2>
          <p className="mb-3 text-sm text-white/50">
            Move Harmonization dashboards and policies between tenants.
          </p>
          <div className="flex gap-2">
            <Button variant="outline">Import package</Button>
            <Button variant="outline">Export package</Button>
          </div>
        </section>
        <section className="rounded-xl border border-white/10 p-4">
          <h2 className="mb-2 text-sm font-medium text-white">Storage status</h2>
          <div className="space-y-2 text-sm text-white/65">
            <div className="flex justify-between">
              <span>Result store</span>
              <span className="text-tlai-mint">Data Foundry lake</span>
            </div>
            <div className="flex justify-between">
              <span>Programs (legacy)</span>
              <span>Read-only</span>
            </div>
            <div className="flex justify-between">
              <span>Cache</span>
              <Button size="sm" variant="outline">
                Invalidate
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-tlai-3/40 p-4">
      <div className="text-xs text-white/45">{label}</div>
      <div className="mt-1 text-2xl font-medium text-white">{value}</div>
    </div>
  )
}
