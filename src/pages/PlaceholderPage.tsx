import { useParams } from 'react-router-dom'

const LABELS: Record<string, string> = {
  home: 'Home',
  chat: 'Chat',
  build: 'Build',
  knowledge: 'Knowledge',
  modernize: 'Modernize',
  setup: 'Setup',
}

export function PlaceholderPage() {
  const { section } = useParams()
  const label = LABELS[section ?? ''] ?? section ?? 'Section'

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="text-2xl font-medium text-white">{label}</div>
      <p className="max-w-md text-sm text-white/50">
        This area is outside the Data section prototype. Use the Data rail item to explore Foundry,
        Harmonization, and Nexus.
      </p>
    </div>
  )
}
