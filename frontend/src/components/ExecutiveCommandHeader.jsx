import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const investigation = {
  title: 'Payment Pipeline Failure — Forensic Analysis',
  description: 'System anomalies detected across 6 services with 96% AI confidence. 3 critical risks identified — payment error rate spike, Redis memory pressure, billing dependency timeout. Begin investigation to trace root cause and contain business exposure.',
  exposure: '$288K',
  confidence: '96%',
  affectedServices: '3 Critical',
  riskLevel: 'CRITICAL',
  riskColor: 'text-red-400',
  riskBg: 'bg-red-500/10 border-red-500/30',
  riskDot: 'bg-red-500',
  services: [
    { name: 'Payment Service', status: 'degraded', risk: 'Critical' },
    { name: 'Redis Cache', status: 'degraded', risk: 'Warning' },
    { name: 'Billing Service', status: 'warning', risk: 'Elevated' },
  ],
  metrics: [
    { label: 'Business Exposure', value: '$288K', format: '', color: 'text-amber-400', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', sub: 'Potential monthly revenue at risk', trend: 'up', trendColor: 'text-red-400' },
    { label: 'AI Confidence', value: '96%', format: '', color: 'text-emerald-400', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', sub: 'Pattern correlation confidence', trend: 'up', trendColor: 'text-emerald-400' },
    { label: 'Affected Services', value: '3 Critical', format: '', color: 'text-red-400', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', sub: 'Payment, Redis, Billing services', trend: 'up', trendColor: 'text-red-400' },
    { label: 'Risk Level', value: 'CRITICAL', format: '', color: 'text-red-400', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', sub: 'Requires immediate executive action', trend: 'up', trendColor: 'text-red-400' },
  ],
}

export default function ExecutiveCommandHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-white/[0.10] bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 shadow-2xl shadow-black/40"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/[0.03] blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-red-500/[0.02] blur-3xl" />

      <div className="relative z-10 p-3 sm:p-4 lg:p-5">
        {/* Status bar */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[8px] font-mono text-emerald-400/80 tracking-wider uppercase font-semibold">Live</span>
          <span className="h-3 w-px bg-white/[0.06]" />
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span className="text-[8px] font-mono text-cyan-400/80 tracking-wider uppercase font-semibold">AI Active</span>
          <span className="h-3 w-px bg-white/[0.06]" />
          <span className="flex items-center gap-1 text-[7px] font-mono text-slate-600">
            <svg className="h-2.5 w-2.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Uptime 99.97%
          </span>
          <span className="h-3 w-px bg-white/[0.06]" />
          <span className="text-[7px] font-mono text-slate-600">Analyses: 847</span>
          <span className="h-3 w-px bg-white/[0.06]" />
          <span className="text-[7px] font-mono text-slate-600">Accuracy: 94%</span>
        </div>

        {/* Investigation title + description */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex h-4 w-4 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10">
              <svg className="h-2.5 w-2.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-[9px] font-mono text-cyan-400 tracking-wider uppercase font-semibold">Active Investigation</span>
            <span className="ml-auto flex items-center gap-1 text-[7px] font-mono text-slate-600">
              <span className="h-1 w-1 rounded-full bg-cyan-500" />
              Case #OV-2024-0847
            </span>
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight mb-1">
            {investigation.title}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed max-w-3xl">
            {investigation.description}
          </p>
        </div>

        {/* Metric cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3">
          {investigation.metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-1 mb-1">
                <svg className={`h-2.5 w-2.5 ${m.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                </svg>
                <span className="text-[7px] font-mono text-slate-600 uppercase tracking-wider">{m.label}</span>
              </div>
              <div className={`text-base sm:text-lg font-bold font-mono ${m.color} leading-none mb-0.5`}>
                {m.value}
              </div>
              <div className="text-[7px] text-slate-600 leading-tight">{m.sub}</div>
              <div className={`flex items-center gap-0.5 mt-0.5 text-[7px] font-mono ${m.trendColor}`}>
                <span>{m.trend === 'up' ? '\u2191' : '\u2193'}</span>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA + affected services row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {investigation.services.map((s) => (
              <div key={s.name} className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[7px] font-mono ${
                s.risk === 'Critical' ? 'border-red-500/20 bg-red-500/[0.04] text-red-400' :
                s.risk === 'Warning' ? 'border-amber-500/20 bg-amber-500/[0.04] text-amber-400' :
                'border-yellow-500/15 bg-yellow-500/[0.03] text-yellow-400'
              }`}>
                <span className={`h-1 w-1 rounded-full ${
                  s.risk === 'Critical' ? 'bg-red-500' :
                  s.risk === 'Warning' ? 'bg-amber-500' : 'bg-yellow-500'
                }`} />
                {s.name}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              to="/intelligence"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Investigate Root Cause
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              to="/cto-report"
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-white/[0.06] px-2 py-1.5 text-[9px] text-slate-500 hover:text-slate-300 hover:border-white/[0.12] transition-all"
            >
              View Full Report
              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
