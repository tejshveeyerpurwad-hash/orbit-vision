import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const presets = [
  'Add payment retry support',
  'Implement OAuth 2.0 SSO',
  'Migrate database connection pool',
  'Refactor billing module',
  'Deploy microservices monitoring',
]

const investigationData = {
  riskScore: 87,
  confidence: 94,
  verdict: 'High Risk — Proceed with caution',
  keyFindings: 4,
  recommendationsCount: 5,
  totalFailures: 8,
  criticalFailures: 2,
  highFailures: 3,
  mediumFailures: 2,
  lowFailures: 1,
  mrsAnalyzed: 847,
  incidentsPrevented: 124,
  riskTimeline: [
    { phase: 'Design Phase', risk: 25, color: 'green' },
    { phase: 'Implementation', risk: 65, color: 'yellow' },
    { phase: 'Testing', risk: 78, color: 'orange' },
    { phase: 'Deployment', risk: 88, color: 'red' },
    { phase: 'Post-Release', risk: 55, color: 'yellow' },
  ],
  blastRadius: {
    center: 'Payment Retry Logic',
    depth: '3 levels',
    totalServices: 6,
    zones: [
      { name: 'Payment Service', radius: 1, risk: 87, critical: true },
      { name: 'Billing Service', radius: 2, risk: 65, critical: false },
      { name: 'API Gateway', radius: 2, risk: 72, critical: true },
      { name: 'Notification Service', radius: 2, risk: 45, critical: false },
      { name: 'Auth Service', radius: 3, risk: 38, critical: false },
      { name: 'Redis Cache', radius: 3, risk: 25, critical: false },
      { name: 'Database', radius: 3, risk: 55, critical: true },
    ],
  },
  affectedServices: [
    { name: 'Payment Service', impact: 'critical', risk: 87, filesChanged: 14, linesChanged: '+342 / -89' },
    { name: 'Billing Service', impact: 'high', risk: 65, filesChanged: 8, linesChanged: '+157 / -42' },
    { name: 'Notification Service', impact: 'medium', risk: 45, filesChanged: 3, linesChanged: '+28 / -12' },
    { name: 'API Gateway', impact: 'critical', risk: 72, filesChanged: 6, linesChanged: '+94 / -31' },
    { name: 'Auth Service', impact: 'low', risk: 38, filesChanged: 2, linesChanged: '+15 / -4' },
    { name: 'Redis Cache', impact: 'low', risk: 25, filesChanged: 1, linesChanged: '+5 / -2' },
    { name: 'Database', impact: 'high', risk: 55, filesChanged: 4, linesChanged: '+67 / -18' },
  ],
  failureModes: [
    { mode: 'Retry queue overflow causes cascading failure', severity: 'critical', probability: 'High', impact: 'All payment flows blocked', detection: 'Monitoring alert after 5 min', mitigation: 'Add bounded retry queues with backpressure' },
    { mode: 'Circuit breaker misconfiguration causes silent failures', severity: 'critical', probability: 'Medium', impact: 'Failed transactions without error logs', detection: 'Customer complaints after 30 min', mitigation: 'Add comprehensive integration tests with fault injection' },
    { mode: 'Billing reconciliation delay during rollout', severity: 'high', probability: 'Low', impact: '15K invoices delayed up to 3 hours', detection: 'Billing dashboard alert', mitigation: 'Feature flag with gradual rollout (10% → 50% → 100%)' },
    { mode: 'API gateway timeout regression', severity: 'high', probability: 'Medium', impact: 'Payment requests timeout under load', detection: 'APM latency spike alert', mitigation: 'Update timeout configs with load testing validation' },
    { mode: 'Database connection pool exhaustion', severity: 'high', probability: 'Low', impact: 'All services unable to connect to DB', detection: 'Connection pool monitoring alert', mitigation: 'Add connection pooling with max limit per service' },
    { mode: 'Webhook delivery failure on retry events', severity: 'medium', probability: 'Medium', impact: 'Merchants not notified of retry status', detection: 'Webhook delivery log audit', mitigation: 'Add idempotency keys and dead letter queue' },
    { mode: 'Memory leak in retry worker loop', severity: 'medium', probability: 'Low', impact: 'Worker pod OOM kill after 4 hours', detection: 'K8s pod restart count alert', mitigation: 'Add memory limits and leak detection tests' },
    { mode: 'Monitoring dashboard missing retry metrics', severity: 'low', probability: 'High', impact: 'Blind spot during incident response', detection: 'Manual discovery during incident', mitigation: 'Add retry-related metrics to operations dashboard' },
  ],
  mrs: [
    { id: 'MR #142', author: '@alice', date: 'May 12', desc: 'Failed integration tests due to missing retry config', outcome: 'Incident', match: 87, files: 12, risk: 'high' },
    { id: 'MR #198', author: '@bob', date: 'Jun 1', desc: 'Caused retry queue overflow in production', outcome: 'Incident', match: 92, files: 8, risk: 'critical' },
    { id: 'MR #211', author: '@carol', date: 'Jun 15', desc: 'Introduced N+1 query in billing report', outcome: 'Near Miss', match: 74, files: 5, risk: 'medium' },
    { id: 'MR #87', author: '@alice', date: 'Apr 20', desc: 'Payment timeout regression after refactor', outcome: 'Incident', match: 89, files: 15, risk: 'high' },
    { id: 'MR #305', author: '@dave', date: 'Jul 2', desc: 'Race condition in session invalidation handler', outcome: 'Incident', match: 91, files: 6, risk: 'critical' },
  ],
  incidents: [
    { title: 'Production outage — Payment pipeline down 45min', date: 'Jun 1', cause: 'Retry queue overflow without circuit breaker', impact: 'All payment flows blocked', duration: '45min', rootCause: 'Missing backpressure mechanism in payment worker', services: ['Payment Service', 'API Gateway'], severity: 'critical', lessons: 'Add circuit breaker pattern to all retry loops' },
    { title: 'Degraded billing processing — 3hr delay', date: 'May 15', cause: 'Billing worker OOM from unbounded retry loop', impact: '15K invoices delayed', duration: '3hr', rootCause: 'Unbounded retry queue exhausted heap memory', services: ['Billing Service'], severity: 'high', lessons: 'Bound retry counts and add memory limits to workers' },
    { title: 'Webhook delivery failure — partial data loss', date: 'Apr 28', cause: 'Missing idempotency keys caused duplicate webhook events', impact: '2% merchants affected', duration: '2hr', rootCause: 'No idempotency checking in webhook handler', services: ['Notification Service', 'Webhook Gateway'], severity: 'medium', lessons: 'Idempotency keys required for all webhook deliveries' },
  ],
  deps: [
    { service: 'Payment Service', deps: ['Auth Service', 'Database', 'Redis Cache'], risk: 87, critical: true },
    { service: 'Billing Service', deps: ['Auth Service', 'Cache', 'Payment Service'], risk: 65, critical: false },
    { service: 'Notification Service', deps: ['Auth Service'], risk: 45, critical: false },
    { service: 'API Gateway', deps: ['Payment Service', 'Auth Service', 'Billing Service'], risk: 72, critical: true },
  ],
  recommendations: [
    { action: 'Add circuit breaker pattern to all retry loops', priority: 'P0', impact: 'Prevents cascading failures', effort: '8 story points' },
    { action: 'Implement bounded retry queues with backpressure monitoring', priority: 'P0', impact: 'Prevents queue overflow incidents', effort: '5 story points' },
    { action: 'Add comprehensive integration tests with fault injection', priority: 'P1', impact: 'Catches misconfiguration before deploy', effort: '5 story points' },
    { action: 'Create deployment runbook with rollback procedures', priority: 'P1', impact: 'Reduces MTTR by 60%', effort: '3 story points' },
    { action: 'Add retry-related metrics to operations dashboard', priority: 'P2', impact: 'Improves incident detection time', effort: '2 story points' },
  ],
  rootCauses: [
    { title: 'Missing Backpressure in Payment Worker', cause: 'Retry queue overflow without circuit breaker or backpressure mechanism', impact: 'Complete payment pipeline outage for 45 minutes', duration: '45min', services: ['Payment Service', 'API Gateway'], lesson: 'All retry loops must implement circuit breaker pattern with configurable thresholds' },
    { title: 'Unbounded Retry Queue Heap Exhaustion', cause: 'Billing worker OOM from unbounded retry queue consuming all heap memory', impact: '15K invoices delayed by 3+ hours', duration: '3hr', services: ['Billing Service'], lesson: 'Bound retry counts and enforce memory limits on all background workers' },
    { title: 'Missing Idempotency in Webhook Handler', cause: 'Duplicate webhook events due to missing idempotency key checking', impact: '2% of merchants received duplicate notifications', duration: '2hr', services: ['Notification Service', 'Webhook Gateway'], lesson: 'Idempotency keys are mandatory for all webhook delivery endpoints' },
  ],
}

const severityColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/15',
  low: 'bg-green-500/10 text-green-400 border-green-500/15',
}

const impactColors = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

function AnimatedCounter({ value, suffix = '', className = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (value === undefined || value === null) return
    let start = 0
    const duration = 1500
    const step = Math.max(1, Math.floor(value / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(interval) }
      else setCount(start)
    }, duration / (value / step))
    return () => clearInterval(interval)
  }, [value])
  return <span className={className}>{count}{suffix}</span>
}

function RiskGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1500
    const step = Math.max(1, Math.floor(score / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= score) { setAnimatedScore(score); clearInterval(interval) }
      else setAnimatedScore(start)
    }, duration / (score / step))
    return () => clearInterval(interval)
  }, [score])

  const circumference = 2 * Math.PI * 42
  const offset = circumference - (animatedScore / 100) * circumference
  const strokeColor = animatedScore >= 80 ? '#ef4444' : animatedScore >= 50 ? '#f59e0b' : '#22c55e'

  return (
    <div className="flex flex-col items-center">
      <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
        <circle cx="55" cy="55" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="55" cy="55" r="42" fill="none" stroke={strokeColor} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out, stroke 0.3s' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white" style={{ color: strokeColor }}>{animatedScore}</span>
        <span className="text-[8px] text-slate-500 uppercase tracking-wider">/100</span>
      </div>
    </div>
  )
}

