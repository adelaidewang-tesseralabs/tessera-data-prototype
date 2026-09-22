import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  INITIAL_CHECKS,
  INITIAL_DASHBOARDS,
  INITIAL_EXECUTIONS,
  INITIAL_EXPORTS,
  INITIAL_FAVORITES,
  INITIAL_LIBRARIES,
  INITIAL_NEXUS_PROJECTS,
  INITIAL_WORKSTREAMS,
  type Dashboard,
  type DashboardType,
  type DataCheck,
  type Execution,
  type FoundryExport,
  type Library,
  type NexusProject,
  type Workstream,
} from './data/mock'

type Store = {
  dashboards: Dashboard[]
  favorites: string[]
  libraries: Library[]
  checks: DataCheck[]
  executions: Execution[]
  exports: FoundryExport[]
  nexusProjects: NexusProject[]
  workstreams: Workstream[]
  toggleFavorite: (id: string) => void
  createDashboard: (input: {
    name: string
    type: DashboardType
    workstream?: string
    description?: string
    linkedSuiteId?: string
  }) => Dashboard
  updateDashboard: (id: string, patch: Partial<Dashboard>) => void
  deleteDashboard: (id: string) => void
  createLibrary: (input: { name: string; workstream?: string; description?: string }) => Library
  updateLibrary: (id: string, patch: Partial<Library>) => void
  deleteLibrary: (id: string) => void
  simulateExecuteAll: (dashboardId: string) => void
  runChecks: (checkIds: string[]) => void
  createExport: (name: string) => void
  createNexusProject: (name: string, description?: string) => NexusProject
}

