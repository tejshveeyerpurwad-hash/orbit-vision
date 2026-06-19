const colors = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
  safe: 'bg-green-500/10 text-green-400 border-green-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  info: 'bg-brand/10 text-brand-light border-brand/20',
  pending: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  running: 'bg-brand/10 text-brand-light border-brand/20',
  passed: 'bg-green-500/10 text-green-400 border-green-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const dots = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  warning: 'bg-yellow-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
  safe: 'bg-green-500',
  success: 'bg-green-500',
  info: 'bg-brand',
  pending: 'bg-slate-500',
  error: 'bg-red-500',
  running: 'bg-brand animate-pulse-soft',
  passed: 'bg-green-500',
  failed: 'bg-red-500',
}

export default function StatusBadge({ status, label, dot = true }) {
  const c = colors[status] || colors.pending
  const d = dots[status] || dots.pending
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${c}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${d}`} />}
      {label || status}
    </span>
  )
}
