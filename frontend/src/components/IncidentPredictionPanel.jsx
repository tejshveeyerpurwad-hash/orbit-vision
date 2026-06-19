import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const metrics = [
  { label: 'Risk Score', value: 72, max: 100, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { label: 'Confidence', value: 91, max: 100, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { label: 'Probability', value: 82, max: 100, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { label: 'Readiness', value: 74, max: 100, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
]

function AnimatedBar({ value, max, color, bg, label, delay }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW((value / max) * 100), delay)
    return () => clearTimeout(t)
  }, [value, max, delay])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">{label}</span>
        <span className="text-[11px] font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${w}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: delay / 1000 }}
          className="h-full rounded-full transition-all"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
        />
      </div>
    </div>
  )
}

export default function IncidentPredictionPanel({ compact }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
        </div>
        <span className="text-xs font-semibold text-slate-300">Live Incident Prediction</span>
        <span className="text-[9px] text-slate-600 ml-auto">Auto-refreshing</span>
      </div>

      <div className={`grid ${compact ? 'gap-3' : 'gap-4 sm:grid-cols-2'}`}>
        {metrics.map((m, i) => (
          <AnimatedBar key={m.label} {...m} delay={200 + i * 150} />
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
        <span className="text-slate-600">Overall Risk Assessment</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-soft" />
          <span className="text-red-400 font-semibold">High — Mitigation Required</span>
        </span>
      </div>
    </div>
  )
}
