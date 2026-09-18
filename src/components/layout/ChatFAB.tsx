import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { Button } from '../ui/Button'

export function ChatFAB() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div className="fixed right-6 bottom-20 z-40 flex h-[380px] w-[320px] flex-col overflow-hidden rounded-xl border border-white/10 bg-tlai-2 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="text-sm font-medium text-white">Tessera Chat</div>
              <div className="text-xs text-white/45">Prototype — UI only</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            <div className="rounded-lg bg-white/5 px-3 py-2 text-white/70">
              Hi — this chat shell mirrors the product FAB. Ask about dashboards, Foundry SQL, or Nexus
              mappings.
            </div>
            <div className="ml-auto max-w-[85%] rounded-lg bg-tlai-mint/15 px-3 py-2 text-tlai-mint">
              Show me vendor master quality
            </div>
            <div className="rounded-lg bg-white/5 px-3 py-2 text-white/70">
              Open <span className="text-white">Vendor Master Data</span> from Dashboards, or Run{' '}
              <code className="text-tlai-blue">SELECT * FROM vendor_master</code> in Foundry Console.
            </div>
          </div>
          <div className="border-t border-white/10 p-3">
            <input
              disabled
              placeholder="Message (demo only)"
              className="h-9 w-full rounded-lg border border-white/10 bg-tlai-3 px-3 text-sm text-white/50 outline-none"
            />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed right-6 bottom-6 z-40 flex size-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105"
        aria-label="Open Tessera chat"
      >
        <MessageSquare className="size-5" />
      </button>
    </>
  )
}
