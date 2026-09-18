export type DashboardType = 'HARMONIZATION' | 'ANALYTICS'
export type ExecutionStatus = 'COMPLETED' | 'PENDING' | 'RUNNING' | 'FAILED' | 'CANCELED' | 'SAVING'

export type Dashboard = {
  id: string
  name: string
  description?: string
  workstream?: string
  updatedAt: string
  updatedBy: string
  type: DashboardType
  lastExecution?: string
  qualityScore?: number | null
  favoriteVignette?: 'last_execution' | 'quality_score'
}

export type Library = {
  id: string
  name: string
  description?: string
  workstream?: string
  checkCount: number
  updatedAt: string
  updatedBy: string
}

export type DataCheck = {
  id: string
  name: string
  libraryId: string
  status: ExecutionStatus
  issueCount: number
  scanned: number
  lastRun?: string
}

export type Execution = {
  id: string
  dashboardId: string
  dashboardName: string
  checkName: string
  status: ExecutionStatus
  startedAt: string
  durationMs: number
}

export type FoundryExport = {
  id: string
  name: string
  destination: string
  status: 'Succeeded' | 'Running' | 'Failed'
  createdAt: string
  createdBy: string
}

export type NexusProject = {
  id: string
  name: string
  description?: string
  ownership: 'owned' | 'shared'
  updatedAt: string
  nodeCount: number
}

export type NexusTemplate = {
  id: string
  name: string
  domain: string
  description: string
}

const emails = [
  'arihant@tesseralabs.ai',
  'neeraj@tesseralabs.ai',
  'adelaide@tesseralabs.ai',
  'olivier@tesseralabs.ai',
  'sophia@tesseralabs.ai',
]

const workstreams = ['Olivier', 'SAP BP Migration', 'Vendor MDM', 'Finance Close', undefined]

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function hoursAgo(n: number) {
  const d = new Date()
  d.setHours(d.getHours() - n)
  return d.toISOString()
}

const seededNames = [
  'DH MCP Tool Test - Harmonization Throwaway',
  'test olivier',
  'test_dh',
  'Vendor Master Data',
  'Testing- Adelaide',
  'Customer BP Quality',
  'Material Master Sync',
  'AP Open Items Check',
  'GL Account Harmonization',
  'Plant Data Completeness',
  'Bank Master Validation',
  'Cost Center Mapping QA',
  'Employee Org Integrity',
  'Sales Order Completeness',
  'Purchase Org Checks',
]

export const INITIAL_DASHBOARDS: Dashboard[] = [
  {
    id: 'dash-vendor',
    name: 'Vendor Master Data',
    description: 'Core vendor master quality across ECC and S/4',
    workstream: 'Vendor MDM',
    updatedAt: hoursAgo(14),
    updatedBy: emails[0],
    type: 'HARMONIZATION',
    lastExecution: '2026-08-12T06:39:39.000Z',
    qualityScore: 94.2,
    favoriteVignette: 'last_execution',
  },
  {
    id: 'dash-adelaide',
    name: 'Testing- Adelaide',
    description: 'Sandbox dashboard for vignette experiments',
    workstream: 'Olivier',
    updatedAt: hoursAgo(8),
    updatedBy: emails[2],
    type: 'HARMONIZATION',
    qualityScore: null,
    favoriteVignette: 'quality_score',
  },
  {
    id: 'dash-mcp',
    name: 'DH MCP Tool Test - Harmonization Throwaway',
    updatedAt: hoursAgo(12),
    updatedBy: emails[0],
    type: 'HARMONIZATION',
  },
  {
    id: 'dash-olivier',
    name: 'test olivier',
    workstream: 'Olivier',
    updatedAt: daysAgo(2),
    updatedBy: emails[3],
    type: 'HARMONIZATION',
    qualityScore: 88.1,
  },
  {
    id: 'dash-testdh',
    name: 'test_dh',
    workstream: 'SAP BP Migration',
    updatedAt: daysAgo(2),
    updatedBy: emails[1],
    type: 'HARMONIZATION',
    qualityScore: 91.5,
  },
  ...Array.from({ length: 45 }, (_, i) => {
    const name = seededNames[i % seededNames.length]
    const n = i + 1
    return {
      id: `dash-${n}`,
      name: i < seededNames.length ? name : `${name} ${Math.floor(i / seededNames.length) + 1}`,
      description: i % 3 === 0 ? 'Automated data quality dashboard' : undefined,
      workstream: workstreams[i % workstreams.length],
      updatedAt: daysAgo((i % 20) + 1),
      updatedBy: emails[i % emails.length],
      type: (i % 7 === 0 ? 'ANALYTICS' : 'HARMONIZATION') as DashboardType,
      qualityScore: i % 4 === 0 ? null : 80 + (i % 18) + (i % 10) / 10,
      lastExecution: i % 5 === 0 ? daysAgo(i % 10) : undefined,
    }
  }),
]

export const INITIAL_FAVORITES = ['dash-vendor', 'dash-adelaide']

