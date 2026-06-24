import { motion } from 'framer-motion'

const modules = [
  {
    title: 'Knowledge Graph',
    desc: 'Real-time dependency mapping across all 47 services. Every connection, every dependency, every single point of failure visualized in an interactive graph.',
    icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-400',
  },
  {
    title: 'Dependency Intelligence',
    desc: 'AI-powered dependency analysis that identifies critical chains, single points of failure, and recommends redundancy improvements before incidents occur.',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
    gradient: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/20',
    accent: 'text-violet-400',
  },
  {
    title: 'Blast Radius Analysis',
    desc: 'Predicts exactly which services will fail, in what order, and how fast — down to the second. Enables proactive containment before cascade failures spread.',
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    gradient: 'from-red-500/20 to-red-500/5',
    border: 'border-red-500/20',
    accent: 'text-red-400',
  },
  {
    title: 'Historical Pattern Discovery',
    desc: 'Machine learning over 1,847 similar incidents across 312 engineering teams. Identifies recurring failure patterns before they cause production outages.',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/20',
    accent: 'text-amber-400',
  },
  {
    title: 'Executive Decision Support',
    desc: 'Transforms technical incidents into business impact with dollar figures, customer counts, and ROI analysis. Ready for boardroom presentation in seconds.',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/20',
    accent: 'text-cyan-400',
  },
]

export default function OrbitIntelligenceProof({ compact }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/80 to-slate-950/80"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/[0.03] blur-3xl" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">Orbit Intelligence Engine</h2>
            <p className="text-[9px] font-mono text-slate-500">5 core capabilities powering every feature</p>
          </div>
        </div>

        <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'} gap-3 mt-4`}>
          {modules.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-xl border ${m.border} bg-gradient-to-br ${m.gradient} p-3 sm:p-4 group hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-white/[0.03] pointer-events-none" />
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${m.accent} bg-white/[0.04]`}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                  </svg>
                </div>
                <span className={`text-[10px] sm:text-xs font-bold ${m.accent}`}>{m.title}</span>
              </div>
              <p className={`text-[8px] sm:text-[9px] text-slate-400 leading-relaxed ${compact ? 'line-clamp-2' : ''}`}>
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
