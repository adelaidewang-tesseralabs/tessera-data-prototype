import { useMemo, useState } from 'react'
import { ChevronRight, DatabaseZap, Play, Table2 } from 'lucide-react'
import { FOUNDRY_CATALOG, FOUNDRY_TABLE_ROWS } from '../data/mock'
import { cn } from '../lib/cn'
import { Button } from '../components/ui/Button'
import { FeatureHeader } from '../components/ui/FeatureHeader'

export function DataFoundryPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'schema-erp': true,
    'schema-lake': true,
  })
  const [selectedTable, setSelectedTable] = useState('vendor_master')
  const [sql, setSql] = useState('SELECT * FROM vendor_master LIMIT 25')
  const [results, setResults] = useState<Record<string, string | number>[] | null>(
    FOUNDRY_TABLE_ROWS.vendor_master,
  )
  const [error, setError] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Ask me to preview a lake table or draft a SELECT. Replies are canned in this prototype.',
    },
  ])

  const columns = useMemo(() => {
    if (!results?.length) return [] as string[]
    return Object.keys(results[0])
  }, [results])

  const runSql = () => {
    const match = sql.match(/from\s+([a-zA-Z0-9_]+)/i)
    const table = match?.[1]?.toLowerCase()
    if (table && FOUNDRY_TABLE_ROWS[table]) {
      setSelectedTable(table)
      setResults(FOUNDRY_TABLE_ROWS[table])
      setError(null)
      return
    }
    if (/select\s+\*/i.test(sql) && selectedTable && FOUNDRY_TABLE_ROWS[selectedTable]) {
      setResults(FOUNDRY_TABLE_ROWS[selectedTable])
      setError(null)
      return
    }
    setResults(null)
    setError('No matching mock table. Try: SELECT * FROM vendor_master')
  }

  const sendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    setChatInput('')
    const reply = text.toLowerCase().includes('vendor')
      ? 'Opening vendor_master — click Run on the SQL tab to preview rows.'
      : 'Try “preview vendor_master” or run SELECT * FROM customer_bp in the console.'
    setChatLog((prev) => [...prev, { role: 'user', text }, { role: 'assistant', text: reply }])
    if (text.toLowerCase().includes('vendor')) {
      setSelectedTable('vendor_master')
      setSql('SELECT * FROM vendor_master LIMIT 25')
      setResults(FOUNDRY_TABLE_ROWS.vendor_master)
    }
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-5 pb-2">
        <FeatureHeader title="Data Foundry" Icon={DatabaseZap}>
          Replicate, query, and transform your ERP and non-ERP data
        </FeatureHeader>

        <div className="mt-4 flex min-h-0 flex-1 gap-3">
          <aside className="flex w-56 shrink-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-tlai-3">
            <div className="border-b border-white/10 px-3 py-2 text-xs font-medium uppercase tracking-wide text-white/45">
              Catalog
            </div>
            <div className="flex-1 overflow-y-auto p-2 text-sm">
              {FOUNDRY_CATALOG.map((schema) => (
                <div key={schema.id} className="mb-2">
                  <button
                    type="button"
                    className="flex w-full items-center gap-1 rounded-md px-2 py-1 text-left text-white/80 hover:bg-white/5"
                    onClick={() => setExpanded((e) => ({ ...e, [schema.id]: !e[schema.id] }))}
                  >
                    <ChevronRight
                      className={cn('size-3.5 transition', expanded[schema.id] && 'rotate-90')}
                    />
                    {schema.name}
                  </button>
                  {expanded[schema.id] &&
                    schema.tables.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedTable(t.id)
                          setSql(`SELECT * FROM ${t.id} LIMIT 25`)
                          setResults(FOUNDRY_TABLE_ROWS[t.id] ?? [])
                          setError(null)
                        }}
                        className={cn(
                          'ml-4 flex w-[calc(100%-1rem)] items-center gap-1.5 rounded-md px-2 py-1 text-left text-xs',
                          selectedTable === t.id
                            ? 'bg-white/10 text-white'
                            : 'text-white/55 hover:bg-white/5 hover:text-white',
                        )}
                      >
                        <Table2 className="size-3.5 shrink-0" />
                        <span className="truncate">{t.name}</span>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/10 bg-tlai-3">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <div className="text-sm text-white/80">SQL · {selectedTable}</div>
                <Button size="sm" onClick={runSql}>
                  <Play className="size-3.5" />
                  Run
                </Button>
              </div>
              <textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                spellCheck={false}
                className="min-h-[120px] flex-1 resize-none bg-transparent p-3 font-mono text-sm text-tlai-mint outline-none"
              />
            </div>
            <div className="h-56 overflow-auto rounded-lg border border-white/10 bg-tlai-3">
              {error && <div className="p-3 text-sm text-red-300">{error}</div>}
              {!error && results && (
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-tlai-4 text-white/50">
                    <tr>
                      {columns.map((c) => (
                        <th key={c} className="px-3 py-2 font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-t border-white/5">
                        {columns.map((c) => (
                          <td key={c} className="px-3 py-1.5 font-mono text-white/75">
                            {String(row[c] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!error && !results && (
                <div className="p-6 text-center text-sm text-white/40">No results</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside className="flex w-72 shrink-0 flex-col border-l border-white/10 bg-tlai-2">
        <div className="border-b border-white/10 px-4 py-3 text-sm font-medium">Foundry Chat</div>
        <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm">
          {chatLog.map((m, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg px-3 py-2',
                m.role === 'assistant'
                  ? 'bg-white/5 text-white/70'
                  : 'ml-4 bg-tlai-mint/15 text-tlai-mint',
              )}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-white/10 p-3">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChat()}
            placeholder="Ask Foundry…"
            className="h-9 flex-1 rounded-lg border border-white/10 bg-tlai-3 px-3 text-sm outline-none"
          />
          <Button size="sm" onClick={sendChat}>
            Send
          </Button>
        </div>
      </aside>
    </div>
  )
}
