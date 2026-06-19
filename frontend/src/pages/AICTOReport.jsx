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
  { name: 'Payments', risk: 'high', score: 42, incidents: 4, members: '8 engineers', velocity: 85, impact: '$12K/hr potential loss' },
  { name: 'Billing', risk: 'medium', score: 68, incidents: 2, members: '5 engineers', velocity: 72, impact: '$5K/hr potential loss' },
  { name: 'Auth', risk: 'low', score: 91, incidents: 0, members: '6 engineers', velocity: 91, impact: '$2K/hr potential loss' },
  { name: 'Notifications', risk: 'medium', score: 74, incidents: 1, members: '4 engineers', velocity: 64, impact: '$1K/hr potential loss' },
]

const actions = [
  { priority: 'P0', action: 'Add circuit breaker to payment retry logic', owner: 'Payments', deadline: 'This sprint', cost: '$8K', impact: 'Prevents $12K/hr outage' },
  { priority: 'P1', action: 'Increase billing worker memory limit', owner: 'Billing', deadline: 'Next sprint', cost: '$2K', impact: 'Prevents $5K/hr degradation' },
  { priority: 'P2', action: 'Add idempotency keys to webhook delivery', owner: 'Notifications', deadline: 'Backlog', cost: '$4K', impact: 'Prevents data loss incidents' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function AICTOReport() {
  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">AI CTO Report</h1>
          <p className="mt-1 text-sm text-slate-500">Executive summary with business impact, engineering impact, and cost analysis</p>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <StatCard key={m.label} label={m.label} value={m.value} color={m.color} trend={m.trend} />
          ))}
        </motion.div>

        {/* Executive Summary */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Executive Summary</h3>
          <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <p>Analysis of <span className="text-slate-200">Add payment retry support</span> across 4 engineering teams reveals moderate release risk. The Payments team carries the highest risk exposure due to 4 open incidents and a velocity score of 85 against a risk score of 42.</p>
            <p>Estimated business impact of unmitigated deployment: <span className="text-red-400">$12K/hr</span> in potential payment processing losses. Recommended actions prioritized by ROI in the mitigation plan below.</p>
          </div>
        </motion.div>

        {/* Business Impact */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Business Impact Analysis</h3>
            <div className="space-y-3">
              {[
                { label: 'Revenue at Risk', value: '$12K/hr', severity: 'critical' },
                { label: 'Customer Impact', value: 'All payment flows', severity: 'high' },
                { label: 'SLA Violation Risk', value: '45 min downtime', severity: 'critical' },
                { label: 'Regulatory Impact', value: 'PCI compliance', severity: 'warning' },
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="text-xs text-slate-400">{b.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{b.value}</span>
                    <StatusBadge status={b.severity} label={b.severity} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Engineering Impact Analysis</h3>
            <div className="space-y-3">
              {[
                { label: 'Affected Services', value: '5', detail: '3 critical' },
                { label: 'Affected Pipelines', value: '3', detail: 'CI/CD chain' },
                { label: 'Lines of Code', value: '+75/-53', detail: '4 files' },
                { label: 'Estimated Effort', value: '8 story points', detail: '3 engineers' },
              ].map((e, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="text-xs text-slate-400">{e.label}</span>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-200">{e.value}</span>
                    <div className="text-[9px] text-slate-600">{e.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Impact */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Team Impact Analysis</h3>
          <div className="space-y-3">
            {teams.map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    t.risk === 'high' ? 'bg-red-500' : t.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <span className="text-sm font-medium text-white">{t.name}</span>
                    <span className="text-[10px] text-slate-600 ml-2">{t.members}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-600">Risk Score</span>
                    <span className={`text-sm font-semibold ml-2 ${
                      t.score >= 80 ? 'text-green-400' : t.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{t.score}</span>
                  </div>
                  <span className="text-[10px] text-slate-600">{t.incidents} incidents</span>
                  <span className="text-[10px] text-slate-500 hidden sm:block">{t.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cost Analysis + Recommendations */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Cost Analysis</h3>
            <div className="space-y-3">
              {[
                { label: 'Estimated Incident Cost', value: '$12,000/hr', color: 'text-red-400' },
                { label: 'Mitigation Investment', value: '$14,000', color: 'text-green-400' },
                { label: 'ROI (30 days)', value: '320%', color: 'text-brand-light' },
                { label: 'Breakeven Period', value: '3.5 hours', color: 'text-yellow-400' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="text-xs text-slate-400">{c.label}</span>
                  <span className={`text-xs font-semibold ${c.color}`}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Recommended Actions</h3>
            <div className="space-y-2">
              {actions.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <StatusBadge status={a.priority === 'P0' ? 'critical' : a.priority === 'P1' ? 'warning' : 'info'} label={a.priority} dot={false} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300">{a.action}</p>
                    <div className="flex gap-3 mt-1 text-[10px] text-slate-600 flex-wrap">
                      <span>Owner: {a.owner}</span>
                      <span>Target: {a.deadline}</span>
                      <span>Cost: {a.cost}</span>
                      <span className="text-green-500">{a.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}
