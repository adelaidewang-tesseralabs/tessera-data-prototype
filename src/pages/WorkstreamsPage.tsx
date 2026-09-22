import { Link } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import { useStore } from '../store'
import { formatRelative } from '../lib/format'
import { FeatureHeader } from '../components/ui/FeatureHeader'

export function WorkstreamsPage() {
  const { workstreams } = useStore()

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-5">
      <FeatureHeader title="Workstreams" Icon={FolderKanban}>
        Option 3 spine — each engagement owns Sources → Checks → Dashboards.
      </FeatureHeader>

      <div className="rounded-lg border border-tlai-purple/25 bg-tlai-purple/10 px-3 py-2 text-xs text-[#c4b8ff]">
        Open a workstream to work vertically. Global All checks / All dashboards remain in the nav for
        cross-cutting views.
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {workstreams.map((ws) => (
          <Link
            key={ws.id}
            to={`/data-harmonization/workstreams/${ws.id}`}
            className="rounded-xl border border-white/10 bg-tlai-card p-4 transition hover:border-white/20 hover:bg-tlai-3"
          >
            <div className="text-sm font-medium text-white">{ws.name}</div>
            <p className="mt-1 line-clamp-2 text-xs text-white/45">{ws.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/50">
              <span>{ws.sourceCount} sources</span>
              <span>{ws.checkCount} checks</span>
              <span>{ws.dashboardCount} dashboards</span>
            </div>
            <div className="mt-2 text-xs text-white/35">Updated {formatRelative(ws.updatedAt)}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
