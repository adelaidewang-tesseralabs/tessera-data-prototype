import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChartColumn,
  ChevronsDownUp,
  ChevronsUpDown,
  KeyRound,
  MoreHorizontal,
  Plus,
  Star,
} from 'lucide-react'
import { useStore } from '../store'
import type { Dashboard, DashboardType } from '../data/mock'
import { formatFullDate, formatRelative } from '../lib/format'
import { cn } from '../lib/cn'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Dialog } from '../components/ui/Dialog'
import { FeatureHeader } from '../components/ui/FeatureHeader'
import { Pagination } from '../components/ui/Pagination'
import { SearchBox } from '../components/ui/SearchBox'

export function DashboardsPage() {
  const {
    dashboards,
    favorites,
    toggleFavorite,
    createDashboard,
    updateDashboard,
    deleteDashboard,
  } = useStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [showDetails, setShowDetails] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [credentialsOpen, setCredentialsOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<Dashboard | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Dashboard | null>(null)

  const favoriteDashboards = useMemo(
    () => favorites.map((id) => dashboards.find((d) => d.id === id)).filter(Boolean) as Dashboard[],
    [favorites, dashboards],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return dashboards
    return dashboards.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.workstream?.toLowerCase().includes(q) ||
        d.updatedBy.toLowerCase().includes(q),
    )
  }, [dashboards, search])

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-5">
      <FeatureHeader title="Data Harmonization" Icon={ChartColumn} />

      {favoriteDashboards.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">Favorites</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails((v) => !v)}
            >
              {showDetails ? 'Hide details' : 'Show details'}
              {showDetails ? (
                <ChevronsDownUp className="size-4" />
              ) : (
                <ChevronsUpDown className="size-4" />
              )}
            </Button>
          </div>
          <div className="flex min-h-30 flex-wrap gap-2">
            {favoriteDashboards.map((d) => (
              <Link
                key={d.id}
                to={`/data-harmonization/dashboard/${d.id}`}
                className="group relative w-[280px] rounded-xl border border-white/10 bg-tlai-card p-4 transition hover:border-white/20 hover:bg-tlai-3"
              >
                <button
                  type="button"
                  className="absolute top-3 right-3 text-white/40 opacity-0 transition group-hover:opacity-100 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(d.id)
                  }}
                  aria-label="Remove favorite"
                >
                  ×
                </button>
                <div className="pr-6 text-sm font-medium text-white">{d.name}</div>
                {showDetails && d.description && (
                  <div className="mt-1 line-clamp-2 text-xs text-white/45">{d.description}</div>
                )}
                <div className="mt-4 border-t border-white/10 pt-3">
                  {d.favoriteVignette === 'quality_score' ||
                  (!d.lastExecution && d.qualityScore == null) ? (
                    <>
                      <div className="text-2xl font-medium text-white">
                        {d.qualityScore == null ? 'N/A' : `${d.qualityScore.toFixed(1)}%`}
                      </div>
                      <div className="mt-1 text-xs text-white/45">Data Quality Score</div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-medium text-white">
                        {d.lastExecution ? formatFullDate(d.lastExecution) : '—'}
                      </div>
                      <div className="mt-1 text-xs text-white/45">Last Execution</div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-2">
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
        />
        <Button
          size="icon"
          variant="outline"
          aria-label="Credentials"
          onClick={() => setCredentialsOpen(true)}
        >
          <KeyRound className="size-4" />
        </Button>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Create Dashboard
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-tlai-1/80">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
            <tr>
              <th className="w-10 px-2 py-3 text-center">
                <Star className="mx-auto size-4" />
              </th>
              <th className="px-3 py-3 font-medium">Name</th>
              <th className="w-40 px-3 py-3 font-medium">Workstream</th>
              <th className="w-32 px-3 py-3 font-medium">Updated At</th>
              <th className="w-52 px-3 py-3 font-medium">Updated By</th>
              <th className="w-12 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((d) => {
              const fav = favorites.includes(d.id)
              return (
                <tr
                  key={d.id}
                  className="group/row border-t border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-2 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(d.id)}
                      className="inline-flex size-8 items-center justify-center rounded-md hover:bg-white/10"
                      aria-label={fav ? 'Unfavorite' : 'Favorite'}
                    >
                      <Star
                        className={cn(
                          'size-4',
                          fav ? 'fill-white text-white' : 'text-white/40 group-hover/row:text-white/70',
                        )}
                      />
                    </button>
                  </td>
                  <td className="min-w-0 px-3 py-3">
                    <Link
                      to={`/data-harmonization/dashboard/${d.id}`}
                      className="block truncate font-medium text-white hover:underline"
                    >
                      {d.name}
                    </Link>
                    {d.description && (
                      <div className="truncate text-xs text-white/45">{d.description}</div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {d.workstream ? <Chip value={d.workstream} /> : <span className="text-white/35">—</span>}
                  </td>
                  <td className="px-3 py-3 text-white/65">{formatRelative(d.updatedAt)}</td>
                  <td className="truncate px-3 py-3 text-white/65">{d.updatedBy}</td>
                  <td className="relative px-2 py-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setMenuId(menuId === d.id ? null : d.id)}
                      aria-label="Row actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                    {menuId === d.id && (
                      <div className="absolute top-10 right-2 z-20 w-36 overflow-hidden rounded-lg border border-white/10 bg-tlai-3 shadow-xl">
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                          onClick={() => {
                            setEditTarget(d)
                            setMenuId(null)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-white/5"
                          onClick={() => {
                            setDeleteTarget(d)
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

      <CreateEditDashboardDialog
        open={createOpen}
        title="Create Dashboard"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          const created = createDashboard(values)
          setCreateOpen(false)
          navigate(`/data-harmonization/dashboard/${created.id}`)
        }}
      />

      <CreateEditDashboardDialog
        open={!!editTarget}
        title="Edit Dashboard"
        initial={editTarget ?? undefined}
        onClose={() => setEditTarget(null)}
        onSubmit={(values) => {
          if (editTarget) updateDashboard(editTarget.id, values)
          setEditTarget(null)
        }}
      />

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete dashboard?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) deleteDashboard(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-white/65">
          This removes <span className="text-white">{deleteTarget?.name}</span> from the prototype
          list. No backend call is made.
        </p>
      </Dialog>

      <Dialog
        open={credentialsOpen}
        onClose={() => setCredentialsOpen(false)}
        title="Credentials"
        footer={
          <Button variant="outline" onClick={() => setCredentialsOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-white/65">
          Shared Data Harmonization credentials live here in the product. This prototype shows the
          entry point only.
        </p>
      </Dialog>
    </div>
  )
}

function CreateEditDashboardDialog({
  open,
  title,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean
  title: string
  initial?: Dashboard
  onClose: () => void
  onSubmit: (values: {
    name: string
    type: DashboardType
    workstream?: string
    description?: string
  }) => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<DashboardType>(initial?.type ?? 'HARMONIZATION')
  const [workstream, setWorkstream] = useState(initial?.workstream ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  // Reset when opening with different initial
  useMemo(() => {
    if (open) {
      setName(initial?.name ?? '')
      setType(initial?.type ?? 'HARMONIZATION')
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
                type,
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
            className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none focus:border-white/25"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-white/60">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DashboardType)}
            className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none"
          >
            <option value="HARMONIZATION">Harmonization</option>
            <option value="ANALYTICS">Analytics</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-white/60">Workstream</span>
          <input
            value={workstream}
            onChange={(e) => setWorkstream(e.target.value)}
            placeholder="Optional"
            className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-3 outline-none focus:border-white/25"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-white/60">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-lg border border-white/10 bg-tlai-3 px-3 py-2 outline-none focus:border-white/25"
          />
        </label>
      </div>
    </Dialog>
  )
}
