import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ScrollText, MoreHorizontal, Plus } from 'lucide-react'
import { useStore } from '../store'
import { useIaMode } from '../context/IaModeContext'
import type { Dashboard, Library as LibraryType } from '../data/mock'
import { formatRelative } from '../lib/format'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Dialog } from '../components/ui/Dialog'
import { FeatureHeader } from '../components/ui/FeatureHeader'
import { SearchBox } from '../components/ui/SearchBox'
import { cn } from '../lib/cn'

const FALLBACK_DASHBOARD_NAMES = [
  'test_data_harmonization_dashboard',
  'SAP Customer Master - Go-Live Readiness',
  'Athena Test',
  'Vendor Master Data',
  'Finance Close Pack',
  'Material Quality Scorecard',
  'BP Migration Readiness',
]

function usedInDashboards(libraryId: string, dashboards: Dashboard[]): string[] {
  const linked = dashboards
    .filter((d) => d.linkedSuiteId === libraryId)
    .map((d) => d.name)
  if (linked.length > 0) return linked

  let h = 0
  for (let i = 0; i < libraryId.length; i++) h = (h + libraryId.charCodeAt(i) * (i + 1)) % 7
  const count = h + 1
  return Array.from({ length: count }, (_, i) => {
    const name = FALLBACK_DASHBOARD_NAMES[(h + i) % FALLBACK_DASHBOARD_NAMES.length]
    return count > 1 && i > 0 ? `${name} (${i + 1})` : name
  })
}

function UsedInCell({ names, href }: { names: string[]; href: string }) {
  const [open, setOpen] = useState(false)
  const count = names.length

  return (
    <td
      className="relative px-4 py-3"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={href}
        className="border-b border-dotted border-white/40 text-white/75 hover:text-white"
      >
        {count} {count === 1 ? 'Dashboard' : 'Dashboards'}
      </Link>
      {open && count > 0 && (
        <div
          role="tooltip"
          className={cn(
            'absolute top-1/2 right-full z-30 mr-2 w-max max-w-[280px] -translate-y-1/2',
            'rounded-md border border-white/15 bg-[#2a2a2a] px-3 py-2 text-xs leading-5 text-white/90 shadow-xl',
          )}
        >
          <ul className="flex flex-col gap-0.5">
            {names.map((name) => (
              <li key={name} className="whitespace-nowrap">
                {name}
              </li>
            ))}
          </ul>
          <span
            aria-hidden
            className="absolute top-1/2 left-full -translate-y-1/2 border-y-4 border-l-[6px] border-y-transparent border-l-[#2a2a2a]"
          />
        </div>
      )}
    </td>
  )
}

export function LibrariesPage() {
  const { libraries, dashboards, createLibrary, updateLibrary, deleteLibrary } = useStore()
  const { option } = useIaMode()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<LibraryType | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LibraryType | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)

  const detailBase = '/data-harmonization/policy'
  const isOption2 = option === '2'

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return libraries
    return libraries.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.workstream?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q),
    )
  }, [libraries, search])

  const blurb =
    option === '2'
      ? 'Quality home — named rule packs applied when a dashboard is created. Open a policy for Rules, Execution history, Linked dashboards, and Activity logs.'
      : option === '2-1'
        ? 'Primary Quality object — reusable rule packs. Start here, then drill into Checks or Logs.'
        : 'Reusable packs of data rules. Dashboards subscribe to a policy for quality readouts. Policies have no status until linked.'

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-5">
      <FeatureHeader title="Policies" Icon={ScrollText}>
        {blurb}
      </FeatureHeader>
      <div className="flex gap-2">
        <SearchBox value={search} onChange={setSearch} />
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Create Policy
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              {!isOption2 && <th className="px-4 py-3">Workstream</th>}
              <th className="px-4 py-3">Rules</th>
              {isOption2 && <th className="px-4 py-3">Used in</th>}
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Updated By</th>
              <th className="w-12 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const usedNames = isOption2 ? usedInDashboards(l.id, dashboards) : []
              return (
                <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      to={`${detailBase}/${l.id}`}
                      className="font-medium text-white hover:underline"
                    >
                      {l.name}
                    </Link>
                    {l.description && (
                      <div className="text-xs text-white/45">{l.description}</div>
                    )}
                  </td>
                  {!isOption2 && (
                    <td className="px-4 py-3">
                      {l.workstream ? <Chip value={l.workstream} /> : '—'}
                    </td>
                  )}
                  <td className="px-4 py-3 text-white/70">{l.checkCount}</td>
                  {isOption2 && (
                    <UsedInCell names={usedNames} href={`${detailBase}/${l.id}`} />
                  )}
                  <td className="px-4 py-3 text-white/55">{formatRelative(l.updatedAt)}</td>
                  <td className="px-4 py-3 text-white/55">{l.updatedBy}</td>
                  <td className="relative px-2 py-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setMenuId(menuId === l.id ? null : l.id)}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                    {menuId === l.id && (
                      <div className="absolute top-10 right-2 z-20 w-36 overflow-hidden rounded-lg border border-white/10 bg-tlai-3 shadow-xl">
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                          onClick={() => {
                            setEditTarget(l)
                            setMenuId(null)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-white/5"
                          onClick={() => {
                            setDeleteTarget(l)
                            setMenuId(null)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <PolicyDialog
        open={createOpen}
        title="Create Policy"
        showWorkstream={!isOption2}
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          const lib = createLibrary(values)
          setCreateOpen(false)
          navigate(`${detailBase}/${lib.id}`)
        }}
      />
      <PolicyDialog
        open={!!editTarget}
        title="Edit Policy"
        showWorkstream={!isOption2}
        initial={editTarget ?? undefined}
        onClose={() => setEditTarget(null)}
        onSubmit={(values) => {
          if (editTarget) updateLibrary(editTarget.id, values)
          setEditTarget(null)
        }}
      />
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete policy?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) deleteLibrary(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-white/65">
          Remove <span className="text-white">{deleteTarget?.name}</span> from the prototype.
        </p>
      </Dialog>
    </div>
  )
}

function PolicyDialog({
  open,
  title,
  initial,
  showWorkstream,
  onClose,
  onSubmit,
}: {
  open: boolean
  title: string
  initial?: LibraryType
  showWorkstream: boolean
  onClose: () => void
  onSubmit: (v: { name: string; workstream?: string; description?: string }) => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [workstream, setWorkstream] = useState(initial?.workstream ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '')
      setWorkstream(initial?.workstream ?? '')
      setDescription(initial?.description ?? '')
    }
  }, [open, initial])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!name.trim()}
            onClick={() =>
              onSubmit({
                name: name.trim(),
                workstream: showWorkstream ? workstream.trim() || undefined : undefined,
                description: description.trim() || undefined,
              })
            }
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-white/60">Policy name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none"
          />
        </label>
        {showWorkstream && (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/60">Workstream</span>
            <input
              value={workstream}
              onChange={(e) => setWorkstream(e.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none"
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-white/60">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-lg border border-white/10 bg-tlai-3 px-3 py-2 outline-none"
          />
        </label>
      </div>
    </Dialog>
  )
}
