import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type IaOption = '1' | '2' | '2-1' | '3'

export const IA_OPTIONS: {
  id: IaOption
  label: string
  short: string
  home: string
}[] = [
  {
    id: '1',
    label: 'Option 1 · Check-first',
    short: 'Check-first',
    home: '/data-harmonization/checks',
  },
  {
    id: '2',
    label: 'Option 2 · Quality / Insights',
    short: 'Quality / Insights',
    home: '/data-harmonization/policies',
  },
  {
    id: '2-1',
    label: 'Option 2-1 · Policy-first',
    short: 'Policy-first',
    home: '/data-harmonization/policies',
  },
  {
    id: '3',
    label: 'Option 3 · Workstream',
    short: 'Workstream',
    home: '/data-harmonization/workstreams',
  },
]

const STORAGE_KEY = 'tessera-ia-option-v3'

type IaModeContextValue = {
  option: IaOption
  setOption: (option: IaOption) => void
  meta: (typeof IA_OPTIONS)[number]
}

const IaModeContext = createContext<IaModeContextValue | null>(null)

function readStored(): IaOption {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === '1' || v === '2' || v === '2-1' || v === '3') return v
  } catch {
    /* ignore */
  }
  return '2'
}

export function IaModeProvider({ children }: { children: ReactNode }) {
  const [option, setOptionState] = useState<IaOption>(() => readStored())

  const setOption = useCallback((next: IaOption) => {
    setOptionState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const meta = useMemo(
    () => IA_OPTIONS.find((o) => o.id === option) ?? IA_OPTIONS[1],
    [option],
  )

  const value = useMemo(() => ({ option, setOption, meta }), [option, setOption, meta])

  return createElement(IaModeContext.Provider, { value }, children)
}

export function useIaMode() {
  const ctx = useContext(IaModeContext)
  if (!ctx) throw new Error('useIaMode must be used within IaModeProvider')
  return ctx
}
