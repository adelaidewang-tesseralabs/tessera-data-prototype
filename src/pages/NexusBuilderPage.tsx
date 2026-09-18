import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../store'
import { cn } from '../lib/cn'

const FIELD_ROWS = [
  { source: 'LIFNR', target: 'PARTNER', note: 'Vendor number → BP' },
  { source: 'NAME1', target: 'NAME_ORG1', note: 'Name' },
  { source: 'LAND1', target: 'COUNTRY', note: 'Country key' },
  { source: 'STCEG', target: 'TAXNUMXL', note: 'Tax ID' },
  { source: 'ZTERM', target: 'PAYMENT_TERMS', note: 'Payment terms' },
]

export function NexusBuilderPage() {
  const { projectId } = useParams()
  const { nexusProjects } = useStore()
  const project = nexusProjects.find((p) => p.id === projectId)
  const [tab, setTab] = useState<'Graph' | 'Fields'>('Graph')

  const { nodes, edges } = useMemo(() => {
    const n: Node[] = [
      {
        id: 'src',
        position: { x: 40, y: 80 },
        data: { label: 'ECC Vendor (LFA1)' },
        style: nodeStyle('#94cbff'),
      },
      {
        id: 'mid',
        position: { x: 280, y: 140 },
        data: { label: 'Transform' },
        style: nodeStyle('#edb74d'),
      },
      {
        id: 'tgt',
        position: { x: 520, y: 80 },
        data: { label: 'S/4 Business Partner' },
        style: nodeStyle('#afffde'),
      },
      {
        id: 'bank',
        position: { x: 520, y: 220 },
        data: { label: 'Bank Details' },
        style: nodeStyle('#8e7aff'),
      },
    ]
    const e: Edge[] = [
      { id: 'a', source: 'src', target: 'mid', ...edgeStyle },
      { id: 'b', source: 'mid', target: 'tgt', ...edgeStyle },
      { id: 'c', source: 'mid', target: 'bank', ...edgeStyle },
    ]
    return { nodes: n, edges: e }
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-3">
        <Link
          to="/nexus"
          className="mb-2 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> Mappings
        </Link>
        <h1 className="text-lg font-medium text-white">
          {project?.name ?? 'Mapping project'}
        </h1>
        <div className="mt-3 flex gap-1">
          {(['Graph', 'Fields'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rounded-t-md px-3 py-2 text-sm',
                tab === t
                  ? 'border-b-2 border-tlai-mint text-white'
                  : 'text-white/50 hover:text-white',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'Graph' ? (
        <div className="min-h-0 flex-1 bg-tlai-1">
          <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
            <Background color="rgba(255,255,255,0.06)" gap={18} />
            <Controls />
          </ReactFlow>
        </div>
      ) : (
        <div className="overflow-auto p-5">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="px-4 py-3">Source field</th>
                  <th className="px-4 py-3">Target field</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {FIELD_ROWS.map((r) => (
                  <tr key={r.source} className="border-t border-white/5">
                    <td className="px-4 py-3 font-mono text-xs text-tlai-blue">{r.source}</td>
                    <td className="px-4 py-3 font-mono text-xs text-tlai-mint">{r.target}</td>
                    <td className="px-4 py-3 text-white/60">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function nodeStyle(accent: string): React.CSSProperties {
  return {
    background: '#1f1f1f',
    border: `1px solid ${accent}66`,
    borderRadius: 10,
    color: '#fff',
    fontSize: 12,
    padding: 10,
    width: 170,
  }
}

const edgeStyle = {
  style: { stroke: 'rgba(255,255,255,0.25)' },
  markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.4)' },
}
