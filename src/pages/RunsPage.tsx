import { useMemo, useState } from 'react'
import { History } from 'lucide-react'
import { useStore } from '../store'
import { formatRelative } from '../lib/format'
import { FeatureHeader, StatusPill } from '../components/ui/FeatureHeader'
import { Pagination } from '../components/ui/Pagination'
import { SearchBox } from '../components/ui/SearchBox'

export function RunsPage() {
  const { executions } = useStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return executions.filter((e) => {
      if (status !== 'ALL' && e.status !== status) return false
      if (!q) return true
      return (
        e.checkName.toLowerCase().includes(q) || e.dashboardName.toLowerCase().includes(q)
      )
    })
  }, [executions, search, status])

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-5">
      <FeatureHeader title="Logs" Icon={History}>
        Cross-policy execution history — Quality ops home in Options 2 and 2-1.
      </FeatureHeader>

      <div className="flex flex-wrap gap-2">
        <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-2 text-sm outline-none"
        >
          <option value="ALL">All statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="RUNNING">Running</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELED">Canceled</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              <th className="px-4 py-3">Check</th>
              <th className="px-4 py-3">Context</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Started</th>
              <th className="px-4 py-3">Duration</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
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
    </div>
  )
}
