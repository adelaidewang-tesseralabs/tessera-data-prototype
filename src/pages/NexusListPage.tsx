import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Waypoints } from 'lucide-react'
import { INITIAL_NEXUS_PROJECTS } from '../data/mock'
import { useStore } from '../store'
import { formatRelative } from '../lib/format'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { FeatureHeader } from '../components/ui/FeatureHeader'
import { SearchBox } from '../components/ui/SearchBox'
import { cn } from '../lib/cn'

export function NexusListPage() {
  const { nexusProjects, createNexusProject } = useStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState<'all' | 'owned' | 'shared'>('all')
  const [sort, setSort] = useState<'recent' | 'name'>('recent')
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const projects = nexusProjects.length ? nexusProjects : INITIAL_NEXUS_PROJECTS

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = projects.filter((p) => {
      if (scope === 'owned') return p.ownership === 'owned'
      if (scope === 'shared') return p.ownership === 'shared'
      return true
    })
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
      )
    }
    return [...list].sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }, [projects, search, scope, sort])

  return (
    <div className="flex h-full flex-col p-5">
      <FeatureHeader title="Nexus Mappings" Icon={Waypoints}>
        Field-level mapping blueprints between source and target systems
      </FeatureHeader>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SearchBox value={search} onChange={setSearch} className="min-w-[200px] flex-1" />
        <div className="flex rounded-lg border border-white/10 p-0.5">
          {(['all', 'owned', 'shared'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-xs capitalize',
                scope === s ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white',
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'recent' | 'name')}
          className="h-9 rounded-lg border border-white/10 bg-tlai-3 px-2 text-sm outline-none"
        >
          <option value="recent">Recently updated</option>
          <option value="name">Name</option>
        </select>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Create mapping
        </Button>
      </div>

      <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {visible.map((p) => (
          <Link
            key={p.id}
            to={`/nexus/${p.id}`}
            className="rounded-xl border border-white/10 bg-tlai-card p-4 transition hover:border-white/20 hover:bg-tlai-3"
          >
            <div className="text-sm font-medium text-white">{p.name}</div>
            {p.description && (
              <div className="mt-1 line-clamp-2 text-xs text-white/45">{p.description}</div>
            )}
            <div className="mt-4 flex items-center justify-between text-xs text-white/45">
              <span className="capitalize">{p.ownership}</span>
              <span>{p.nodeCount} nodes · {formatRelative(p.updatedAt)}</span>
            </div>
          </Link>
        ))}
      </div>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create mapping"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!name.trim()}
              onClick={() => {
                const project = createNexusProject(name.trim(), description.trim() || undefined)
                setCreateOpen(false)
                setName('')
                setDescription('')
                navigate(`/nexus/${project.id}`)
              }}
            >
              Create
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
    </div>
  )
}
