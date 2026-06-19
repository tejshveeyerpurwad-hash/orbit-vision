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
  { title: 'Production outage — Payment pipeline down 45min', date: 'Jun 1', cause: 'Retry queue overflow without circuit breaker', impact: 'All payment flows blocked', duration: '45min', lessons: 'Add circuit breaker pattern to all retry loops', rootCause: 'Missing backpressure mechanism in payment worker' },
  { title: 'Degraded billing processing — 3hr delay', date: 'May 15', cause: 'Billing worker OOM from unbounded retry loop', impact: '15K invoices delayed', duration: '3hr', lessons: 'Bound retry counts and add memory limits to workers', rootCause: 'Unbounded retry queue exhausted heap memory' },
  { title: 'Webhook delivery failure — partial data loss', date: 'Apr 28', cause: 'Missing idempotency keys caused duplicate webhook events', impact: '2% merchants affected', duration: '2hr', lessons: 'Idempotency keys required for all webhook deliveries', rootCause: 'No idempotency checking in webhook handler' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function IntelligenceCenter() {
  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Orbit Intelligence Center</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time risk analysis for <span className="text-slate-300 font-medium">Add payment retry support</span></p>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total MRs Analyzed" value="847" color="text-brand-light" trend="↑ 23% this month" />
          <StatCard label="Incidents Prevented" value="124" color="text-green-400" trend="↑ 31% this month" />
          <StatCard label="False Positive Rate" value="3.2%" color="text-slate-300" trend="↓ 1.1%" />
        </motion.div>

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
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '3px solid #ef4444', boxShadow: '0 0 30px rgba(239,68,68,0.25)' }}>
                <span className="text-2xl font-extrabold text-red-400 uppercase tracking-wider">High</span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500 flex-wrap justify-center">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Low
                <span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium
                <span className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-red-400 font-semibold">High</span>
                <span className="w-2 h-2 rounded-full bg-red-600" /> Critical
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-medium text-slate-500 tracking-wider uppercase">Historical Merge Requests</h3>
              <span className="text-[10px] text-slate-600">{mrs.length} high-similarity matches</span>
            </div>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {mrs.map((mr) => (
                <div key={mr.id} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all">
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
                    <span className="text-[10px] text-slate-500">{mr.match}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <div className="rounded-xl border border-red-500/10 bg-slate-900/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium text-slate-500 tracking-wider uppercase">Production Incident History</h3>
                <span className="text-[10px] text-slate-600">{incidents.length} incidents</span>
              </div>
              <div className="space-y-2">
                {incidents.map((inc, i) => (
                  <div key={i} className="rounded-lg border border-red-500/10 bg-red-500/[0.02] p-3">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-semibold text-red-400 leading-tight">{inc.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">{inc.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-1">Root cause: {inc.rootCause}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>Impact: {inc.impact}</span>
                      <span className="text-slate-600">|</span>
                      <span>Duration: {inc.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-brand/10 bg-slate-900/50 p-6">
              <h3 className="text-xs font-medium text-slate-500 tracking-wider uppercase mb-4">Lessons Learned</h3>
              <div className="space-y-2">
                {incidents.map((inc, i) => (
                  <div key={i} className="rounded-lg border border-brand/10 bg-brand/[0.02] p-3">
                    <div className="text-[10px] text-slate-500 font-medium mb-0.5">{inc.title.split('—')[0].trim()}</div>
                    <p className="text-xs text-slate-300">{inc.lessons}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  )
}