const StoreContext = createContext<Store | null>(null)

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [dashboards, setDashboards] = useState(INITIAL_DASHBOARDS)
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES)
  const [libraries, setLibraries] = useState(INITIAL_LIBRARIES)
  const [checks, setChecks] = useState(INITIAL_CHECKS)
  const [executions, setExecutions] = useState(INITIAL_EXECUTIONS)
  const [exports, setExports] = useState(INITIAL_EXPORTS)
  const [nexusProjects, setNexusProjects] = useState(INITIAL_NEXUS_PROJECTS)
  const [workstreams] = useState(INITIAL_WORKSTREAMS)

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const createDashboard = useCallback(
    (input: {
      name: string
      type: DashboardType
      workstream?: string
      description?: string
      linkedSuiteId?: string
    }) => {
      const dashboard: Dashboard = {
        id: uid('dash'),
        name: input.name,
        description: input.description,
        workstream: input.workstream || undefined,
        linkedSuiteId: input.linkedSuiteId,
        type: input.type,
        updatedAt: new Date().toISOString(),
        updatedBy: 'adelaide@tesseralabs.ai',
        qualityScore: null,
      }
      setDashboards((prev) => [dashboard, ...prev])
      return dashboard
    },
    [],
  )

  const updateDashboard = useCallback((id: string, patch: Partial<Dashboard>) => {
    setDashboards((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, ...patch, updatedAt: new Date().toISOString(), updatedBy: 'adelaide@tesseralabs.ai' }
          : d,
      ),
    )
  }, [])

  const deleteDashboard = useCallback((id: string) => {
    setDashboards((prev) => prev.filter((d) => d.id !== id))
    setFavorites((prev) => prev.filter((f) => f !== id))
  }, [])

  const createLibrary = useCallback(
    (input: { name: string; workstream?: string; description?: string }) => {
      const library: Library = {
        id: uid('lib'),
        name: input.name,
        description: input.description,
        workstream: input.workstream || undefined,
        checkCount: 0,
        updatedAt: new Date().toISOString(),
        updatedBy: 'adelaide@tesseralabs.ai',
      }
      setLibraries((prev) => [library, ...prev])
      return library
    },
    [],
  )

  const updateLibrary = useCallback((id: string, patch: Partial<Library>) => {
    setLibraries((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, ...patch, updatedAt: new Date().toISOString(), updatedBy: 'adelaide@tesseralabs.ai' }
          : l,
      ),
    )
  }, [])

  const deleteLibrary = useCallback((id: string) => {
    setLibraries((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const simulateExecuteAll = useCallback(
    (dashboardId: string) => {
      const dashboard = dashboards.find((d) => d.id === dashboardId)
      if (!dashboard) return
      const now = new Date().toISOString()
      setDashboards((prev) =>
        prev.map((d) =>
          d.id === dashboardId
            ? {
                ...d,
                lastExecution: now,
                qualityScore: d.qualityScore == null ? 92.4 : Math.min(99.9, d.qualityScore + 0.3),
                updatedAt: now,
              }
            : d,
        ),
      )
      setExecutions((prev) => [
        {
          id: uid('ex'),
          dashboardId,
          dashboardName: dashboard.name,
          checkName: 'Batch execute all',
          status: 'RUNNING',
          startedAt: now,
          durationMs: 0,
        },
        ...prev,
      ])
      window.setTimeout(() => {
        setExecutions((prev) =>
          prev.map((e, i) =>
            i === 0 && e.status === 'RUNNING'
              ? { ...e, status: 'COMPLETED', durationMs: 4200 }
              : e,
          ),
        )
      }, 1800)
    },
    [dashboards],
  )

  const runChecks = useCallback((checkIds: string[]) => {
    if (checkIds.length === 0) return
    const now = new Date().toISOString()
    setChecks((prev) =>
      prev.map((c) =>
        checkIds.includes(c.id) ? { ...c, status: 'RUNNING' as const, lastRun: now } : c,
      ),
    )
    setExecutions((prev) => [
      ...checkIds.map((id) => {
        const check = INITIAL_CHECKS.find((c) => c.id === id)
        return {
          id: uid('ex'),
          dashboardId: 'checks',
          dashboardName: 'Data Checks',
          checkName: check?.name ?? id,
          status: 'RUNNING' as const,
          startedAt: now,
          durationMs: 0,
        }
      }),
      ...prev,
    ])
    window.setTimeout(() => {
      setChecks((prev) =>
        prev.map((c) =>
          checkIds.includes(c.id)
            ? {
                ...c,
                status: 'COMPLETED' as const,
                issueCount: c.issueCount || Math.floor(Math.random() * 40),
                scanned: c.scanned || 1000 + Math.floor(Math.random() * 5000),
              }
            : c,
        ),
      )
      setExecutions((prev) =>
        prev.map((e) =>
          e.status === 'RUNNING' && e.dashboardId === 'checks'
            ? { ...e, status: 'COMPLETED' as const, durationMs: 1800 + Math.floor(Math.random() * 2000) }
            : e,
        ),
      )
    }, 1600)
  }, [])

  const createExport = useCallback((name: string) => {
    setExports((prev) => [
      {
        id: uid('exp'),
        name,
        destination: 'Dynamics 365',
        status: 'Running',
        createdAt: new Date().toISOString(),
        createdBy: 'adelaide@tesseralabs.ai',
      },
      ...prev,
    ])
  }, [])

  const createNexusProject = useCallback((name: string, description?: string) => {
    const project: NexusProject = {
      id: uid('nx'),
      name,
      description,
      ownership: 'owned',
      updatedAt: new Date().toISOString(),
      nodeCount: 3,
    }
    setNexusProjects((prev) => [project, ...prev])
    return project
  }, [])

  const value = useMemo(
    () => ({
      dashboards,
      favorites,
      libraries,
      checks,
      executions,
      exports,
      nexusProjects,
      workstreams,
      toggleFavorite,
      createDashboard,
      updateDashboard,
      deleteDashboard,
      createLibrary,
      updateLibrary,
      deleteLibrary,
      simulateExecuteAll,
      runChecks,
      createExport,
      createNexusProject,
    }),
    [
      dashboards,
      favorites,
      libraries,
      checks,
      executions,
      exports,
      nexusProjects,
      workstreams,
      toggleFavorite,
      createDashboard,
      updateDashboard,
      deleteDashboard,
      createLibrary,
      updateLibrary,
      deleteLibrary,
      simulateExecuteAll,
      runChecks,
      createExport,
      createNexusProject,
    ],
  )

  return createElement(StoreContext.Provider, { value }, children)
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