function ConfidenceMeter({ confidence }) {
  const [animVal, setAnimVal] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1500
    const step = Math.max(1, Math.floor(confidence / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= confidence) { setAnimVal(confidence); clearInterval(interval) }
      else setAnimVal(start)
    }, duration / (confidence / step))
    return () => clearInterval(interval)
  }, [confidence])

  const barColor = animVal >= 80 ? 'bg-green-500' : animVal >= 60 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Analysis Confidence</span>
        <span className="text-sm font-semibold text-white">{animVal}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${barColor}`}
          style={{ width: `${animVal}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-slate-600">
        <span>Inconclusive</span>
        <span>Moderate</span>
        <span>High Certainty</span>
      </div>
    </div>
  )
}

export default function IntelligenceCenter() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [expandedSection, setExpandedSection] = useState('')
  const [expandedIncident, setExpandedIncident] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [expandedFailure, setExpandedFailure] = useState(null)
  const inputRef = useRef(null)

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const investigate = (text) => {
    if (!text.trim()) return
    setLoading(true)
    setData(null)
    setExpandedSection('')
    setExpandedFailure(null)
    setExpandedIncident(null)
    setTimeout(() => { setData(investigationData); setLoading(false) }, 2000)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); investigate(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-brand/20">
                <svg className="h-4 w-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">AI Risk Investigation Console</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">Deep-dive risk analysis with failure mode detection, historical correlation, and mitigation intelligence</p>
          </div>
        </motion.div>

        {/* Input/Analysis Bar */}
        <motion.div variants={item} className="glass-card p-4 sm:p-5">
          <form onSubmit={e => { e.preventDefault(); investigate(input) }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                onFocus={() => setShowPresets(true)}
                onKeyDown={handleKey}
                placeholder='Enter a feature request for deep investigation, e.g. "Add payment retry support"'
                className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-44 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/40 focus:bg-slate-800/80 transition-all"
                disabled={loading}
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                <button type="submit" disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-brand px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20">
                  {loading ? (
                    <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Investigating</>
                  ) : (
                    <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>Investigate</>
                  )}
                </button>
              </div>
            </div>
          </form>
          <AnimatePresence>
            {showPresets && filtered.length > 0 && !loading && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden">
                {filtered.map((s, i) => (
                  <button key={s} type="button"
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`}
                    onClick={() => { setInput(s); setShowPresets(false); investigate(s) }}>
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading State — 6 skeleton cards */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="h-3 w-24 bg-slate-800 rounded mb-3" />
                  <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-32 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
            <div className="glass-card p-5 animate-pulse">
              <div className="h-4 w-48 bg-slate-800 rounded mb-4" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-14 bg-slate-800 rounded mb-2" />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5 animate-pulse">
                <div className="h-48 bg-slate-800 rounded" />
              </div>
              <div className="glass-card p-5 animate-pulse">
                <div className="h-48 bg-slate-800 rounded" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* Executive Summary Card */}
              <motion.div variants={item} className="glass-card overflow-hidden">
                <div className="relative p-5 sm:p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] to-brand/[0.02] pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-brand/20">
                            <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                          </div>
                          <h2 className="text-lg font-semibold text-white">Executive Summary</h2>
                        </div>
                        <p className="text-xs text-slate-500">AI-powered risk assessment for this feature change</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-soft" />
                        Risk Score: {data.riskScore}/100
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider">Verdict</span>
                        <p className="text-sm font-semibold text-white mt-1">{data.verdict}</p>
                      </div>
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider">Key Findings</span>
                        <p className="text-sm font-semibold text-white mt-1">
                          <AnimatedCounter value={data.keyFindings} className="text-white" />
                          <span className="text-slate-500 ml-1">critical items</span>
                        </p>
                      </div>
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider">Recommendations</span>
                        <p className="text-sm font-semibold text-white mt-1">
                          <AnimatedCounter value={data.recommendationsCount} className="text-white" />
                          <span className="text-slate-500 ml-1">actions required</span>
                        </p>
                      </div>
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider">Confidence</span>
                        <p className="text-sm font-semibold text-cyan-400 mt-1">
                          <AnimatedCounter value={data.confidence} suffix="%" className="text-cyan-400" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Summary Stats Row — 5 animated stat cards */}
              <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="glass-card p-4 text-center hover:border-cyan-500/20 transition-all">
                  <div className="flex justify-center mb-2">
                    <div className="relative">
                      <RiskGauge score={data.riskScore} />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">AI Risk Score</div>
                </div>
                <div className="glass-card p-4 text-center hover:border-orange-500/20 transition-all">
                  <div className="text-2xl font-bold text-orange-400">
                    <AnimatedCounter value={data.totalFailures} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Total Failure Modes</div>
                  <div className="flex justify-center gap-2 mt-1 text-[8px] text-slate-600">
                    <span className="text-red-400">{data.criticalFailures}C</span>
                    <span className="text-orange-400">{data.highFailures}H</span>
                    <span className="text-yellow-400">{data.mediumFailures}M</span>
                    <span className="text-green-400">{data.lowFailures}L</span>
                  </div>
                </div>
                <div className="glass-card p-4 text-center hover:border-red-500/20 transition-all">
                  <div className="text-2xl font-bold text-red-400">
                    <AnimatedCounter value={data.criticalFailures} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Critical Failures</div>
                  <div className="text-[8px] text-slate-600 mt-1">Highest priority</div>
                </div>
                <div className="glass-card p-4 text-center hover:border-brand/20 transition-all">
                  <div className="text-2xl font-bold text-brand-light">
                    <AnimatedCounter value={data.mrsAnalyzed} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">MRs Analyzed</div>
                  <div className="text-[8px] text-slate-600 mt-1">Historical correlation</div>
                </div>
                <div className="glass-card p-4 text-center hover:border-green-500/20 transition-all">
                  <div className="text-2xl font-bold text-green-400">
                    <AnimatedCounter value={data.incidentsPrevented} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Incidents Prevented</div>
                  <div className="text-[8px] text-slate-600 mt-1">Estimated impact</div>
                </div>
              </motion.div>

              {/* Dependency Graph Visualization */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-brand/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Dependency Graph</h3>
                </div>
                <div className="relative w-full overflow-x-auto">
                  <svg viewBox="0 0 640 280" className="w-full max-w-3xl mx-auto" style={{ minWidth: 500 }}>
                    <defs>
                      <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="rgba(6,182,212,0.4)" />
                      </marker>
                      <linearGradient id="nodeGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(6,182,212,0.15)" />
                        <stop offset="100%" stopColor="rgba(6,182,212,0.05)" />
                      </linearGradient>
                    </defs>
                    <line x1="320" y1="30" x2="80" y2="110" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                    <line x1="320" y1="30" x2="180" y2="110" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                    <line x1="320" y1="30" x2="320" y2="110" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                    <line x1="320" y1="30" x2="460" y2="110" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                    <line x1="320" y1="30" x2="560" y2="110" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                    <line x1="80" y1="110" x2="40" y2="200" stroke="rgba(6,182,212,0.15)" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    <line x1="80" y1="110" x2="120" y2="200" stroke="rgba(6,182,212,0.15)" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    <line x1="180" y1="110" x2="220" y2="200" stroke="rgba(6,182,212,0.15)" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    <line x1="460" y1="110" x2="420" y2="200" stroke="rgba(6,182,212,0.15)" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    <line x1="460" y1="110" x2="500" y2="200" stroke="rgba(6,182,212,0.15)" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    <line x1="560" y1="110" x2="600" y2="200" stroke="rgba(6,182,212,0.15)" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    <rect x="260" y="10" width="120" height="36" rx="8" fill="url(#nodeGrad)" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
                    <text x="320" y="33" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Payment Service</text>
                    <rect x="30" y="92" width="100" height="36" rx="8" fill="url(#nodeGrad)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                    <text x="80" y="115" textAnchor="middle" fill="#94a3b8" fontSize="10">Auth Service</text>
                    <rect x="140" y="92" width="80" height="36" rx="8" fill="url(#nodeGrad)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                    <text x="180" y="115" textAnchor="middle" fill="#94a3b8" fontSize="10">Database</text>
                    <rect x="270" y="92" width="100" height="36" rx="8" fill="url(#nodeGrad)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                    <text x="320" y="115" textAnchor="middle" fill="#94a3b8" fontSize="10">Redis Cache</text>
                    <rect x="410" y="92" width="100" height="36" rx="8" fill="url(#nodeGrad)" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
                    <text x="460" y="115" textAnchor="middle" fill="#22d3ee" fontSize="10">Billing Service</text>
                    <rect x="520" y="92" width="80" height="36" rx="8" fill="url(#nodeGrad)" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
                    <text x="560" y="115" textAnchor="middle" fill="#22d3ee" fontSize="10">API Gateway</text>
                    <rect x="10" y="190" width="60" height="30" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x="40" y="209" textAnchor="middle" fill="#64748b" fontSize="8">Workers</text>
                    <rect x="90" y="190" width="60" height="30" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x="120" y="209" textAnchor="middle" fill="#64748b" fontSize="8">Queue</text>
                    <rect x="190" y="190" width="60" height="30" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x="220" y="209" textAnchor="middle" fill="#64748b" fontSize="8">Pool</text>
                    <rect x="390" y="190" width="60" height="30" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x="420" y="209" textAnchor="middle" fill="#64748b" fontSize="8">Cache</text>
                    <rect x="470" y="190" width="60" height="30" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x="500" y="209" textAnchor="middle" fill="#64748b" fontSize="8">Webhooks</text>
                    <rect x="570" y="190" width="60" height="30" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x="600" y="209" textAnchor="middle" fill="#64748b" fontSize="8">Config</text>
                  </svg>
                </div>
              </motion.div>

              {/* Blast Radius Map */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <svg className="h-3 w-3 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Blast Radius</h3>
                  <StatusBadge status="critical" label={`${data.blastRadius.totalServices} services affected`} />
                </div>
                <div className="relative flex justify-center">
                  <svg viewBox="0 0 400 340" className="w-full max-w-md">
                    <circle cx="200" cy="170" r="38" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
                    <circle cx="200" cy="170" r="70" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.25)" strokeWidth="1" strokeDasharray="3 4" />
                    <circle cx="200" cy="170" r="110" fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="3 5" />
                    <circle cx="200" cy="170" r="155" fill="rgba(6,182,212,0.03)" stroke="rgba(6,182,212,0.12)" strokeWidth="1" strokeDasharray="2 6" />
                    <rect x="168" y="148" width="64" height="28" rx="6" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
                    <text x="200" y="167" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="600">Payment</text>
                    <rect x="130" y="118" width="52" height="20" rx="4" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.25)" strokeWidth="1" />
                    <text x="156" y="132" textAnchor="middle" fill="#fbbf24" fontSize="7">Billing</text>
                    <rect x="248" y="118" width="52" height="20" rx="4" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.25)" strokeWidth="1" />
                    <text x="274" y="132" textAnchor="middle" fill="#fbbf24" fontSize="7">API Gateway</text>
                    <rect x="95" y="86" width="52" height="20" rx="4" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                    <text x="121" y="100" textAnchor="middle" fill="#67e8f9" fontSize="7">Auth</text>
                    <rect x="253" y="86" width="52" height="20" rx="4" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                    <text x="279" y="100" textAnchor="middle" fill="#67e8f9" fontSize="7">Notif</text>
                    <rect x="170" y="60" width="60" height="20" rx="4" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.1)" strokeWidth="1" />
                    <text x="200" y="74" textAnchor="middle" fill="#67e8f9" fontSize="7">Redis</text>
                    <rect x="295" y="170" width="52" height="20" rx="4" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.1)" strokeWidth="1" />
                    <text x="321" y="184" textAnchor="middle" fill="#67e8f9" fontSize="7">DB</text>
                    <rect x="50" y="170" width="52" height="20" rx="4" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.1)" strokeWidth="1" />
                    <text x="76" y="184" textAnchor="middle" fill="#67e8f9" fontSize="7">Cache</text>
                    <text x="200" y="278" textAnchor="middle" fill="#64748b" fontSize="8">
                      Blast depth: {data.blastRadius.depth} &mdash; {data.blastRadius.totalServices} total services
                    </text>
                    <text x="200" y="293" textAnchor="middle" fill="#64748b" fontSize="7">
                      Inner ring: critical &bull; Middle: high &bull; Outer: medium/low
                    </text>
                  </svg>
                </div>
              </motion.div>

              {/* Affected Services */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-brand/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Affected Services</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-slate-600">
                        <th className="pb-2 pr-4 font-medium">Service</th>
                        <th className="pb-2 pr-4 font-medium">Impact</th>
                        <th className="pb-2 pr-4 font-medium">Risk Score</th>
                        <th className="pb-2 pr-4 font-medium">Files Changed</th>
                        <th className="pb-2 pr-4 font-medium">Lines Changed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.affectedServices.map((s, i) => (
                        <motion.tr key={s.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <span className={`h-1.5 w-1.5 rounded-full ${s.impact === 'critical' ? 'bg-red-500' : s.impact === 'high' ? 'bg-orange-500' : s.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                              <span className="text-slate-300 font-medium">{s.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${impactColors[s.impact]}`}>{s.impact}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-white/[0.06] overflow-hidden">
                                <div className={`h-full rounded-full ${s.risk >= 80 ? 'bg-red-500' : s.risk >= 50 ? 'bg-orange-500' : s.risk >= 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                  style={{ width: `${s.risk}%` }} />
                              </div>
                              <span className="text-slate-500 text-[9px]">{s.risk}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-slate-400">{s.filesChanged}</td>
                          <td className="py-3 text-slate-400 font-mono text-[9px]">{s.linesChanged}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Risk Timeline */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-brand/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Risk Timeline</h3>
                </div>
                <div className="relative">
                  <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/[0.06]" />
                  <div className="space-y-0">
                    {data.riskTimeline.map((phase, i) => {
                      const riskColor = phase.risk >= 80 ? 'bg-red-500' : phase.risk >= 50 ? 'bg-orange-500' : 'bg-yellow-500'
                      const dotColor = phase.risk >= 80 ? 'bg-red-500 border-red-500/30' : phase.risk >= 50 ? 'bg-orange-500 border-orange-500/30' : 'bg-yellow-500 border-yellow-500/30'
                      return (
                        <motion.div key={phase.phase} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          className="relative flex items-start gap-4 py-3 group">
                          <div className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border-2 ${dotColor}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-300">{phase.phase}</span>
                              <span className={`text-[10px] font-semibold ${phase.risk >= 80 ? 'text-red-400' : phase.risk >= 50 ? 'text-orange-400' : 'text-yellow-400'}`}>
                                Risk: {phase.risk}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-1000 ${riskColor}`}
                                style={{ width: `${phase.risk}%` }} />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Failure Mode Analysis — Accordion */}
              <motion.div variants={item} className="glass-card overflow-hidden">
                <div className="flex items-center gap-2 p-5 pb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <svg className="h-3 w-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Failure Mode Analysis</h3>
                  <span className="text-[10px] text-slate-600 ml-1">({data.failureModes.length} modes)</span>
                </div>
                <div className="px-5 pb-5 space-y-2">
                  {data.failureModes.map((f, i) => {
                    const isOpen = expandedFailure === i
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-cyan-500/20 transition-all">
                        <button onClick={() => setExpandedFailure(isOpen ? null : i)}
                          className="flex w-full items-center justify-between p-3 text-left">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold shrink-0 ${severityColors[f.severity]}`}>{f.severity}</span>
                            <span className="text-xs text-slate-300">{f.mode}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <StatusBadge status={f.probability === 'High' ? 'critical' : f.probability === 'Medium' ? 'warning' : 'info'} label={f.probability} />
                            <svg className={`h-3.5 w-3.5 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              className="border-t border-white/[0.04]">
                              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                                <div className="rounded bg-white/[0.02] p-2"><span className="text-slate-600 block mb-0.5">Impact</span><span className="text-slate-400">{f.impact}</span></div>
                                <div className="rounded bg-white/[0.02] p-2"><span className="text-slate-600 block mb-0.5">Detection</span><span className="text-slate-400">{f.detection}</span></div>
                                <div className="rounded bg-white/[0.02] p-2 sm:col-span-2"><span className="text-slate-600 block mb-0.5">Mitigation</span><span className="text-cyan-400">{f.mitigation}</span></div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Historical Incident Matches */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-brand/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Historical Incident Matches</h3>
                </div>
                <div className="space-y-2">
                  {data.mrs.map((mr, i) => (
                    <motion.div key={mr.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">{mr.id}</span>
                          <span className="text-[10px] font-mono text-slate-500">{mr.author}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${mr.outcome === 'Incident' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{mr.outcome}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[10px] text-slate-600">{mr.date}</span>
                          <span className="text-[10px] font-semibold text-cyan-400">{mr.match}% match</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{mr.desc}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] text-slate-600">{mr.files} files changed</span>
                        {mr.risk && (
                          <StatusBadge status={mr.risk === 'critical' ? 'critical' : mr.risk === 'high' ? 'high' : 'warning'} label={`${mr.risk} risk`} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Root Cause Analysis */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <svg className="h-3 w-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Root Cause Analysis</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {data.rootCauses.map((rc, i) => (
                    <motion.div key={rc.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all">
                      <div className="flex items-start gap-2 mb-2">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[8px] font-bold ${i === 0 ? 'bg-red-500/20 text-red-400' : i === 1 ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {i + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-200">{rc.title}</h4>
                          <p className="text-[9px] text-slate-500 mt-0.5">{rc.duration} &middot; {rc.services.join(', ')}</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-400 mb-1"><span className="text-slate-600">Cause:</span> {rc.cause}</p>
                      <p className="text-[9px] text-slate-400 mb-1"><span className="text-slate-600">Impact:</span> {rc.impact}</p>
                      <div className="mt-2 rounded bg-green-500/[0.06] px-2 py-1.5">
                        <span className="text-[8px] text-green-400 font-medium">Lesson: </span>
                        <span className="text-[8px] text-slate-400">{rc.lesson}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recommended Mitigations */}
              <motion.div variants={item} className="glass-card overflow-hidden">
                <div className="flex items-center gap-2 p-5 pb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <svg className="h-3 w-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Recommended Mitigations</h3>
                </div>
                <div className="px-5 pb-5 space-y-2">
                  {data.recommendations.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-green-500/20 transition-all">
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        <StatusBadge status={r.priority === 'P0' ? 'critical' : r.priority === 'P1' ? 'warning' : 'info'} label={r.priority} dot={false} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 font-medium">{r.action}</p>
                        <div className="flex gap-3 mt-0.5 text-[9px] text-slate-600">
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                            {r.impact}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {r.effort}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Confidence Meter */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-brand/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Analysis Confidence</h3>
                </div>
                <ConfidenceMeter confidence={data.confidence} />
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!data && !loading && (
          <motion.div variants={item} className="text-center py-16">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/5 to-brand/5">
              <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Investigate feature risk</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter a feature request above to run a full investigation — failure modes, historical MRs, incident root causes, dependency chains, and AI-powered mitigation recommendations.</p>
          </motion.div>
        )}

      </motion.div>
    </Layout>
  )
}
