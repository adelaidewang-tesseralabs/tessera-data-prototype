import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../store'
import { formatRelative } from '../lib/format'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { StatusPill } from '../components/ui/FeatureHeader'

export function LibraryDetailPage() {
  const { libraryId } = useParams()
  const { libraries, checks, dashboards } = useStore()
  const library = libraries.find((l) => l.id === libraryId)
  const libChecks = checks.filter((c) => c.libraryId === libraryId)
  const [exportOpen, setExportOpen] = useState(false)
  const [exported, setExported] = useState(false)

  if (!library) {
    return <div className="p-8 text-white/60">Library not found.</div>
  }

  return (
    <div className="p-5">
      <Link
        to="/data-harmonization/libraries"
        className="mb-3 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" /> Libraries
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-medium text-white">{library.name}</h1>
          {library.description && (
            <p className="mt-1 text-sm text-white/50">{library.description}</p>
          )}
        </div>
        <Button onClick={() => setExportOpen(true)}>Export to dashboard</Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              <th className="px-4 py-3">Data check</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Issues</th>
              <th className="px-4 py-3">Last run</th>
            </tr>
          </thead>
          <tbody>
            {(libChecks.length ? libChecks : checks.slice(0, 3)).map((c) => (
              <tr key={c.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-medium text-white">{c.name}</td>
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

      <Dialog
        open={exportOpen}
        onClose={() => {
          setExportOpen(false)
          setExported(false)
        }}
        title="Export checks to dashboard"
        footer={
          exported ? (
            <Button
              variant="outline"
              onClick={() => {
                setExportOpen(false)
                setExported(false)
              }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setExportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setExported(true)}>Export</Button>
            </>
          )
        }
      >
        {exported ? (
          <p className="text-sm text-tlai-mint">Checks exported (simulated).</p>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
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
