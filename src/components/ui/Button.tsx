import { cn } from '../../lib/cn'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'icon'
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40',
        size === 'sm' && 'h-8 px-3',
        size === 'md' && 'h-9 px-3.5',
        size === 'icon' && 'size-8 p-0',
        variant === 'default' && 'bg-white text-black hover:bg-white/90',
        variant === 'outline' &&
          'border border-white/10 bg-white/5 text-white hover:bg-white/10',
        variant === 'ghost' && 'text-white/80 hover:bg-white/10 hover:text-white',
        variant === 'destructive' && 'bg-red-600/90 text-white hover:bg-red-600',
        className,
      )}
      {...props}
    />
  )
}
