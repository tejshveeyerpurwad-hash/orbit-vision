import { motion } from 'framer-motion'

const RECOMMENDATIONS = [
  { priority: 'critical', title: 'Circuit Breaker Gap in Payment Service', desc: 'Missing circuit breaker in payment retry loop has caused 3 incidents affecting 100K+ transactions', action: 'Deploy circuit breaker fix immediately', impact: '$2.4M revenue at risk', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: '#ef4444' },
  { priority: 'high', title: 'Redis Memory Configuration', desc: 'Memory usage at 82% with 340% increase over 24h. Eviction policy may activate within 6h.', action: 'Increase maxmemory and tune eviction policy', impact: 'Prevent cache miss avalanche', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', color: '#f59e0b' },
  { priority: 'high', title: 'Billing Worker Connection Pool', desc: 'Database connection pool at 85% utilization. Billing worker crash loop risk during peak traffic.', action: 'Increase pool size and add backpressure', impact: 'Avoid billing service degradation', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5', color: '#f59e0b' },
]

const priorityStyles = {
  critical: { border: 'border-red-500/20', bg: 'bg-red-500/[0.03]', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  high: { border: 'border-orange-500/20', bg: 'bg-orange-500/[0.03]', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  medium: { border: 'border-yellow-500/20', bg: 'bg-yellow-500/[0.03]', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
}

export default function AIRecommendations({ items = RECOMMENDATIONS }) {
  if (!items.length) return null
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
      <div className="rounded-xl border border-violet-500/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-3 sm:p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <svg className="h-3 w-3 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-white">AI Recommendations</h2>
          <span className="rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 text-[8px] font-mono font-bold">{items.length} items</span>
        </div>
        <div className="space-y-2">
          {items.map((rec, i) => {
            const ps = priorityStyles[rec.priority] || priorityStyles.medium
            return (
              <motion.div key={rec.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className={`rounded-lg border ${ps.border} ${ps.bg} px-3 py-2.5`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: `${rec.color}15` }}>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke={rec.color} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={rec.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-white truncate">{rec.title}</span>
                      <span className={`rounded px-1 py-px text-[7px] font-bold uppercase border ${ps.badge}`}>{rec.priority}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mb-1">{rec.desc}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-mono text-cyan-400">{rec.action}</span>
                      {rec.impact && (
                        <span className="text-[8px] font-mono text-slate-600">Impact: {rec.impact}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