export const INITIAL_LIBRARIES: Library[] = [
  {
    id: 'lib-vendor',
    name: 'Vendor Checks',
    description: 'Reusable vendor master data checks',
    workstream: 'Vendor MDM',
    checkCount: 18,
    updatedAt: daysAgo(1),
    updatedBy: emails[0],
  },
  {
    id: 'lib-bp',
    name: 'Business Partner Migration',
    description: 'SAP BP migration validation suite',
    workstream: 'SAP BP Migration',
    checkCount: 42,
    updatedAt: daysAgo(3),
    updatedBy: emails[1],
  },
  {
    id: 'lib-finance',
    name: 'Finance Close Pack',
    workstream: 'Finance Close',
    checkCount: 27,
    updatedAt: daysAgo(5),
    updatedBy: emails[3],
  },
  {
    id: 'lib-olivier',
    name: 'Olivier Scratch Library',
    workstream: 'Olivier',
    checkCount: 9,
    updatedAt: hoursAgo(6),
    updatedBy: emails[3],
  },
  {
    id: 'lib-material',
    name: 'Material Master',
    checkCount: 33,
    updatedAt: daysAgo(8),
    updatedBy: emails[4],
  },
]

export const INITIAL_CHECKS: DataCheck[] = [
  {
    id: 'chk-1',
    name: 'Vendor name not blank',
    libraryId: 'lib-vendor',
    status: 'COMPLETED',
    issueCount: 12,
    scanned: 15420,
    lastRun: hoursAgo(4),
  },
  {
    id: 'chk-2',
    name: 'Tax ID format valid',
    libraryId: 'lib-vendor',
    status: 'COMPLETED',
    issueCount: 48,
    scanned: 15420,
    lastRun: hoursAgo(4),
  },
  {
    id: 'chk-3',
    name: 'Payment terms populated',
    libraryId: 'lib-vendor',
    status: 'FAILED',
    issueCount: 210,
    scanned: 15420,
    lastRun: hoursAgo(5),
  },
  {
    id: 'chk-4',
    name: 'BP role completeness',
    libraryId: 'lib-bp',
    status: 'COMPLETED',
    issueCount: 3,
    scanned: 8200,
    lastRun: daysAgo(1),
  },
  {
    id: 'chk-5',
    name: 'Bank account country match',
    libraryId: 'lib-bp',
    status: 'RUNNING',
    issueCount: 0,
    scanned: 0,
  },
  {
    id: 'chk-6',
    name: 'GL account type consistency',
    libraryId: 'lib-finance',
    status: 'COMPLETED',
    issueCount: 7,
    scanned: 4100,
    lastRun: daysAgo(2),
  },
  {
    id: 'chk-7',
    name: 'Cost center owner assigned',
    libraryId: 'lib-finance',
    status: 'PENDING',
    issueCount: 0,
    scanned: 0,
  },
  {
    id: 'chk-8',
    name: 'Material description length',
    libraryId: 'lib-material',
    status: 'COMPLETED',
    issueCount: 91,
    scanned: 22000,
    lastRun: daysAgo(3),
  },
]

export const INITIAL_EXECUTIONS: Execution[] = Array.from({ length: 28 }, (_, i) => ({
  id: `ex-${i + 1}`,
  dashboardId: i % 2 === 0 ? 'dash-vendor' : 'dash-adelaide',
  dashboardName: i % 2 === 0 ? 'Vendor Master Data' : 'Testing- Adelaide',
  checkName: INITIAL_CHECKS[i % INITIAL_CHECKS.length].name,
  status: (['COMPLETED', 'FAILED', 'RUNNING', 'COMPLETED', 'CANCELED'] as ExecutionStatus[])[i % 5],
  startedAt: hoursAgo(i + 1),
  durationMs: 1200 + i * 340,
}))

export const FOUNDRY_CATALOG = [
  {
    id: 'schema-erp',
    name: 'erp',
    tables: [
      { id: 'vendor_master', name: 'vendor_master', rows: 15420 },
      { id: 'customer_bp', name: 'customer_bp', rows: 8200 },
      { id: 'material_master', name: 'material_master', rows: 22000 },
      { id: 'gl_accounts', name: 'gl_accounts', rows: 4100 },
    ],
  },
  {
    id: 'schema-lake',
    name: 'lake',
    tables: [
      { id: 'dh_results', name: 'dh_execution_results', rows: 98210 },
      { id: 'exports_log', name: 'exports_log', rows: 412 },
    ],
  },
]

