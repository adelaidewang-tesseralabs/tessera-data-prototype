import { useMemo, useState } from 'react'
import { LibraryBig } from 'lucide-react'
import { INITIAL_NEXUS_TEMPLATES, type NexusTemplate } from '../data/mock'
import { FeatureHeader } from '../components/ui/FeatureHeader'
import { SearchBox } from '../components/ui/SearchBox'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/cn'

export function NexusLibraryPage() {
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('All')
  const [selected, setSelected] = useState<NexusTemplate | null>(null)

  const domains = useMemo(
    () => ['All', ...Array.from(new Set(INITIAL_NEXUS_TEMPLATES.map((t) => t.domain)))],
    [],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return INITIAL_NEXUS_TEMPLATES.filter((t) => {
      if (domain !== 'All' && t.domain !== domain) return false
      if (!q) return true
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q)
      )
    })
  }, [search, domain])

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="p-5 pb-2">
        <FeatureHeader title="Nexus Library" Icon={LibraryBig}>
          Reusable mapping templates across domains
        </FeatureHeader>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pb-3">
        <SearchBox value={search} onChange={setSearch} className="min-w-[200px] flex-1" />
        <div className="flex flex-wrap gap-1">
          {domains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomain(d)}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-xs',
                domain === d ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white',
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 pb-6">
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t)}
              className="rounded-xl border border-white/10 bg-tlai-card p-4 text-left transition hover:border-white/20 hover:bg-tlai-3"
            >
              <div className="text-xs text-tlai-purple">{t.domain}</div>
              <div className="mt-1 text-sm font-medium text-white">{t.name}</div>
              <div className="mt-2 line-clamp-2 text-xs text-white/45">{t.description}</div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <button
            type="button"
            className="absolute inset-0 z-20 bg-black/40"
            aria-label="Close drawer"
            onClick={() => setSelected(null)}
          />
          <aside className="absolute top-0 right-0 z-30 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-tlai-2 shadow-2xl">
            <div className="border-b border-white/10 px-5 py-4">
              <div className="text-xs text-tlai-purple">{selected.domain}</div>
              <h2 className="mt-1 text-lg font-medium text-white">{selected.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-white/65">
              <p>{selected.description}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-white/55">
                <li>Includes source → target field pairs</li>
                <li>Optional transform stubs</li>
                <li>Can be cloned into a new Nexus mapping</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-3">
              <Button variant="outline" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Button onClick={() => setSelected(null)}>Use template</Button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
