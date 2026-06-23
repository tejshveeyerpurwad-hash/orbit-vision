import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (typeof value === 'string') { setCount(value); return }
    const steps = 20
    const inc = value / steps
    let cur = 0
    const iv = setInterval(() => {
      cur += inc
      if (cur >= value) { setCount(value); clearInterval(iv) }
      else setCount(Math.floor(cur))
    }, 20)
    return () => clearInterval(iv)
  }, [value])
  return <>{count}</>
}

const DEFAULT = { revenueProtected: '$2.4M', costAvoided: '$840K', downtimePrevented: '47min', incidentsAnalyzed: 128, aiConfidence: 94, criticalRisks: 3, servicesMonitored: 47 }

export default function ExecutiveSummary({ metrics = DEFAULT, pageTitle, confidence = 94 }) {
  const items = [
    { label: 'Revenue Protected', value: metrics.revenueProtected, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#22c55e' },
    { label: 'Cost Avoided', value: metrics.costAvoided, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#06b6d4' },
    { label: 'Downtime Prevented', value: metrics.downtimePrevented, icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z', color: '#8b5cf6' },
  ]
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-3 sm:p-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{pageTitle || 'Executive Summary'}</h2>
              <p className="text-[9px] font-mono text-slate-600 tracking-wider uppercase">Business Impact Overview</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[9px] font-mono font-bold text-emerald-300">LIVE</span>
            </div>
            <div className="rounded-full border border-violet-500/20 bg-violet-500/[0.06] px-2.5 py-1">
              <span className="text-[9px] font-mono font-bold text-violet-300">{confidence}% AI</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${item.color}10` }}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={item.color} strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-500">{item.label}</p>
                <p className="text-sm font-bold text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Incidents Analyzed', value: metrics.incidentsAnalyzed, color: '#22d3ee' },
            { label: 'Services Monitored', value: metrics.servicesMonitored, color: '#34d399' },
            { label: 'Critical Risks', value: metrics.criticalRisks, color: '#ef4444' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 rounded-md border border-white/[0.04] bg-white/[0.02] px-2 py-1">
              <span className="text-[8px] font-mono font-bold" style={{ color: stat.color }}>{stat.value}</span>
              <span className="text-[8px] font-mono text-slate-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
