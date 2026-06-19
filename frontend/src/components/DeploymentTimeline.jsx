import { motion } from 'framer-motion'

const events = [
  { time: '09:24', action: 'Deploy v2.4.1 to staging', status: 'success', by: 'CI/CD' },
  { time: '09:26', action: 'Integration tests passed', status: 'success', by: 'Automated' },
  { time: '09:28', action: 'Canary deployment to 5%', status: 'success', by: 'Automated' },
  { time: '09:31', action: 'Payment retry risk detected', status: 'warning', by: 'ML Engine' },
  { time: '09:33', action: 'Rollback triggered', status: 'error', by: 'Auto-Protect' },
  { time: '09:35', action: 'Incident report generated', status: 'info', by: 'AI CTO' },
]

const dotColors = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-brand',
}

export default function DeploymentTimeline() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Deployment Timeline</h3>
      <div className="space-y-0">
        {events.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative flex gap-4 pb-4 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <div className={`h-2.5 w-2.5 rounded-full ${dotColors[e.status]} ring-4 ring-slate-900`} />
              {i < events.length - 1 && <div className="w-px flex-1 bg-white/[0.04] mt-1" />}
            </div>
            <div className="flex-1 min-w-0 -mt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-600">{e.time}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  e.status === 'success' ? 'bg-green-500/10 text-green-400' :
                  e.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                  e.status === 'error' ? 'bg-red-500/10 text-red-400' :
                  'bg-brand/10 text-brand-light'
                }`}>{e.status}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{e.action}</p>
              <span className="text-[9px] text-slate-700">{e.by}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
