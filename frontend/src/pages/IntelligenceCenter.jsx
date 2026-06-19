import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import Gauge from '../components/Gauge'

const mrs = [
  { id: 'MR #142', author: '@alice', date: 'May 12', desc: 'Failed integration tests due to missing retry config', outcome: 'Incident', match: 87 },
  { id: 'MR #198', author: '@bob', date: 'Jun 1', desc: 'Caused retry queue overflow in production', outcome: 'Incident', match: 92 },
  { id: 'MR #211', author: '@carol', date: 'Jun 15', desc: 'Introduced N+1 query in billing report', outcome: 'Near Miss', match: 74 },
  { id: 'MR #87', author: '@alice', date: 'Apr 20', desc: 'Payment timeout regression after refactor', outcome: 'Incident', match: 89 },
  { id: 'MR #305', author: '@dave', date: 'Jul 2', desc: 'Race condition in session invalidation handler', outcome: 'Incident', match: 91 },
]

const incidents = [
  { title: 'Production outage — Payment pipeline down 45min', date: 'Jun 1', cause: 'Retry queue overflow without circuit breaker', impact: 'All payment flows blocked', duration: '45min', lessons: 'Add circuit breaker pattern to all retry loops', rootCause: 'Missing backpressure mechanism in payment worker', services: ['Payment Service', 'API Gateway'], severity: 'critical' },
  { title: 'Degraded billing processing — 3hr delay', date: 'May 15', cause: 'Billing worker OOM from unbounded retry loop', impact: '15K invoices delayed', duration: '3hr', lessons: 'Bound retry counts and add memory limits to workers', rootCause: 'Unbounded retry queue exhausted heap memory', services: ['Billing Service'], severity: 'high' },
  { title: 'Webhook delivery failure — partial data loss', date: 'Apr 28', cause: 'Missing idempotency keys caused duplicate webhook events', impact: '2% merchants affected', duration: '2hr', lessons: 'Idempotency keys required for all webhook deliveries', rootCause: 'No idempotency checking in webhook handler', services: ['Notification Service', 'Webhook Gateway'], severity: 'medium' },
]

