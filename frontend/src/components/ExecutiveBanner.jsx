import { motion } from 'framer-motion'

const pageContext = {
  '/dashboard': {
    step: 'Situation Awareness',
    description: 'Real-time system monitoring across 47 services. 3 critical anomalies detected — AI predicts coordinated incident pattern with 96% confidence.',
    metrics: [
      { label: 'Anomalies', value: '3', color: 'text-cyan-400' },
      { label: 'Confidence', value: '96%', color: 'text-emerald-400' },
      { label: 'Exposure', value: '$288K', color: 'text-amber-400' },
    ],
    color: 'from-cyan-500/10 to-blue-600/5',
    border: 'border-cyan-500/15',
    accent: 'text-cyan-400',
  },
  '/intelligence': {
    step: 'Root Cause Analysis',
    description: 'Forensic investigation into payment pipeline failure. 8 failure modes across 4 services isolated with 94% correlation confidence.',
    metrics: [
      { label: 'Failures', value: '8', color: 'text-red-400' },
      { label: 'Services', value: '4', color: 'text-purple-400' },
      { label: 'Confidence', value: '94%', color: 'text-emerald-400' },
    ],
    color: 'from-purple-500/10 to-violet-600/5',
    border: 'border-purple-500/15',
    accent: 'text-purple-400',
  },
  '/time-machine': {
    step: 'Historical Patterns',
    description: '14 prior incidents reconstructed across 6 recurrence patterns. 91% match confidence — retry queue overflow pattern repeats every 4-6 weeks.',
    metrics: [
      { label: 'Incidents', value: '14', color: 'text-amber-400' },
      { label: 'Patterns', value: '6', color: 'text-cyan-400' },
      { label: 'Match', value: '91%', color: 'text-emerald-400' },
    ],
    color: 'from-amber-500/10 to-orange-600/5',
    border: 'border-amber-500/15',
    accent: 'text-amber-400',
  },
  '/knowledge-graph': {
    step: 'Dependency Impact',
    description: '10 services mapped across 4 teams. 7 propagation paths identified with 92% blast radius accuracy — $340K dependency exposure contained.',
    metrics: [
      { label: 'Services', value: '10', color: 'text-emerald-400' },
      { label: 'Paths', value: '7', color: 'text-cyan-400' },
      { label: 'Exposure', value: '$340K', color: 'text-amber-400' },
    ],
    color: 'from-emerald-500/10 to-green-600/5',
    border: 'border-emerald-500/15',
    accent: 'text-emerald-400',
  },
  '/cto-report': {
    step: 'Executive Decision',
    description: 'Build vs. no-build analysis with 320% projected ROI. 87% confidence across 6 risk vectors — $288K monthly savings at 1:4.7 risk/reward ratio.',
    metrics: [
      { label: 'ROI', value: '320%', color: 'text-emerald-400' },
      { label: 'Confidence', value: '87%', color: 'text-cyan-400' },
      { label: 'Savings', value: '$288K', color: 'text-violet-400' },
    ],
    color: 'from-violet-500/10 to-purple-600/5',
    border: 'border-violet-500/15',
    accent: 'text-violet-400',
  },
  '/execution-planner': {
    step: 'Action Plan',
    description: '42% execution completion across 3 sprints. 2 active blockers requiring executive attention — 74% sprint health with 82% quality score.',
    metrics: [
      { label: 'Complete', value: '42%', color: 'text-emerald-400' },
      { label: 'Blockers', value: '2', color: 'text-red-400' },
      { label: 'Health', value: '74%', color: 'text-amber-400' },
    ],
    color: 'from-rose-500/10 to-pink-600/5',
    border: 'border-rose-500/15',
    accent: 'text-rose-400',
  },
}

export default function ExecutiveBanner({ currentPage }) {
  const ctx = pageContext[currentPage]
  if (!ctx) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-lg border ${ctx.border} bg-gradient-to-r ${ctx.color} p-2 sm:p-3`}
    >
      <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-[8px] font-mono ${ctx.accent} uppercase tracking-wider font-semibold`}>
              {ctx.step}
            </span>
            <div className="h-3 w-px bg-white/[0.06]" />
            <span className="text-[7px] text-slate-600 font-mono">Executive Briefing</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed max-w-2xl">
            {ctx.description}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {(ctx.metrics || []).map((m, i) => (
            <div key={m.label} className={`flex items-center gap-1 rounded-md border border-white/[0.04] bg-white/[0.02] px-1.5 py-0.5 ${i > 0 ? 'hidden sm:flex' : ''}`}>
              <span className="text-[7px] text-slate-600 font-mono">{m.label}</span>
              <span className={`text-[9px] font-bold font-mono ${m.color}`}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
