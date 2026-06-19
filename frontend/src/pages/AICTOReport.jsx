import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

const metrics = [
  { label: 'Release Readiness', value: '74%', trend: '↑ 12%', color: 'text-yellow-400' },
  { label: 'Team Velocity', value: '183 pts', trend: '↑ 8%', color: 'text-green-400' },
  { label: 'Open Incidents', value: '3', trend: '↓ 2', color: 'text-red-400' },
  { label: 'Code Coverage', value: '87%', trend: '↑ 3%', color: 'text-green-400' },
]

const teams = [
  { name: 'Payments', risk: 'high', score: 42, incidents: 4, members: '8 engineers', velocity: 85, impact: '$12K/hr potential loss', lead: '@alice', focus: 'Retry logic, circuit breaker' },
  { name: 'Billing', risk: 'medium', score: 68, incidents: 2, members: '5 engineers', velocity: 72, impact: '$5K/hr potential loss', lead: '@bob', focus: 'Invoice reconciliation' },
  { name: 'Auth', risk: 'low', score: 91, incidents: 0, members: '6 engineers', velocity: 91, impact: '$2K/hr potential loss', lead: '@carol', focus: 'Session management' },
  { name: 'Notifications', risk: 'medium', score: 74, incidents: 1, members: '4 engineers', velocity: 64, impact: '$1K/hr potential loss', lead: '@dave', focus: 'Webhook delivery' },
]

const actions = [
  { priority: 'P0', action: 'Add circuit breaker to payment retry logic', owner: 'Payments', deadline: 'This sprint', cost: 8000, impact: 'Prevents $12K/hr outage', roi: 150 },
  { priority: 'P1', action: 'Increase billing worker memory limit', owner: 'Billing', deadline: 'Next sprint', cost: 2000, impact: 'Prevents $5K/hr degradation', roi: 250 },
  { priority: 'P2', action: 'Add idempotency keys to webhook delivery', owner: 'Notifications', deadline: 'Backlog', cost: 4000, impact: 'Prevents data loss incidents', roi: 75 },
]

function AnimatedBar({ value, maxValue, label, sublabel, color = 'bg-brand', delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(Math.min(value / maxValue * 100, 100)), 300 + delay); return () => clearTimeout(t) }, [value, maxValue, delay])
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
        <span className="text-[10px] font-semibold text-white">{sublabel}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  )
}

