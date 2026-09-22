import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardCheck, Play } from 'lucide-react'
import { useStore } from '../store'
import { useIaMode } from '../context/IaModeContext'
import { formatRelative } from '../lib/format'
import { Button } from '../components/ui/Button'
import { FeatureHeader, StatusPill } from '../components/ui/FeatureHeader'
import { SearchBox } from '../components/ui/SearchBox'
import { cn } from '../lib/cn'

export function DataChecksPage() {
  const { checks, libraries, runChecks } = useStore()
  const { option } = useIaMode()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [policyFilter, setPolicyFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return checks.filter((c) => {
      if (policyFilter !== 'all' && c.libraryId !== policyFilter) return false
      if (!q) return true
      const policy = libraries.find((l) => l.id === c.libraryId)?.name ?? ''
      return c.name.toLowerCase().includes(q) || policy.toLowerCase().includes(q)
    })
  }, [checks, libraries, search, policyFilter])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelected(new Set(filtered.map((c) => c.id)))
  }

  const runSelected = () => {
    const ids = selected.size ? [...selected] : filtered.map((c) => c.id)
    runChecks(ids)
    setSelected(new Set())
  }

  const title = option === '2' || option === '2-1' ? 'Checks' : 'Data Checks'
  const blurb =
    option === '3'
      ? 'Global check catalog. Prefer running checks inside a workstream for day-to-day work.'
      : option === '2-1'
        ? 'Individual checks live under Policies. Use this catalog to find or run a single check.'
        : 'Validate imported data here — one check or a batch — before building dashboards on results.'

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-5">
      <FeatureHeader title={title} Icon={ClipboardCheck}>
        {blurb}
      </FeatureHeader>

      <div className="rounded-lg border border-tlai-mint/20 bg-tlai-mint/5 px-3 py-2 text-xs text-tlai-mint/90">
        Flow: Import (Foundry) → run checks here → link a policy on a dashboard for readouts.
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={search} onChange={setSearch} className="min-w-[180px] flex-1" />
        <select
          value={policyFilter}
          onChange={(e) => setPolicyFilter(e.target.value)}
          className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-2 text-sm outline-none"
        >
          <option value="all">All policies</option>
          {libraries.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={selectAll}>
          Select page
        </Button>
        <Button onClick={runSelected} disabled={filtered.length === 0}>
          <Play className="size-4" />
          {selected.size ? `Run selected (${selected.size})` : 'Run all filtered'}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              <th className="w-10 px-3 py-3" />
              <th className="px-3 py-3">Check</th>
              <th className="px-3 py-3">Policy</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Issues</th>
              <th className="px-3 py-3">Scanned</th>
              <th className="px-3 py-3">Last run</th>
              <th className="w-28 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const policy = libraries.find((l) => l.id === c.libraryId)
              return (
                <tr key={c.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggle(c.id)}
                      className="accent-tlai-mint"
                      aria-label={`Select ${c.name}`}
                    />
                  </td>
                  <td className="px-3 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-3 py-3">
                    {policy ? (
                      <Link
                        to={`/data-harmonization/policy/${policy.id}`}
                        className="text-white/70 hover:underline"
                      >
                        {policy.name}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-3 py-3 text-white/70">{c.issueCount}</td>
                  <td className="px-3 py-3 text-white/70">
                    {c.scanned ? c.scanned.toLocaleString() : '—'}
                  </td>
                  <td className="px-3 py-3 text-white/55">
                    {c.lastRun ? formatRelative(c.lastRun) : '—'}
                  </td>
                  <td className="px-3 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(c.status === 'RUNNING' && 'opacity-50')}
                      disabled={c.status === 'RUNNING'}
                      onClick={() => runChecks([c.id])}
                    >
                      Run
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
