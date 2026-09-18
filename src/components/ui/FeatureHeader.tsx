import { cn } from '../../lib/cn'

export function FeatureHeader({
  title,
  Icon,
  children,
}: {
  title: string
  Icon?: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
}) {
  return (
    <header>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5 text-white/80" />}
        <h1 className="text-xl font-medium text-white">{title}</h1>
      </div>
      {children && <p className="mt-2 text-sm leading-5 text-white/50">{children}</p>}
    </header>
  )
}

export function StatusPill({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const tone =
    status === 'COMPLETED' || status === 'Succeeded'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : status === 'FAILED' || status === 'Failed'
        ? 'bg-red-500/15 text-red-300 border-red-500/30'
        : status === 'RUNNING' || status === 'Running'
          ? 'bg-tlai-blue/15 text-tlai-blue border-tlai-blue/30'
          : 'bg-white/5 text-white/60 border-white/10'

  return (
    <span
      className={cn(
        'inline-flex rounded-md border px-2 py-0.5 text-xs font-medium capitalize',
        tone,
        className,
      )}
    >
      {status.toLowerCase()}
    </span>
  )
}
