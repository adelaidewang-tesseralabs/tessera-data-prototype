import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { StoreProvider } from './store'
import { IaModeProvider } from './context/IaModeContext'
import { AppShell } from './components/layout/AppShell'
import { DashboardsPage } from './pages/DashboardsPage'
import { DashboardDetailPage } from './pages/DashboardDetailPage'
import { ExecutionDetailPage } from './pages/ExecutionDetailPage'
import { LibrariesPage } from './pages/LibrariesPage'
import { LibraryDetailPage } from './pages/LibraryDetailPage'
import { DataChecksPage } from './pages/DataChecksPage'
import { RunsPage } from './pages/RunsPage'
import { WorkstreamsPage } from './pages/WorkstreamsPage'
import { WorkstreamWorkspacePage } from './pages/WorkstreamWorkspacePage'
import { CoveragePage } from './pages/CoveragePage'
import { AdminPortalPage } from './pages/AdminPortalPage'
import { DataFoundryPage } from './pages/DataFoundryPage'
import { ExportsPage } from './pages/ExportsPage'
import { NexusListPage } from './pages/NexusListPage'
import { NexusBuilderPage } from './pages/NexusBuilderPage'
import { NexusLibraryPage } from './pages/NexusLibraryPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

function PolicyLegacyRedirect() {
  const { libraryId } = useParams()
  return <Navigate to={`/data-harmonization/policy/${libraryId}`} replace />
}

export default function App() {
  return (
    <StoreProvider>
      <IaModeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/data-harmonization/policies" replace />} />
              <Route path="data-harmonization" element={<DashboardsPage />} />
              <Route path="data-harmonization/checks" element={<DataChecksPage />} />
              <Route path="data-harmonization/logs" element={<RunsPage />} />
              <Route
                path="data-harmonization/runs"
                element={<Navigate to="/data-harmonization/logs" replace />}
              />
              <Route path="data-harmonization/policies" element={<LibrariesPage />} />
              <Route
                path="data-harmonization/policy/:libraryId"
                element={<LibraryDetailPage />}
              />
              <Route
                path="data-harmonization/templates"
                element={<Navigate to="/data-harmonization/policies" replace />}
              />
              <Route
                path="data-harmonization/template/:libraryId"
                element={<PolicyLegacyRedirect />}
              />
              <Route
                path="data-harmonization/suites"
                element={<Navigate to="/data-harmonization/policies" replace />}
              />
              <Route
                path="data-harmonization/suite/:libraryId"
                element={<PolicyLegacyRedirect />}
              />
              <Route
                path="data-harmonization/libraries"
                element={<Navigate to="/data-harmonization/policies" replace />}
              />
              <Route
                path="data-harmonization/library/:libraryId"
                element={<PolicyLegacyRedirect />}
              />
              <Route path="data-harmonization/workstreams" element={<WorkstreamsPage />} />
              <Route
                path="data-harmonization/workstreams/:workstreamId"
                element={<WorkstreamWorkspacePage />}
              />
              <Route path="data-harmonization/dashboard/:id" element={<DashboardDetailPage />} />
              <Route
                path="data-harmonization/dashboard/:id/execution/:checkId"
                element={<ExecutionDetailPage />}
              />
              <Route path="data-harmonization/coverage" element={<CoveragePage />} />
              <Route path="data-harmonization/admin" element={<AdminPortalPage />} />
              <Route path="data-foundry" element={<DataFoundryPage />} />
              <Route path="exports" element={<ExportsPage />} />
              <Route path="nexus" element={<NexusListPage />} />
              <Route path="nexus/library" element={<NexusLibraryPage />} />
              <Route path="nexus/:projectId" element={<NexusBuilderPage />} />
              <Route path="placeholder/:section" element={<PlaceholderPage />} />
              <Route path="*" element={<Navigate to="/data-harmonization/policies" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </IaModeProvider>
    </StoreProvider>
  )
}