export const FOUNDRY_TABLE_ROWS: Record<string, Record<string, string | number>[]> = {
  vendor_master: [
    { vendor_id: 'V10001', name: 'Acme Supplies', country: 'US', tax_id: '12-3456789', payment_terms: 'NET30' },
    { vendor_id: 'V10002', name: 'Nordic Parts', country: 'NO', tax_id: 'NO998877', payment_terms: 'NET45' },
    { vendor_id: 'V10003', name: 'Riverbank Co', country: 'DE', tax_id: 'DE123456789', payment_terms: '' },
    { vendor_id: 'V10004', name: 'Pacific Tools', country: 'US', tax_id: '98-7654321', payment_terms: 'NET15' },
    { vendor_id: 'V10005', name: 'Sakura Trading', country: 'JP', tax_id: 'JP445566', payment_terms: 'NET30' },
  ],
  customer_bp: [
    { bp_id: 'C2001', name: 'Contoso Ltd', role: 'FLCU01', country: 'US' },
    { bp_id: 'C2002', name: 'Fabrikam GmbH', role: 'FLCU00', country: 'DE' },
    { bp_id: 'C2003', name: 'Adventure Works', role: '', country: 'US' },
  ],
  material_master: [
    { matnr: 'M-100', description: 'Hex bolt M8', plant: '1000', type: 'ROH' },
    { matnr: 'M-101', description: 'Washer 8mm', plant: '1000', type: 'ROH' },
    { matnr: 'M-200', description: 'Finished assembly A', plant: '2000', type: 'FERT' },
  ],
  gl_accounts: [
    { saknr: '400000', txt20: 'Revenue', ktoks: 'ERL' },
    { saknr: '500000', txt20: 'COGS', ktoks: 'ERG' },
  ],
  dh_results: [
    { check_id: 'chk-1', issues: 12, scanned: 15420, run_at: '2026-09-18' },
    { check_id: 'chk-2', issues: 48, scanned: 15420, run_at: '2026-09-18' },
  ],
  exports_log: [
    { export_id: 'exp-1', status: 'Succeeded', destination: 'Dynamics 365' },
  ],
}

export const INITIAL_EXPORTS: FoundryExport[] = [
  {
    id: 'exp-1',
    name: 'Vendor master → D365',
    destination: 'Dynamics 365',
    status: 'Succeeded',
    createdAt: daysAgo(1),
    createdBy: emails[0],
  },
  {
    id: 'exp-2',
    name: 'BP sync nightly',
    destination: 'Dynamics 365',
    status: 'Running',
    createdAt: hoursAgo(2),
    createdBy: emails[1],
  },
  {
    id: 'exp-3',
    name: 'GL accounts push',
    destination: 'Dynamics 365',
    status: 'Failed',
    createdAt: daysAgo(4),
    createdBy: emails[2],
  },
]

export const INITIAL_NEXUS_PROJECTS: NexusProject[] = [
  {
    id: 'nx-1',
    name: 'ECC → S/4 Vendor Mapping',
    description: 'Field-level vendor master mapping',
    ownership: 'owned',
    updatedAt: hoursAgo(3),
    nodeCount: 12,
  },
  {
    id: 'nx-2',
    name: 'BP Customer Roles',
    description: 'Role and partner function mapping',
    ownership: 'owned',
    updatedAt: daysAgo(2),
    nodeCount: 8,
  },
  {
    id: 'nx-3',
    name: 'Material Plant Extension',
    ownership: 'shared',
    updatedAt: daysAgo(5),
    nodeCount: 15,
  },
  {
    id: 'nx-4',
    name: 'Finance Chart of Accounts',
    description: 'Shared template from Contoso',
    ownership: 'shared',
    updatedAt: daysAgo(9),
    nodeCount: 6,
  },
  {
    id: 'nx-5',
    name: 'Olivier throwaway map',
    ownership: 'owned',
    updatedAt: hoursAgo(20),
    nodeCount: 4,
  },
]

export const INITIAL_NEXUS_TEMPLATES: NexusTemplate[] = [
  {
    id: 'tpl-1',
    name: 'SAP Vendor Master Standard',
    domain: 'MDM',
    description: 'Canonical vendor fields from ECC to S/4.',
  },
  {
    id: 'tpl-2',
    name: 'Business Partner Customer',
    domain: 'BP',
    description: 'Customer BP roles, addresses, and bank details.',
  },
  {
    id: 'tpl-3',
    name: 'Material Master Core',
    domain: 'MDM',
    description: 'Basic data, plant, and MRP views.',
  },
  {
    id: 'tpl-4',
    name: 'GL Account Mapping',
    domain: 'Finance',
    description: 'Chart of accounts crosswalk template.',
  },
  {
    id: 'tpl-5',
    name: 'Cost Center Hierarchy',
    domain: 'Finance',
    description: 'Controlling area cost center structure.',
  },
  {
    id: 'tpl-6',
    name: 'Purchase Org Setup',
    domain: 'Procurement',
    description: 'Purchasing organization and group mapping.',
  },
]

export const DASHBOARD_CHART_DATA = [
  { name: 'Name', issues: 12, scanned: 3200 },
  { name: 'Tax ID', issues: 48, scanned: 3200 },
  { name: 'Payment', issues: 210, scanned: 3200 },
  { name: 'Bank', issues: 33, scanned: 3200 },
  { name: 'Address', issues: 17, scanned: 3200 },
  { name: 'Contact', issues: 9, scanned: 3200 },
]

export const QUALITY_TREND = [
  { week: 'W1', score: 86 },
  { week: 'W2', score: 88 },
  { week: 'W3', score: 87 },
  { week: 'W4', score: 91 },
  { week: 'W5', score: 93 },
  { week: 'W6', score: 94 },
]
