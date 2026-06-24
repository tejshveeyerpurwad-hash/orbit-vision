import { motion } from 'framer-motion'
import { ORBIT_INTELLIGENCE } from '../utils/intelligenceProof'

const statItems = [
  { key: 'totalNodes', label: 'Total Nodes', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: 'from-cyan-500/20 to-cyan-500/5', textColor: 'text-cyan-300', border: 'border-cyan-500/20' },
  { key: 'totalEdges', label: 'Total Edges', icon: 'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25', color: 'from-violet-500/20 to-violet-500/5', textColor: 'text-violet-300', border: 'border-violet-500/20' },
  { key: 'serviceRelationships', label: 'Service Relationships', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', color: 'from-emerald-500/20 to-emerald-500/5', textColor: 'text-emerald-300', border: 'border-emerald-500/20' },
  { key: 'dependencyPaths', label: 'Dependency Paths', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5', color: 'from-amber-500/20 to-amber-500/5', textColor: 'text-amber-300', border: 'border-amber-500/20' },
  { key: 'riskConnections', label: 'Risk Connections', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: 'from-red-500/20 to-red-500/5', textColor: 'text-red-300', border: 'border-red-500/20' },
  { key: 'correlationLinks', label: 'Correlation Links', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: 'from-blue-500/20 to-blue-500/5', textColor: 'text-blue-300', border: 'border-blue-500/20' },
]

export default function KnowledgeGraphEvidence({ compact, className = '' }) {
  const kg = ORBIT_INTELLIGENCE.knowledgeGraph

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/80 to-slate-950/80 ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/[0.03] blur-3xl" />

      <div className="relative z-10 p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white">Orbit Knowledge Graph</h2>
            <p className="text-[8px] font-mono text-slate-500">{kg.totalNodes.toLocaleString()} nodes · {kg.totalEdges.toLocaleString()} edges · Updated {new Date(kg.lastUpdated).toLocaleTimeString()}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-2 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[7px] font-mono font-bold text-emerald-300">LIVE</span>
          </div>
        </div>

        <div className={`grid ${compact ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'} gap-2 sm:gap-3`}>
          {statItems.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-xl border ${item.border} bg-gradient-to-br ${item.color} p-3 group hover:scale-[1.03] transition-all duration-300`}
            >
              <div className="absolute -top-6 -right-6 h-10 w-10 rounded-full bg-white/[0.03] pointer-events-none" />
              <div className="flex items-center gap-1.5 mb-1.5">
                <svg className={`h-3 w-3 ${item.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: `${item.textColor}CC` }}>{item.label}</span>
              </div>
              <span className={`text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight ${item.textColor} of-present-kpi`}>
                {kg[item.key].toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
