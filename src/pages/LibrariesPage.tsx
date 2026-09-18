import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Library, MoreHorizontal, Plus } from 'lucide-react'
import { useStore } from '../store'
import type { Library as LibraryType } from '../data/mock'
import { formatRelative } from '../lib/format'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Dialog } from '../components/ui/Dialog'
import { FeatureHeader } from '../components/ui/FeatureHeader'
import { SearchBox } from '../components/ui/SearchBox'

export function LibrariesPage() {
  const { libraries, createLibrary, updateLibrary, deleteLibrary } = useStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<LibraryType | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LibraryType | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)

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

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-5">
      <FeatureHeader title="Libraries" Icon={Library} />
      <div className="flex gap-2">
        <SearchBox value={search} onChange={setSearch} />
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Create Library
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Workstream</th>
              <th className="px-4 py-3">Checks</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Updated By</th>
              <th className="w-12 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <Link
                    to={`/data-harmonization/library/${l.id}`}
                    className="font-medium text-white hover:underline"
                  >
                    {l.name}
                  </Link>
                  {l.description && <div className="text-xs text-white/45">{l.description}</div>}
                </td>
                <td className="px-4 py-3">{l.workstream ? <Chip value={l.workstream} /> : '—'}</td>
                <td className="px-4 py-3 text-white/70">{l.checkCount}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      <LibraryDialog
        open={createOpen}
        title="Create Library"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          const lib = createLibrary(values)
          setCreateOpen(false)
          navigate(`/data-harmonization/library/${lib.id}`)
        }}
      />
      <LibraryDialog
        open={!!editTarget}
        title="Edit Library"
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
        title="Delete library?"
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

function LibraryDialog({
  open,
  title,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean
  title: string
  initial?: LibraryType
  onClose: () => void
  onSubmit: (v: { name: string; workstream?: string; description?: string }) => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [workstream, setWorkstream] = useState(initial?.workstream ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  useMemo(() => {
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
                workstream: workstream.trim() || undefined,
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
          <span className="text-white/60">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-white/60">Workstream</span>
          <input
            value={workstream}
            onChange={(e) => setWorkstream(e.target.value)}
            className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none"
          />
        </label>
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
