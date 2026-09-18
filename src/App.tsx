import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store'
import { AppShell } from './components/layout/AppShell'
import { DashboardsPage } from './pages/DashboardsPage'
import { DashboardDetailPage } from './pages/DashboardDetailPage'
import { ExecutionDetailPage } from './pages/ExecutionDetailPage'
import { LibrariesPage } from './pages/LibrariesPage'
import { LibraryDetailPage } from './pages/LibraryDetailPage'
import { CoveragePage } from './pages/CoveragePage'
import { AdminPortalPage } from './pages/AdminPortalPage'
import { DataFoundryPage } from './pages/DataFoundryPage'
import { ExportsPage } from './pages/ExportsPage'
import { NexusListPage } from './pages/NexusListPage'
import { NexusBuilderPage } from './pages/NexusBuilderPage'
import { NexusLibraryPage } from './pages/NexusLibraryPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/data-harmonization" replace />} />
            <Route path="data-harmonization" element={<DashboardsPage />} />
            <Route path="data-harmonization/dashboard/:id" element={<DashboardDetailPage />} />
            <Route
              path="data-harmonization/dashboard/:id/execution/:checkId"
              element={<ExecutionDetailPage />}
            />
            <Route path="data-harmonization/libraries" element={<LibrariesPage />} />
            <Route path="data-harmonization/library/:libraryId" element={<LibraryDetailPage />} />
            <Route path="data-harmonization/coverage" element={<CoveragePage />} />
            <Route path="data-harmonization/admin" element={<AdminPortalPage />} />
            <Route path="data-foundry" element={<DataFoundryPage />} />
            <Route path="exports" element={<ExportsPage />} />
            <Route path="nexus" element={<NexusListPage />} />
            <Route path="nexus/library" element={<NexusLibraryPage />} />
            <Route path="nexus/:projectId" element={<NexusBuilderPage />} />
            <Route path="placeholder/:section" element={<PlaceholderPage />} />
            <Route path="*" element={<Navigate to="/data-harmonization" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
