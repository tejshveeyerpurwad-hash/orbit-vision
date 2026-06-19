import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const presets = [
  'Add payment retry support',
  'Update billing invoice schema',
  'Refactor auth session handler',
  'Add webhook idempotency keys',
  'Migrate database connection pool',
  'Deploy new API gateway rate limiter',
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const heatmapGrid = [
  [2,3,4,4,5,5,4,3,2,2,3,4,5,5,4,3,2,2,3,4,4,3,2,1],
  [2,2,3,4,5,5,5,4,3,3,4,5,5,5,4,3,2,2,3,4,4,3,2,1],
  [1,2,3,3,4,5,5,4,3,3,4,5,5,4,3,2,2,3,3,4,3,2,1,1],
  [2,2,3,4,4,4,4,3,2,2,3,4,4,4,3,2,1,2,3,3,3,2,1,0],
  [3,3,4,5,5,5,4,3,2,3,4,5,5,4,3,2,2,3,3,4,4,3,2,1],
  [1,1,1,2,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,0],
  [0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0],
]

const mockResults = {
  incidentProbability: 82,
  confidenceScore: 91,
  severity: 'high',
  summaryStats: [
    { label: 'Historical Incidents Analyzed', value: 847, color: '#22c55e' },
    { label: 'Failure Patterns Detected', value: 6, color: '#f59e0b' },
    { label: 'Incidents Prevented YTD', value: 23, color: '#3b82f6' },
    { label: 'Avg Time Travel Accuracy', value: 94, color: '#a855f7', suffix: '%' },
  ],
  timeline: [
    { date: '2024-06-01', title: 'Payment pipeline outage', severity: 'critical', duration: '45min', impact: 'All payment flows blocked', services: ['Payment Service', 'API Gateway'], rootCause: 'Missing circuit breaker' },
    { date: '2024-05-28', title: 'Billing worker OOM cascade', severity: 'critical', duration: '3hr', impact: '15K invoices delayed', services: ['Billing Worker', 'Database'], rootCause: 'Unbounded retry queue' },
    { date: '2024-05-15', title: 'Webhook delivery failure', severity: 'high', duration: '2hr', impact: '2% merchants affected', services: ['Webhook Service', 'Event Bus'], rootCause: 'Missing idempotency keys' },
    { date: '2024-05-02', title: 'Auth session token leak', severity: 'high', duration: '1hr', impact: 'Session data exposed to unauthorized users', services: ['Auth Service', 'Redis'], rootCause: 'Missing TTL on session tokens' },
    { date: '2024-04-20', title: 'Rate limiter misconfiguration', severity: 'medium', duration: '30min', impact: 'Legitimate traffic blocked for 15min', services: ['API Gateway'], rootCause: 'Incorrect rate limit threshold' },
    { date: '2024-04-10', title: 'Database connection pool exhaustion', severity: 'critical', duration: '2.5hr', impact: 'All read queries failed for 2.5 hours', services: ['Database', 'API Service'], rootCause: 'Connection leak in ORM layer' },
    { date: '2024-03-28', title: 'Cache invalidation bug', severity: 'medium', duration: '45min', impact: 'Stale data served across all regions', services: ['Cache Layer', 'API Service'], rootCause: 'Missing cache key prefix' },
    { date: '2024-03-15', title: 'Deployment rollback failure', severity: 'high', duration: '1.5hr', impact: 'Rollback delayed by 90 minutes', services: ['CI/CD Pipeline'], rootCause: 'Missing rollback validation step' },
  ],
  patterns: [
    { name: 'Retry queue overflow', frequency: 12, severityDist: { critical: 3, high: 5, medium: 4 }, firstSeen: 'Jan 2024', lastSeen: 'Jun 2024', status: 'monitoring' },
    { name: 'Memory exhaustion in workers', frequency: 8, severityDist: { critical: 4, high: 3, medium: 1 }, firstSeen: 'Feb 2024', lastSeen: 'Jun 2024', status: 'monitoring' },
    { name: 'Missing circuit breaker pattern', frequency: 6, severityDist: { critical: 5, high: 1, medium: 0 }, firstSeen: 'Mar 2024', lastSeen: 'Jun 2024', status: 'active' },
    { name: 'Database connection leaks', frequency: 4, severityDist: { critical: 2, high: 1, medium: 1 }, firstSeen: 'Apr 2024', lastSeen: 'May 2024', status: 'mitigated' },
    { name: 'Race conditions in session handlers', frequency: 5, severityDist: { critical: 1, high: 3, medium: 1 }, firstSeen: 'Mar 2024', lastSeen: 'Jul 2024', status: 'active' },
    { name: 'Insufficient monitoring coverage', frequency: 9, severityDist: { critical: 0, high: 4, medium: 5 }, firstSeen: 'Jan 2024', lastSeen: 'Jun 2024', status: 'active' },
  ],
  rootCauses: [
    {
      id: 'RCA-001',
      title: 'Payment Retry Chain Collapse',
      severity: 'critical',
      trigger: 'Downstream payment gateway returns 503 during peak load',
      failure: 'Missing circuit breaker allows unbounded retries, saturating all worker threads',
      impact: 'Complete payment pipeline outage for 45 minutes, $120K revenue loss',
      resolution: 'Deployed circuit breaker with exponential backoff and 3 retry limit',
      affectedServices: ['Payment Service', 'API Gateway', 'Worker Pool', 'Downstream Gateway'],
      eventTimeline: [
        { time: 'T+0s', event: 'Gateway returns intermittent 503s' },
        { time: 'T+30s', event: 'Retry queue grows to 50K messages' },
        { time: 'T+2min', event: 'Worker threads saturated at 100%' },
        { time: 'T+5min', event: 'Payment pipeline completely blocked' },
        { time: 'T+45min', event: 'Circuit breaker deployed, recovery starts' },
      ],
      lessons: 'All retry loops must implement circuit breaker pattern. Add retry queue monitoring alerts at 80% capacity.',
    },
    {
      id: 'RCA-002',
      title: 'Billing Worker OOM Cascade',
      severity: 'critical',
      trigger: 'Monthly billing cycle triggers batch processing of 50K invoices',
      failure: 'Unbounded retry mechanism exhausts heap memory, causing OOM kills',
      impact: '15K invoices delayed by 3 hours, SLA breach for 12 enterprise customers',
      resolution: 'Bound retry queue to 1000 entries, added memory limit alerts at 80% heap',
      affectedServices: ['Billing Worker', 'Database Cluster', 'Invoice Service', 'Monitoring'],
      eventTimeline: [
        { time: 'T+0s', event: 'Monthly billing cycle initiates' },
        { time: 'T+5min', event: 'Database returns slow responses under load' },
        { time: 'T+10min', event: 'Retry queue grows unbounded, heap at 70%' },
        { time: 'T+15min', event: 'Worker OOM killed, all billing jobs fail' },
        { time: 'T+3hr', event: 'Memory limits configured, jobs reprocessed' },
      ],
      lessons: 'Set bounded retry queues with memory limits. Implement circuit breaker for database calls under load.',
    },
    {
      id: 'RCA-003',
      title: 'Webhook Idempotency Failure',
      severity: 'high',
      trigger: 'Network blip causes webhook delivery retries for 500 merchants',
      failure: 'Missing idempotency keys result in duplicate event processing',
      impact: '2% merchants received duplicate notifications, data inconsistency in audit logs',
      resolution: 'Generated unique idempotency keys with 24hr dedup window',
      affectedServices: ['Webhook Service', 'Event Bus', 'Audit Logger', 'Notification Service'],
      eventTimeline: [
        { time: 'T+0s', event: 'Network blip affects webhook delivery' },
        { time: 'T+1s', event: 'Webhook retry mechanism activates' },
        { time: 'T+30s', event: 'Duplicate events processed for 500 merchants' },
        { time: 'T+5min', event: 'Data inconsistency detected in audit logs' },
        { time: 'T+2hr', event: 'Idempotency keys deployed, dedup fixed' },
      ],
      lessons: 'All webhook handlers must enforce idempotency. Add dedup validation to event pipeline.',
    },
  ],
  recoveryTimeline: [
    { step: 'Detection', duration: '2min', detail: 'Monitoring alert triggered: payment success rate dropped below 95% threshold', owner: 'Monitoring' },
    { step: 'Triage', duration: '3min', detail: 'On-call engineer identifies retry queue saturation as root cause', owner: 'SRE' },
    { step: 'Mitigation', duration: '15min', detail: 'Deployed circuit breaker with exponential backoff to payment worker pool', owner: 'Payments Team' },
    { step: 'Recovery', duration: '20min', detail: 'Cleared 50K queued retries, payment pipeline back to 100% success rate', owner: 'Payments Team' },
    { step: 'Follow-up', duration: '5min', detail: 'Postmortem initiated, monitoring alerts configured for retry queue depth', owner: 'SRE' },
  ],
  mrs: [
    { id: 'MR #142', author: '@alice', date: 'May 12', desc: 'Failed integration tests due to missing retry config', outcome: 'Incident', match: 87, rootCause: 'Missing backpressure mechanism in payment worker', lessons: 'Add circuit breaker pattern to all retry loops' },
    { id: 'MR #198', author: '@bob', date: 'Jun 1', desc: 'Caused retry queue overflow in production', outcome: 'Incident', match: 92, rootCause: 'Unbounded retry queue exhausted heap memory', lessons: 'Bound retry counts and add memory limits to workers' },
    { id: 'MR #211', author: '@carol', date: 'Jun 15', desc: 'Introduced N+1 query in billing report', outcome: 'Near Miss', match: 74, rootCause: 'Missing database index on invoice table', lessons: 'Add query analysis to CI pipeline' },
    { id: 'MR #87', author: '@alice', date: 'Apr 20', desc: 'Payment timeout regression after refactor', outcome: 'Incident', match: 89, rootCause: 'Removed timeout config during cleanup', lessons: 'Add regression tests for timeout configurations' },
    { id: 'MR #305', author: '@dave', date: 'Jul 2', desc: 'Race condition in session invalidation handler', outcome: 'Incident', match: 91, rootCause: 'Missing mutex lock in session store', lessons: 'Enforce thread-safety review for all session handlers' },
  ],
  incidents: [
    { title: 'Production outage — Payment pipeline down 45min', date: 'Jun 1', cause: 'Retry queue overflow without circuit breaker', impact: 'All payment flows blocked', duration: '45min', fix: 'Deployed circuit breaker with exponential backoff' },
    { title: 'Degraded billing processing — 3hr delay', date: 'May 15', cause: 'Billing worker OOM from unbounded retry loop', impact: '15K invoices delayed', duration: '3hr', fix: 'Bound retry counts and added memory limit alerts' },
    { title: 'Webhook delivery failure — partial data loss', date: 'Apr 28', cause: 'Missing idempotency keys caused duplicate webhook events', impact: '2% merchants affected', duration: '2hr', fix: 'Generated unique idempotency keys for all webhooks' },
  ],
  recommendations: [
    { priority: 'P0', action: 'Add circuit breaker to payment retry logic', owner: 'Payments Team', detail: 'Prevents cascading failures in payment pipeline. Estimated effort: 3 story points.', impact: 'Prevents $120K/incident revenue loss', effort: '3 story points', status: 'pending' },
    { priority: 'P0', action: 'Bound retry queues with memory limits', owner: 'Platform Team', detail: 'Eliminates OOM risks in worker processes. Estimated effort: 5 story points.', impact: 'Eliminates OOM-related outages', effort: '5 story points', status: 'in_progress' },
    { priority: 'P1', action: 'Add idempotency keys to webhook delivery', owner: 'Platform Team', detail: 'Eliminates duplicate event processing. Estimated effort: 5 story points.', impact: 'Protects 2% merchants from data issues', effort: '5 story points', status: 'pending' },
    { priority: 'P1', action: 'Increase billing worker memory limit', owner: 'Billing Team', detail: 'Prevents OOM during peak load. Estimated effort: 1 story point.', impact: 'Covers 15K invoices during peak', effort: '1 story point', status: 'completed' },
    { priority: 'P2', action: 'Add regression tests for timeout configs', owner: 'QA Team', detail: 'Catches accidental timeout removal during refactors. Estimated effort: 2 story points.', impact: 'Prevents timeout regressions', effort: '2 story points', status: 'pending' },
    { priority: 'P2', action: 'Implement session TTL enforcement', owner: 'Auth Team', detail: 'Ensures session tokens expire after max 24hr. Estimated effort: 3 story points.', impact: 'Prevents session data exposure', effort: '3 story points', status: 'in_progress' },
  ],
}

function AnimatedGauge({ value, label, sub, color, delay = 300 }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setPct(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  const circumference = Math.PI * 56
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 backdrop-blur-xl hover:border-white/[0.12] transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">{label}</span>
        {sub && <span className="text-[10px] text-slate-600">{sub}</span>}
      </div>
      <div className="flex flex-col items-center py-3">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="56" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="64" cy="64" r="56" fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="relative -mt-[68px]">
          <span className="text-3xl font-bold text-white">{pct}<span className="text-lg text-slate-500">%</span></span>
        </div>
      </div>
    </div>
  )
}

function AnimatedScore({ value, label, color, delay = 400 }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${w}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: delay / 1000 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
        />
      </div>
    </div>
  )
}

