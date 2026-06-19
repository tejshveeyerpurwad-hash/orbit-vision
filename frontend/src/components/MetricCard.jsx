import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'

export default function MetricCard({ title, metrics, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5"
    >
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {metrics.map((m, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {m.dot && <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />}
              <span className="text-xs text-slate-400">{m.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {m.badge ? (
                <StatusBadge status={m.badge} label={m.value} />
              ) : (
                <span className={`text-xs font-semibold ${m.color || 'text-white'}`}>{m.value}</span>
              )}
              {m.trend && <span className={`text-[10px] ${m.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{m.trend}</span>}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
