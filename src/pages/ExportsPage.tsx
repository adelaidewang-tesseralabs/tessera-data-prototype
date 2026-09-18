import { useState } from 'react'
import { ArrowUpRight, Info, Plus, RefreshCw } from 'lucide-react'
import { useStore } from '../store'
import { formatRelative } from '../lib/format'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { StatusPill } from '../components/ui/FeatureHeader'

export function ExportsPage() {
  const { exports, createExport } = useStore()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Exports</h1>
          <p className="mt-2 text-sm text-white/50">
            Lake tables, delivered to your connected systems.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" aria-label="Refresh">
            <RefreshCw className="size-4" />
          </Button>
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            New export
          </Button>
        </div>
      </div>

      <div
        role="note"
        className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65"
      >
        <Info className="mt-0.5 size-4 shrink-0 text-tlai-blue" />
        Export to Dynamics 365 today. More export destinations are coming soon.
      </div>

      {exports.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 py-20 text-center">
          <ArrowUpRight className="mb-5 size-8 text-tlai-mint" />
          <h2 className="text-base font-medium">No recent exports</h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase text-white/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">By</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((e) => (
                <tr key={e.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-medium text-white">{e.name}</td>
                  <td className="px-4 py-3 text-white/70">{e.destination}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={e.status} />
                  </td>
                  <td className="px-4 py-3 text-white/55">{formatRelative(e.createdAt)}</td>
                  <td className="px-4 py-3 text-white/55">{e.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={creating}
        onClose={() => setCreating(false)}
        title="New export"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button
              disabled={!name.trim()}
              onClick={() => {
                createExport(name.trim())
                setName('')
                setCreating(false)
              }}
            >
              Start export
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3 text-sm">
          <label className="flex flex-col gap-1.5">
            <span className="text-white/60">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-white/60">Destination</span>
            <select className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none">
              <option>Dynamics 365</option>
            </select>
          </label>
        </div>
      </Dialog>
    </div>
  )
}