function RiskMatrix() {
  const matrix = [
    { likelihood: 'Very Likely', impact: 'Critical', severity: 'critical', row: 0, col: 0 },
    { likelihood: 'Likely', impact: 'High', severity: 'high', row: 1, col: 1 },
    { likelihood: 'Possible', impact: 'Medium', severity: 'medium', row: 2, col: 2 },
    { likelihood: 'Unlikely', impact: 'Low', severity: 'low', row: 3, col: 3 },
  ]
  const sevColors = { critical: 'bg-red-500/20 border-red-500/40 text-red-400', high: 'bg-orange-500/15 border-orange-500/30 text-orange-400', medium: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', low: 'bg-green-500/10 border-green-500/20 text-green-400' }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {matrix.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className={`rounded-lg border p-3 text-center ${sevColors[m.severity]}`}>
          <div className="text-[18px] font-bold mb-0.5">{m.severity === 'critical' ? '🔴' : m.severity === 'high' ? '🟠' : m.severity === 'medium' ? '🟡' : '🟢'}</div>
          <div className="text-[10px] font-semibold uppercase">{m.severity}</div>
          <div className="text-[8px] opacity-70">{m.likelihood} · {m.impact}</div>
        </motion.div>
      ))}
    </div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function AICTOReport() {
  const [expandedTeam, setExpandedTeam] = useState(null)
  const [showExport, setShowExport] = useState(false)

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">AI CTO Report</h1>
            <p className="mt-1 text-sm text-slate-500">Executive summary with business impact, engineering analysis, and cost optimization</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="success" label="Q3 2026" />
            <button onClick={() => setShowExport(!showExport)} className="relative inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] text-slate-500 hover:border-white/[0.12] hover:text-slate-300 transition-all">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              Export
            </button>
            {showExport && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full right-0 mt-1 z-10 w-36 rounded-lg border border-white/[0.06] bg-slate-900 p-1 shadow-xl">
                {['PDF Report', 'JSON Data', 'Slack Share'].map(e => (
                  <button key={e} className="w-full rounded-md px-3 py-1.5 text-left text-[10px] text-slate-400 hover:bg-white/[0.04] hover:text-white transition-colors">{e}</button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (<StatCard key={m.label} label={m.label} value={m.value} color={m.color} trend={m.trend} />))}
        </motion.div>

        {/* Executive Summary */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <svg className="h-3 w-3 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
            </div>
            <h3 className="text-sm font-semibold text-white">Executive Summary</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <p>Analysis of <span className="text-slate-200 font-medium">Add payment retry support</span> across 4 engineering teams reveals <span className="text-yellow-400">moderate release risk</span>. The Payments team carries the highest risk exposure due to 4 open incidents and a velocity score of 85 against a risk score of 42.</p>
            <p>Estimated business impact of unmitigated deployment: <span className="text-red-400 font-medium">$12K/hr</span> in potential payment processing losses. Recommended actions prioritized by ROI in the mitigation plan below. Total mitigation investment: <span className="text-green-400 font-medium">$14,000</span> with projected <span className="text-brand-light font-medium">320% ROI</span> within 30 days.</p>
          </div>
        </motion.div>

        {/* Business + Engineering Impact */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Business Impact Analysis</h3>
            <div className="space-y-4">
              <AnimatedBar value={12} maxValue={12} label="Revenue at Risk" sublabel="$12,000/hr" color="bg-gradient-to-r from-red-500 to-red-600" delay={0} />
              <AnimatedBar value={100} maxValue={100} label="Customer Impact" sublabel="All payment flows" color="bg-gradient-to-r from-orange-500 to-red-500" delay={100} />
              <AnimatedBar value={75} maxValue={100} label="SLA Violation Risk" sublabel="45 min downtime" color="bg-gradient-to-r from-amber-500 to-orange-500" delay={200} />
              <AnimatedBar value={60} maxValue={100} label="Regulatory Impact" sublabel="PCI compliance" color="bg-gradient-to-r from-yellow-500 to-amber-500" delay={300} />
            </div>
          </motion.div>

          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Engineering Impact Analysis</h3>
            <div className="space-y-4">
              <AnimatedBar value={5} maxValue={5} label="Affected Services" sublabel="3 critical" color="bg-gradient-to-r from-brand to-violet-500" delay={0} />
              <AnimatedBar value={3} maxValue={5} label="Affected Pipelines" sublabel="CI/CD chain" color="bg-gradient-to-r from-cyan-500 to-brand" delay={100} />
              <AnimatedBar value={75} maxValue={100} label="Lines of Code Changed" sublabel="+75/-53 in 4 files" color="bg-gradient-to-r from-violet-500 to-purple-500" delay={200} />
              <AnimatedBar value={34} maxValue={40} label="Estimated Effort" sublabel="8 story points · 3 engineers" color="bg-gradient-to-r from-emerald-500 to-green-500" delay={300} />
            </div>
          </motion.div>
        </div>

        {/* Team Impact + Risk Matrix */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Team Impact Analysis</h3>
            <div className="space-y-2">
              {teams.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setExpandedTeam(expandedTeam === i ? null : i)}
                  className={`rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 cursor-pointer transition-all hover:border-brand/20 ${expandedTeam === i ? 'border-brand/20' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                        t.risk === 'high' ? 'bg-red-500/20 text-red-300' : t.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                      }`}>{t.name[0]}{t.name[1]}</div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white">{t.name}</div>
                        <div className="text-[10px] text-slate-600">{t.members} · Lead: {t.lead}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <div className="text-right">
                        <div className={`text-xs font-semibold ${t.score >= 80 ? 'text-green-400' : t.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{t.score}</div>
                        <div className="text-[8px] text-slate-700">Score</div>
                      </div>
                      <svg className={`h-3.5 w-3.5 text-slate-600 transition-transform duration-200 ${expandedTeam === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                  {expandedTeam === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-white/[0.06]">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-slate-600">Velocity:</span> <span className="text-slate-300">{t.velocity} pts/sprint</span></div>
                        <div><span className="text-slate-600">Incidents:</span> <span className="text-slate-300">{t.incidents} open</span></div>
                        <div><span className="text-slate-600">Focus:</span> <span className="text-slate-300">{t.focus}</span></div>
                        <div><span className="text-slate-600">Impact:</span> <span className="text-red-400">{t.impact}</span></div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Risk Assessment Matrix</h3>
            <RiskMatrix />
            <p className="mt-4 text-[10px] text-slate-600 leading-relaxed">Current risk posture is <span className="text-orange-400 font-medium">MODERATE-HIGH</span>. Primary risk vectors are payment processing (critical) and billing reconciliation (high). Recommended mitigations in the action plan below target these vectors with an estimated 320% ROI within 30 days.</p>
          </motion.div>
        </div>

        {/* Cost Analysis + Actions */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Cost Analysis</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg border border-red-500/10 bg-red-500/[0.03] p-3">
                <div className="text-[9px] text-slate-600">Incident Cost</div>
                <div className="text-lg font-bold text-red-400">$12K</div>
                <div className="text-[8px] text-slate-700">per hour</div>
              </div>
              <div className="rounded-lg border border-green-500/10 bg-green-500/[0.03] p-3">
                <div className="text-[9px] text-slate-600">Mitigation</div>
                <div className="text-lg font-bold text-green-400">$14K</div>
                <div className="text-[8px] text-slate-700">total investment</div>
              </div>
              <div className="rounded-lg border border-brand/10 bg-brand/[0.03] p-3">
                <div className="text-[9px] text-slate-600">ROI</div>
                <div className="text-lg font-bold text-brand-light">320%</div>
                <div className="text-[8px] text-slate-700">in 30 days</div>
              </div>
              <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/[0.03] p-3">
                <div className="text-[9px] text-slate-600">Breakeven</div>
                <div className="text-lg font-bold text-yellow-400">3.5 hr</div>
                <div className="text-[8px] text-slate-700">recovery period</div>
              </div>
            </div>
            <div className="h-24 rounded-lg bg-slate-800/50 p-3 flex items-center">
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-slate-600">Cost without mitigation</span>
                  <span className="text-red-400 font-medium">$288K</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600" />
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-slate-600">Cost with mitigation</span>
                  <span className="text-green-400 font-medium">$14K</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recommended Actions</h3>
              <StatusBadge status="info" label="By ROI" />
            </div>
            <div className="space-y-2">
              {actions.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="group rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-brand/20 transition-all">
                  <div className="flex items-start gap-3">
                    <StatusBadge status={a.priority === 'P0' ? 'critical' : a.priority === 'P1' ? 'warning' : 'info'} label={a.priority} dot={false} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 group-hover:text-white transition-colors">{a.action}</p>
                      <div className="flex gap-3 mt-1.5 text-[9px] text-slate-600 flex-wrap">
                        <span>Owner: <span className="text-slate-400">{a.owner}</span></span>
                        <span>Target: <span className="text-slate-400">{a.deadline}</span></span>
                        <span>Cost: <span className="text-slate-400">${a.cost.toLocaleString()}</span></span>
                        <span className="text-green-500">{a.impact} · ROI {a.roi}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(a.roi / 2.5, 100)}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}
