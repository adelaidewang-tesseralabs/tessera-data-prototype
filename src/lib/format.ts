export function formatRelative(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatFullDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  })
}

const CHIP_COLORS = [
  { bg: 'rgba(142,122,255,0.2)', text: '#c4b8ff', border: 'rgba(142,122,255,0.35)' },
  { bg: 'rgba(2,119,70,0.25)', text: '#7ddea8', border: 'rgba(2,119,70,0.4)' },
  { bg: 'rgba(148,203,255,0.18)', text: '#94cbff', border: 'rgba(148,203,255,0.35)' },
  { bg: 'rgba(237,183,77,0.18)', text: '#edb74d', border: 'rgba(237,183,77,0.35)' },
  { bg: 'rgba(175,255,222,0.12)', text: '#afffde', border: 'rgba(175,255,222,0.3)' },
]

export function chipColor(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  return CHIP_COLORS[hash % CHIP_COLORS.length]
}