const severityColors = { critical: 'bg-red-500/20 text-red-400 border-red-500/30', high: 'bg-orange-500/15 text-orange-400 border-orange-500/20', medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/15', low: 'bg-green-500/10 text-green-400 border-green-500/15' }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function IntelligenceCenter() {
  const [expandedIncident, setExpandedIncident] = useState(null)
  const [hoveredMr, setHoveredMr] = useState(null)
  const [animateIn, setAnimateIn] = useState(false)
  useEffect(() => { setAnimateIn(true) }, [])

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {/* Header */}
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Orbit Intelligence Center</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time risk analysis for <span className="text-slate-300 font-medium">Add payment retry support</span></p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total MRs Analyzed" value="847" color="text-brand-light" trend="↑ 23% this month" />
          <StatCard label="Incidents Prevented" value="124" color="text-green-400" trend="↑ 31% this month" />
          <StatCard label="False Positive Rate" value="3.2%" color="text-slate-300" trend="↓ 1.1%" />
        </motion.div>

        {/* Gauges + Severity */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={item}>
            <Gauge value={82} label="Incident Probability" sub="Risk Score" color="#ef4444" delay={300} subtitle="of changes cause incidents" />
          </motion.div>
          <motion.div variants={item}>
            <Gauge value={91} label="Confidence Score" sub="Model Accuracy" color="#22c55e" delay={500} subtitle="prediction confidence" />
          </motion.div>
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-500 tracking-wider uppercase">Severity Level</span>
              <span className="text-[10px] text-slate-600">Risk Classification</span>
            </div>
            <div className="flex flex-col items-center justify-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="relative flex items-center justify-center w-28 h-28 rounded-full"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '3px solid #ef4444', boxShadow: '0 0 30px rgba(239,68,68,0.25)' }}
              >
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-extrabold text-red-400 uppercase tracking-wider"
                >High</motion.span>
              </motion.div>
              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500 flex-wrap justify-center">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Low
                <span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium
                <span className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-red-400 font-semibold">High</span>
                <span className="w-2 h-2 rounded-full bg-red-600" /> Critical
              </div>
            </div>
          </motion.div>
        </div>

        {/* MRs + Incidents */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-medium text-slate-500 tracking-wider uppercase">Historical Merge Requests</h3>
              <span className="text-[10px] text-slate-600">{mrs.length} high-similarity matches</span>
            </div>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {mrs.map((mr) => (
                <motion.div
                  key={mr.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onMouseEnter={() => setHoveredMr(mr.id)}
                  onMouseLeave={() => setHoveredMr(null)}
                  className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-all cursor-default"
                  style={{ borderColor: hoveredMr === mr.id ? 'rgba(6,182,212,0.3)' : undefined }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">{mr.id}</span>
                      <span className="text-[10px] font-mono text-slate-500">{mr.author}</span>
                    </div>
                    <span className="text-[10px] text-slate-600">{mr.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-1.5">{mr.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${
                      mr.outcome === 'Incident' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      mr.outcome === 'Near Miss' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>{mr.outcome}</span>
                    <motion.span
                      animate={{ scale: hoveredMr === mr.id ? [1, 1.15, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-[10px] text-slate-500"
                    >{mr.match}% match</motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium text-slate-500 tracking-wider uppercase">Production Incident History</h3>
                <StatusFilter count={incidents.length} />
              </div>
              <div className="space-y-2">
                {incidents.map((inc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setExpandedIncident(expandedIncident === i ? null : i)}
                    className={`rounded-lg border p-3 cursor-pointer transition-all ${
                      inc.severity === 'critical' ? 'border-red-500/10 bg-red-500/[0.02] hover:border-red-500/20' :
                      inc.severity === 'high' ? 'border-orange-500/10 bg-orange-500/[0.02] hover:border-orange-500/20' :
                      'border-yellow-500/10 bg-yellow-500/[0.02] hover:border-yellow-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${severityColors[inc.severity]}`}>{inc.severity}</span>
                          <span className="text-xs font-semibold text-slate-200 leading-tight">{inc.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Root cause: {inc.rootCause}</p>
                      </div>
                      <div className="flex flex-col items-end shrink-0 ml-2">
                        <span className="text-[10px] text-slate-500">{inc.date}</span>
                        <span className="text-[9px] text-slate-700">{inc.duration}</span>
                      </div>
                    </div>
                    {expandedIncident === i && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-white/[0.06]">
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div><span className="text-slate-600">Cause:</span> <span className="text-slate-400">{inc.cause}</span></div>
                          <div><span className="text-slate-600">Impact:</span> <span className="text-slate-400">{inc.impact}</span></div>
                          <div className="col-span-2"><span className="text-slate-600">Services:</span> <span className="text-slate-400">{inc.services.join(', ')}</span></div>
                          <div className="col-span-2"><span className="text-slate-600">Lesson:</span> <span className="text-green-400">{inc.lessons}</span></div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-6">
              <h3 className="text-xs font-medium text-slate-500 tracking-wider uppercase mb-4">Lessons Learned</h3>
              <div className="space-y-2">
                {incidents.map((inc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-lg border border-brand/10 bg-brand/[0.02] p-3 hover:border-brand/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${inc.severity === 'critical' ? 'bg-red-500' : inc.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                      <div className="text-[10px] text-slate-500 font-medium">{inc.title.split('—')[0].trim()}</div>
                    </div>
                    <p className="text-xs text-slate-300 ml-3.5">{inc.lessons}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  )
}

function StatusFilter({ count }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-[10px] text-slate-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-soft" />
        {count} incidents
      </span>
    </div>
  )
}