function AnimatedStatCard({ value, label, color, delay = 200, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const step = Math.max(1, Math.ceil(value / 30))
      const interval = setInterval(() => {
        current += step
        if (current >= value) {
          setCount(value)
          clearInterval(interval)
        } else {
          setCount(current)
        }
      }, 25)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 + 0.3 }}
      className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 backdrop-blur-xl hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
    >
      <p className="text-[11px] font-medium text-slate-500 tracking-wide uppercase mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight" style={{ color }}>{count}{suffix}</span>
      </div>
    </motion.div>
  )
}

const severityColor = {
  critical: { border: 'border-red-500/30', bg: 'bg-red-500/[0.04]', dot: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20', text: 'text-red-400' },
  high: { border: 'border-orange-500/30', bg: 'bg-orange-500/[0.04]', dot: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', text: 'text-orange-400' },
  medium: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/[0.04]', dot: 'bg-yellow-500', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', text: 'text-yellow-400' },
}

function getHeatColor(val) {
  const scale = ['#1e293b', '#064e3b', '#059669', '#ca8a04', '#ea580c', '#dc2626']
  return scale[Math.min(val, 5)]
}

const tabs = ['Timeline', 'Patterns', 'Root Causes', 'Heatmap', 'Prevention']

export default function IncidentTimeMachine() {
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [activeTab, setActiveTab] = useState(0)
  const inputRef = useRef(null)

  const filtered = input.trim()
    ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase()))
    : presets

  const analyze = (text) => {
    if (!text.trim()) return
    setAnalyzing(true)
    setResults(null)
    setTimeout(() => {
      setResults(mockResults)
      setAnalyzing(false)
    }, 1800)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); analyze(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-purple-500 shadow-lg shadow-brand/20">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Incident Time Machine</h1>
              <p className="text-sm text-slate-500">Travel back in time to predict incidents before they happen</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="relative">
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-5">
            <form onSubmit={e => { e.preventDefault(); analyze(input) }}>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                  onFocus={() => setShowPresets(true)}
                  onKeyDown={handleKey}
                  placeholder='Describe a software change, e.g. "Add payment retry support"'
                  className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-36 text-sm text-white placeholder-slate-600 outline-none focus:border-brand/40 focus:bg-slate-800/80 transition-all"
                  disabled={analyzing}
                />
                <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                  <button
                    type="submit"
                    disabled={analyzing || !input.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand to-purple-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
                  >
                    {analyzing ? (
                      <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Analyzing</>
                    ) : (
                      <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Travel Back</>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <AnimatePresence>
              {showPresets && filtered.length > 0 && !analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden"
                >
                  {filtered.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        i === selectedPreset ? 'bg-brand/10 text-brand-light' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'
                      }`}
                      onClick={() => { setInput(s); setShowPresets(false); analyze(s) }}
                    >
                      <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse">
                  <div className="h-3 w-24 bg-slate-800 rounded mb-3" />
                  <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-full bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {results && !analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={container}
              className="space-y-8"
            >
              <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {results.summaryStats.map((stat, i) => (
                  <AnimatedStatCard key={stat.label} {...stat} delay={200 + i * 150} />
                ))}
              </motion.div>

              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 backdrop-blur-xl p-1">
                  <div className="flex overflow-x-auto">
                    {tabs.map((tab, i) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(i)}
                        className={`relative px-5 py-3 text-xs font-medium whitespace-nowrap transition-all ${
                          activeTab === i
                            ? 'text-white'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {tab}
                        {activeTab === i && (
                          <motion.div
                            layoutId="tab-indicator"
                            className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-brand to-purple-500"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    {/* Gauges + Scores Row inside Timeline */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      <AnimatedGauge value={results.incidentProbability} label="Incident Probability" sub="Risk Score" color="#ef4444" delay={200} />
                      <AnimatedGauge value={results.confidenceScore} label="Confidence Score" sub="Model Accuracy" color="#22c55e" delay={400} />
                      <div className="space-y-3">
                        <AnimatedScore value={results.incidentProbability} label="Risk Assessment" color="#ef4444" delay={300} />
                        <AnimatedScore value={85} label="Similarity Match" color="#f59e0b" delay={500} />
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 backdrop-blur-xl"
                      >
                        <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">Severity Level</span>
                        <div className="flex flex-col items-center justify-center py-4">
                          <div className="relative flex items-center justify-center w-20 h-20 rounded-full" style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '3px solid #ef4444', boxShadow: '0 0 25px rgba(239,68,68,0.25)' }}>
                            <span className="text-lg font-extrabold text-red-400 uppercase tracking-wider">High</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Low
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Med
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> <span className="text-red-400 font-semibold">High</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Crit
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Historical Incident Timeline */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Historical Incident Timeline</h3>
                        <StatusBadge status="error" label={`${results.timeline.length} incidents`} />
                      </div>
                      <div className="relative">
                        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-red-500/60 via-orange-500/40 to-yellow-500/20" />
                        <div className="space-y-0">
                          {results.timeline.map((ev, i) => {
                            const sev = severityColor[ev.severity] || severityColor.medium
                            return (
                              <div key={i} className="relative flex gap-5 pb-6 last:pb-0">
                                <div className="relative flex-shrink-0 mt-1">
                                  <div className={`w-10 h-10 rounded-full border-2 ${sev.border} ${sev.bg} flex items-center justify-center z-10 relative`}>
                                    <div className={`w-2 h-2 rounded-full ${sev.dot}`} />
                                  </div>
                                  {i < results.timeline.length - 1 && (
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-[calc(100%-2.5rem)] bg-white/[0.06]" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 pt-1.5">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[10px] font-mono text-slate-600">{ev.date}</span>
                                    <span className="text-[10px] font-medium text-slate-500">{ev.duration}</span>
                                  </div>
                                  <h4 className="text-sm font-semibold text-white mb-1">{ev.title}</h4>
                                  <p className="text-xs text-slate-500 mb-2">{ev.impact}</p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${sev.badge}`}>
                                      {ev.severity}
                                    </span>
                                    <span className="text-[10px] text-slate-600">{ev.rootCause}</span>
                                  </div>
                                  <div className="mt-2 flex gap-1.5 flex-wrap">
                                    {ev.services.map(s => (
                                      <span key={s} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[9px] font-mono text-slate-500 border border-white/[0.06]">{s}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Similar Deployments */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Similar Past Deployments</h3>
                        <StatusBadge status="warning" label={`${results.mrs.length} matches`} />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {results.mrs.map((mr, i) => (
                          <motion.div
                            key={mr.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">{mr.id}</span>
                                <span className="text-[9px] font-mono text-slate-600">{mr.author}</span>
                              </div>
                              <span className="text-[9px] text-slate-600">{mr.date}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{mr.desc}</p>
                            <div className="flex items-center justify-between">
                              <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-semibold ${
                                mr.outcome === 'Incident' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                mr.outcome === 'Near Miss' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                'bg-green-500/10 text-green-400 border-green-500/20'
                              }`}>{mr.outcome}</span>
                              <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${mr.match}%` }} />
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono">{mr.match}%</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Recovery Timeline */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Recovery Timeline — Top Incident</h3>
                        <StatusBadge status="info" label="45min total" />
                      </div>
                      <div className="relative">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand via-purple-500 to-slate-700 rounded-full" />
                        <div className="space-y-6">
                          {results.recoveryTimeline.map((step, i) => (
                            <div key={i} className="relative flex gap-4">
                              <div className="relative flex-shrink-0 mt-0.5">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 relative ${
                                  i === 0 ? 'border-red-500 bg-red-500/20' :
                                  i === results.recoveryTimeline.length - 1 ? 'border-green-500 bg-green-500/20' :
                                  'border-brand bg-brand/20'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    i === 0 ? 'bg-red-500' :
                                    i === results.recoveryTimeline.length - 1 ? 'bg-green-500' :
                                    'bg-brand'
                                  }`} />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 pb-1">
                                <div className="flex items-center justify-between mb-0.5">
                                  <h4 className="text-sm font-semibold text-white">{step.step}</h4>
                                  <span className="text-[10px] font-mono text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded">{step.duration}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed mb-1">{step.detail}</p>
                                <span className="text-[9px] text-slate-600">Owner: {step.owner}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="patterns"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Failure Pattern Analysis</h3>
                        <StatusBadge status="warning" label={`${results.patterns.length} patterns`} />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {results.patterns.map((p, i) => {
                          const total = p.severityDist.critical + p.severityDist.high + p.severityDist.medium
                          const statusStyle = p.status === 'active' ? 'border-red-500/20 bg-red-500/[0.03]' :
                            p.status === 'monitoring' ? 'border-yellow-500/20 bg-yellow-500/[0.03]' :
                            'border-green-500/20 bg-green-500/[0.03]'
                          const statusColor = p.status === 'active' ? 'text-red-400 bg-red-500/10' :
                            p.status === 'monitoring' ? 'text-yellow-400 bg-yellow-500/10' :
                            'text-green-400 bg-green-500/10'
                          return (
                            <motion.div
                              key={p.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className={`rounded-lg border ${statusStyle} p-4 hover:border-white/[0.12] transition-all`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                                <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${statusColor}`}>{p.status}</span>
                              </div>
                              <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-2xl font-bold text-white">{p.frequency}</span>
                                <span className="text-[10px] text-slate-600">occurrences</span>
                              </div>
                              <div className="space-y-1.5 mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-red-400 w-10">Critical</span>
                                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                                    <div className="h-full rounded-full bg-red-500" style={{ width: `${(p.severityDist.critical / total) * 100}%` }} />
                                  </div>
                                  <span className="text-[9px] text-slate-500 w-4 text-right">{p.severityDist.critical}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-orange-400 w-10">High</span>
                                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${(p.severityDist.high / total) * 100}%` }} />
                                  </div>
                                  <span className="text-[9px] text-slate-500 w-4 text-right">{p.severityDist.high}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-yellow-400 w-10">Medium</span>
                                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                                    <div className="h-full rounded-full bg-yellow-500" style={{ width: `${(p.severityDist.medium / total) * 100}%` }} />
                                  </div>
                                  <span className="text-[9px] text-slate-500 w-4 text-right">{p.severityDist.medium}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-600 border-t border-white/[0.06] pt-2">
                                <span>First: {p.firstSeen}</span>
                                <span>Last: {p.lastSeen}</span>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="rootcauses"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-6">
                      {results.rootCauses.map((rca, i) => {
                        const sev = severityColor[rca.severity] || severityColor.medium
                        return (
                          <motion.div
                            key={rca.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className={`rounded-lg px-2 py-1 text-[9px] font-bold ${sev.badge}`}>{rca.id}</span>
                                <h3 className="text-sm font-semibold text-white">{rca.title}</h3>
                              </div>
                              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${sev.badge}`}>{rca.severity}</span>
                            </div>

                            {/* Cause Chain */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                              {[
                                { label: 'Trigger', value: rca.trigger, color: 'border-red-500/30 bg-red-500/[0.04]' },
                                { label: 'Failure', value: rca.failure, color: 'border-orange-500/30 bg-orange-500/[0.04]' },
                                { label: 'Impact', value: rca.impact, color: 'border-yellow-500/30 bg-yellow-500/[0.04]' },
                                { label: 'Resolution', value: rca.resolution, color: 'border-green-500/30 bg-green-500/[0.04]' },
                              ].map((item, j) => (
                                <div key={item.label} className={`rounded-lg border ${item.color} p-3`}>
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.color.includes('red') ? 'bg-red-500' : item.color.includes('orange') ? 'bg-orange-500' : item.color.includes('yellow') ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">{item.value}</p>
                                </div>
                              ))}
                            </div>

                            {/* Affected Services */}
                            <div className="mb-5">
                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Affected Services</span>
                              <div className="flex flex-wrap gap-1.5">
                                {rca.affectedServices.map(s => (
                                  <span key={s} className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-1 text-[10px] font-mono text-slate-400">{s}</span>
                                ))}
                              </div>
                            </div>

                            {/* Event Timeline */}
                            <div className="mb-4">
                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Event Timeline</span>
                              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                {rca.eventTimeline.map((ev, j) => (
                                  <div key={j} className={`flex items-center gap-4 px-4 py-2 ${j < rca.eventTimeline.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                                    <span className="text-[10px] font-mono font-semibold text-brand shrink-0 w-12">{ev.time}</span>
                                    <span className="text-[11px] text-slate-400">{ev.event}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Lessons */}
                            <div className="rounded-lg border border-green-500/10 bg-green-500/[0.02] p-3">
                              <div className="flex items-start gap-2">
                                <svg className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                                <p className="text-[11px] text-slate-400 leading-relaxed">{rca.lessons}</p>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 3 && (
                  <motion.div
                    key="heatmap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Incident Heatmap — Day of Week vs Hour</h3>
                        <div className="flex items-center gap-2 text-[9px] text-slate-500">
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#1e293b' }} />
                          <span>None</span>
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#064e3b' }} />
                          <span>Low</span>
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#059669' }} />
                          <span>Med</span>
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#ca8a04' }} />
                          <span>High</span>
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#ea580c' }} />
                          <span>Crit</span>
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#dc2626' }} />
                          <span>Severe</span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <div className="inline-flex flex-col gap-1 min-w-[720px]">
                          {/* Header row — hours */}
                          <div className="flex items-center gap-1 pl-[70px]">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div key={i} className="w-[26px] text-center text-[8px] font-mono text-slate-600">{i}</div>
                            ))}
                          </div>
                          {heatmapGrid.map((row, dayIdx) => (
                            <div key={dayIdx} className="flex items-center gap-1">
                              <div className="w-[70px] text-[9px] font-medium text-slate-500 text-right pr-2 shrink-0">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIdx]}
                              </div>
                              {row.map((val, hourIdx) => (
                                <div
                                  key={hourIdx}
                                  className="group relative w-[26px] h-[26px] rounded-sm cursor-default transition-transform hover:scale-110"
                                  style={{ backgroundColor: getHeatColor(val) }}
                                >
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20">
                                    <div className="bg-slate-700 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap shadow-lg border border-white/[0.08]">
                                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIdx]} {hourIdx}:00 — {val} incidents
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-5 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                        <div className="flex items-center gap-4 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#dc2626' }} />
                            Peak incident hours: 9:00–11:00 and 14:00–16:00
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#1e293b' }} />
                            Lowest: Weekends and 0:00–5:00
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Production Incidents */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Related Production Incidents</h3>
                        <StatusBadge status="error" label={`${results.incidents.length} incidents`} />
                      </div>
                      <div className="space-y-2">
                        {results.incidents.map((inc, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-lg border border-red-500/10 bg-red-500/[0.02] p-3 hover:border-red-500/20 transition-all"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-xs font-semibold text-red-400 leading-tight">{inc.title}</span>
                              <span className="text-[10px] text-slate-500 shrink-0 ml-2">{inc.date}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-1">Root cause: {inc.cause}</p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500">
                              <span>Impact: {inc.impact}</span>
                              <span className="text-slate-600">|</span>
                              <span>Duration: {inc.duration}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 4 && (
                  <motion.div
                    key="prevention"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Prevention Recommendations</h3>
                        <StatusBadge status="info" label={`${results.recommendations.length} actions`} />
                      </div>
                      <div className="space-y-3">
                        {results.recommendations.map((r, i) => {
                          const statusBadgeStyle = r.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            r.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center gap-1 mt-0.5">
                                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                    r.priority === 'P0' ? 'bg-red-500/10 text-red-400' :
                                    r.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400' :
                                    'bg-slate-500/10 text-slate-400'
                                  }`}>{r.priority}</span>
                                  <span className={`rounded-full border px-1.5 py-0.5 text-[7px] font-semibold ${statusBadgeStyle}`}>{r.status.replace('_', ' ')}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white mb-1">{r.action}</p>
                                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{r.detail}</p>
                                  <div className="flex items-center gap-4 text-[10px] text-slate-600 flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.94-4.125L12 1.5l-2.06 3.375m2.94 0h-2.94M10.5 6.375L6.44 2.25m.06 4.5L2.25 10.5m4.5 0l2.81 2.81M15 12l-2.25 2.25M15 12l2.25-2.25M5.25 12l-2.25 2.25m4.5 0l2.25-2.25" />
                                      </svg>
                                      {r.owner}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {r.effort}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                      {r.impact}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Lessons Learned */}
                    <div className="rounded-xl border border-green-500/10 bg-slate-900/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Lessons Learned from Past Incidents</h3>
                        <StatusBadge status="success" label="3 insights" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {results.incidents.map((inc, i) => (
                          <div key={i} className="rounded-lg border border-green-500/10 bg-green-500/[0.02] p-4">
                            <div className="text-[10px] text-slate-500 font-medium mb-1.5">{inc.title.split('—')[0].trim()}</div>
                            <div className="flex items-start gap-2">
                              <svg className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                              </svg>
                              <p className="text-xs text-slate-400 leading-relaxed">{inc.fix}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {!results && !analyzing && (
          <motion.div variants={item} className="text-center py-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-br from-brand/5 to-purple-500/5">
              <svg className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Ready to travel back in time?</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter a software change request above to see similar historical incidents, root causes, and prevention recommendations.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
