import { useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Waypoints } from 'lucide-react'
import { useStore } from '../store'
import { FeatureHeader } from '../components/ui/FeatureHeader'
import { SearchBox } from '../components/ui/SearchBox'
import { cn } from '../lib/cn'

export function CoveragePage() {
  const { dashboards, libraries, checks } = useStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<{
    type: string
    name: string
    detail: string
  } | null>(null)

  const { nodes, edges } = useMemo(() => {
    const dashSample = dashboards.slice(0, 6)
    const libSample = libraries.slice(0, 4)
    const checkSample = checks.slice(0, 6)

    const n: Node[] = [
      ...dashSample.map((d, i) => ({
        id: d.id,
        position: { x: 40 + (i % 3) * 220, y: 40 + Math.floor(i / 3) * 120 },
        data: { label: d.name, type: 'Dashboard', detail: d.workstream ?? 'No workstream' },
        style: nodeStyle('#8e7aff'),
      })),
      ...libSample.map((l, i) => ({
        id: l.id,
        position: { x: 80 + (i % 2) * 260, y: 320 + Math.floor(i / 2) * 100 },
        data: { label: l.name, type: 'Library', detail: `${l.checkCount} checks` },
        style: nodeStyle('#027746'),
      })),
      ...checkSample.map((c, i) => ({
        id: c.id,
        position: { x: 520 + (i % 2) * 200, y: 280 + Math.floor(i / 2) * 90 },
        data: {
          label: c.name,
          type: 'Check',
          detail: `${c.issueCount} issues`,
        },
        style: nodeStyle('#94cbff'),
      })),
    ]

    const e: Edge[] = [
      { id: 'e1', source: dashSample[0]?.id ?? '', target: libSample[0]?.id ?? '', ...edgeStyle },
      { id: 'e2', source: dashSample[1]?.id ?? '', target: libSample[1]?.id ?? '', ...edgeStyle },
      { id: 'e3', source: libSample[0]?.id ?? '', target: checkSample[0]?.id ?? '', ...edgeStyle },
      { id: 'e4', source: libSample[0]?.id ?? '', target: checkSample[1]?.id ?? '', ...edgeStyle },
      { id: 'e5', source: libSample[1]?.id ?? '', target: checkSample[2]?.id ?? '', ...edgeStyle },
      { id: 'e6', source: dashSample[2]?.id ?? '', target: libSample[2]?.id ?? '', ...edgeStyle },
    ].filter((edge) => edge.source && edge.target)

    return { nodes: n, edges: e }
  }, [dashboards, libraries, checks])

  const q = search.trim().toLowerCase()
  const visibleNodes = q
    ? nodes.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: String(n.data.label).toLowerCase().includes(q) ? 1 : 0.25,
        },
      }))
    : nodes

  return (
    <div className="flex h-full flex-col p-5">
      <FeatureHeader title="Coverage" Icon={Waypoints} />
      <div className="mt-3 mb-3 max-w-md">
        <SearchBox value={search} onChange={setSearch} placeholder="Search nodes..." />
      </div>
      <div className="relative min-h-[480px] flex-1 overflow-hidden rounded-xl border border-white/10 bg-tlai-1">
        <ReactFlow
          nodes={visibleNodes}
          edges={edges}
          fitView
          onNodeClick={(_, node) =>
            setSelected({
              type: String(node.data.type),
              name: String(node.data.label),
              detail: String(node.data.detail),
            })
          }
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(255,255,255,0.06)" gap={20} />
          <Controls />
          <MiniMap
            nodeColor="#303030"
            maskColor="rgba(0,0,0,0.6)"
            style={{ background: '#121212' }}
          />
        </ReactFlow>
        <div className="absolute top-3 left-3 flex gap-2 text-xs">
          <Legend color="#8e7aff" label="Dashboard" />
          <Legend color="#027746" label="Library" />
          <Legend color="#94cbff" label="Check" />
        </div>
        {selected && (
          <div className="absolute top-3 right-3 w-64 rounded-xl border border-white/10 bg-tlai-2/95 p-4 shadow-xl">
            <div className="text-xs uppercase tracking-wide text-white/45">{selected.type}</div>
            <div className="mt-1 text-sm font-medium text-white">{selected.name}</div>
            <div className="mt-2 text-xs text-white/55">{selected.detail}</div>
            <button
              type="button"
              className="mt-3 text-xs text-white/40 hover:text-white"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function nodeStyle(accent: string): React.CSSProperties {
  return {
    background: '#1f1f1f',
    border: `1px solid ${accent}55`,
    borderRadius: 10,
    color: '#fff',
    fontSize: 12,
    padding: 8,
    width: 180,
  }
}

const edgeStyle = {
  style: { stroke: 'rgba(255,255,255,0.2)' },
  markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.35)' },
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-1 text-white/70')}>
      <span className="size-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
