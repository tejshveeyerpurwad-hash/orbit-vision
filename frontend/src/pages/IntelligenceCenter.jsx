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
    { action: 'Add circuit breaker pattern to all retry loops', priority: 'P0', impact: 'Prevents cascading failures', effort: '8 story points', owner: '@alice' },
    { action: 'Implement bounded retry queues with backpressure monitoring', priority: 'P0', impact: 'Prevents queue overflow incidents', effort: '5 story points', owner: '@bob' },
    { action: 'Add comprehensive integration tests with fault injection', priority: 'P1', impact: 'Catches misconfiguration before deploy', effort: '5 story points', owner: '@carol' },
    { action: 'Create deployment runbook with rollback procedures', priority: 'P1', impact: 'Reduces MTTR by 60%', effort: '3 story points', owner: '@alice' },
    { action: 'Add retry-related metrics to operations dashboard', priority: 'P2', impact: 'Improves incident detection time', effort: '2 story points', owner: '@dave' },
  ],
  rootCauses: [
    { title: 'Missing Backpressure in Payment Worker', cause: 'Retry queue overflow without circuit breaker or backpressure mechanism', impact: 'Complete payment pipeline outage for 45 minutes', duration: '45min', services: ['Payment Service', 'API Gateway'], lesson: 'All retry loops must implement circuit breaker pattern with configurable thresholds' },
    { title: 'Unbounded Retry Queue Heap Exhaustion', cause: 'Billing worker OOM from unbounded retry queue consuming all heap memory', impact: '15K invoices delayed by 3+ hours', duration: '3hr', services: ['Billing Service'], lesson: 'Bound retry counts and enforce memory limits on all background workers' },
    { title: 'Missing Idempotency in Webhook Handler', cause: 'Duplicate webhook events due to missing idempotency key checking', impact: '2% of merchants received duplicate notifications', duration: '2hr', services: ['Notification Service', 'Webhook Gateway'], lesson: 'Idempotency keys are mandatory for all webhook delivery endpoints' },
  ],
  rootCauseChains: [
    { title: 'Circuit Breaker Failure', chain: [
      { cause: 'Missing circuit breaker in payment worker', evidence: 12, confidence: 94 },
      { cause: 'Retry queue overflow under load spike', evidence: 8, confidence: 89 },
      { cause: 'Complete payment pipeline outage (45min)', evidence: 15, confidence: 97 },
    ]},
    { title: 'Memory Exhaustion Chain', chain: [
      { cause: 'Unbounded retry queue in billing worker', evidence: 7, confidence: 91 },
      { cause: 'Worker OOM crash after 4hr continuous retry', evidence: 5, confidence: 86 },
      { cause: '15K invoices delayed by 3+ hours', evidence: 10, confidence: 93 },
    ]},
    { title: 'Idempotency Gap Chain', chain: [
      { cause: 'Missing idempotency keys in webhook handler', evidence: 6, confidence: 88 },
      { cause: 'Duplicate webhook events sent to merchants', evidence: 4, confidence: 82 },
      { cause: '2% merchants received duplicate notifications', evidence: 8, confidence: 90 },
    ]},
  ],
  evidenceTimeline: [
    { date: '2024-05-28', type: 'Code Change', description: 'Retry logic added to payment handler', source: 'GitLab MR #142', relevance: 92 },
    { date: '2024-05-30', type: 'Code Change', description: 'Circuit breaker config deployed to staging', source: 'GitLab MR #156', relevance: 85 },
    { date: '2024-06-01', type: 'Incident', description: 'Payment pipeline outage lasting 45 minutes', source: 'PagerDuty #INC-3841', relevance: 97 },
    { date: '2024-06-10', type: 'Config Change', description: 'Retry queue limits adjusted (max 10K → 5K)', source: 'GitLab MR #198', relevance: 78 },
    { date: '2024-06-15', type: 'Alert', description: 'Billing worker memory threshold breach detected', source: 'Datadog Alert', relevance: 88 },
    { date: '2024-06-22', type: 'Code Change', description: 'Idempotency keys added to webhook endpoints', source: 'GitLab MR #211', relevance: 73 },
  ],
  correlations: [
    { incident: 'Payment pipeline outage', score: 87, commonCause: 'Missing circuit breaker', services: ['Payment', 'API Gateway'], gap: '2 days' },
    { incident: 'Billing processing delay', score: 91, commonCause: 'Unbounded retry queue', services: ['Billing Service'], gap: '5 days' },
    { incident: 'Webhook delivery failure', score: 78, commonCause: 'Missing idempotency keys', services: ['Notification', 'Webhook Gateway'], gap: '3 days' },
    { incident: 'API gateway timeout spike', score: 84, commonCause: 'Connection pool exhaustion', services: ['API Gateway', 'Auth Service'], gap: '1 day' },
    { incident: 'Database connection stall', score: 72, commonCause: 'Pool limit misconfiguration', services: ['Database', 'Payment Service'], gap: '4 days' },
  ],
  heatmap: [
    { phase: 'Design', critical: 15, high: 25, medium: 10, low: 5 },
    { phase: 'Implementation', critical: 30, high: 45, medium: 20, low: 10 },
    { phase: 'Testing', critical: 55, high: 60, medium: 35, low: 15 },
    { phase: 'Deployment', critical: 80, high: 70, medium: 45, low: 25 },
    { phase: 'Post-Release', critical: 45, high: 50, medium: 30, low: 20 },
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
    const duration = 1800
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
  const severityLabel = animatedScore >= 80 ? 'Critical' : animatedScore >= 50 ? 'Elevated' : 'Moderate'

  return (
    <div className="flex flex-col items-center relative">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="60" cy="60" r="42" fill="none" stroke={strokeColor} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.8s ease-out, stroke 0.3s' }}
        />
        <circle cx="60" cy="60" r="32" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2 4" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white drop-shadow-lg" style={{ color: strokeColor }}>{animatedScore}</span>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{severityLabel}</span>
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
        <span className="text-xs text-slate-500 font-mono tracking-wide">INVESTIGATION CONFIDENCE</span>
        <span className="text-sm font-bold text-white">{animVal}%</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${barColor}`}
          style={{ width: `${animVal}%` }} />
        {/* threshold markers */}
        <div className="absolute top-0 left-[60%] h-full w-px bg-white/20" />
        <div className="absolute top-0 left-[80%] h-full w-px bg-white/20" />
      </div>
      <div className="flex justify-between text-[9px] text-slate-600 font-mono">
        <span>0%</span>
        <span>60% Threshold</span>
        <span>80% Threshold</span>
        <span>100%</span>
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
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const inputRef = useRef(null)

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const investigate = (text) => {
    if (!text.trim()) return
    setLoading(true)
    setData(null)
    setExpandedSection('')
    setExpandedFailure(null)
    setExpandedIncident(null)
    setSelectedEvidence(null)
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

        {/* ===== 1. Investigation Header ===== */}
        <motion.div variants={item} className="glass-card overflow-hidden">
          <div className="relative p-5 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] to-blue-500/[0.02] pointer-events-none" />
            <div className="relative flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/10">
                  <svg className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-mono text-xl font-bold tracking-widest text-white uppercase">Investigation Console</h1>
                  <p className="text-xs text-slate-500 font-mono tracking-wide">AI-Powered Forensic Intelligence Engine</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-slate-500 border border-white/[0.08] rounded-md px-2.5 py-1 tracking-wider">#OV-2024-0847</span>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-mono tracking-wider border border-green-500/20 rounded-md px-2.5 py-1">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== 2. Investigation Workspace Input ===== */}
        <motion.div variants={item} className="glass-card p-4 sm:p-5">
          <form onSubmit={e => { e.preventDefault(); investigate(input) }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                onFocus={() => setShowPresets(true)}
                onKeyDown={handleKey}
                placeholder='Enter feature or incident to investigate...'
                className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-44 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-slate-800/80 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all font-mono tracking-wide"
                disabled={loading}
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                <button type="submit" disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed">
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ===== Loading State ===== */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="h-3 w-28 bg-slate-800 rounded mb-3" />
                  <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-36 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5 animate-pulse">
                <div className="h-4 w-40 bg-slate-800 rounded mb-4" />
                <div className="h-48 bg-slate-800 rounded" />
              </div>
              <div className="glass-card p-5 animate-pulse">
                <div className="h-4 w-40 bg-slate-800 rounded mb-4" />
                <div className="h-48 bg-slate-800 rounded" />
              </div>
            </div>
            <div className="glass-card p-5 animate-pulse">
              <div className="h-4 w-48 bg-slate-800 rounded mb-4" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-12 bg-slate-800 rounded mb-2" />
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== Results ===== */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* ===== 3. Evidence Summary Strip — 5 animated stat cards ===== */}
              <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="glass-card p-4 text-center hover:border-cyan-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-cyan-400">
                      <AnimatedCounter value={data.totalFailures} />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">Total Failure Modes</div>
                    <div className="flex justify-center gap-2 mt-1 text-[8px] text-slate-600">
                      <span className="text-red-400">{data.criticalFailures}C</span>
                      <span className="text-orange-400">{data.highFailures}H</span>
                      <span className="text-yellow-400">{data.mediumFailures}M</span>
                      <span className="text-green-400">{data.lowFailures}L</span>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4 text-center hover:border-red-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-red-400">
                      <AnimatedCounter value={data.criticalFailures} />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">Critical Threats</div>
                    <div className="text-[8px] text-red-400/60 mt-1">Requires immediate action</div>
                  </div>
                </div>
                <div className="glass-card p-4 text-center hover:border-blue-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-blue-400">
                      <AnimatedCounter value={data.mrsAnalyzed} />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">MRs Correlated</div>
                    <div className="text-[8px] text-blue-400/60 mt-1">Historical analysis</div>
                  </div>
                </div>
                <div className="glass-card p-4 text-center hover:border-green-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-green-400">
                      <AnimatedCounter value={data.incidentsPrevented} />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">Incidents Prevented</div>
                    <div className="text-[8px] text-green-400/60 mt-1">Estimated by AI model</div>
                  </div>
                </div>
                <div className="glass-card p-4 text-center hover:border-cyan-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-cyan-400">
                      <AnimatedCounter value={data.confidence} suffix="%" />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">Investigation Confidence</div>
                    <div className="text-[8px] text-cyan-400/60 mt-1">AI certainty level</div>
                  </div>
                </div>
              </motion.div>

              {/* ===== 4. AI Risk Score + Summary ===== */}
              <motion.div variants={item} className="grid gap-4 lg:grid-cols-3">
                <div className="glass-card p-5 flex flex-col items-center justify-center lg:col-span-1">
                  <h3 className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-4">AI Risk Score</h3>
                  <RiskGauge score={data.riskScore} />
                  <div className="flex items-center gap-2 mt-4">
                    <span className={`h-2 w-2 rounded-full ${data.riskScore >= 80 ? 'bg-red-500' : data.riskScore >= 50 ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
                    <span className="text-xs font-mono text-slate-400">
                      Classification: <span className={data.riskScore >= 80 ? 'text-red-400' : data.riskScore >= 50 ? 'text-yellow-400' : 'text-green-400'}>{data.verdict}</span>
                    </span>
                  </div>
                </div>
                <div className="glass-card p-5 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white">Executive Summary</h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300">
                      Score: {data.riskScore}/100
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-600 font-mono tracking-wider">Verdict</span>
                      <p className="text-sm font-semibold text-white mt-1">{data.verdict}</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-600 font-mono tracking-wider">Key Findings</span>
                      <p className="text-sm font-semibold text-white mt-1">
                        <AnimatedCounter value={data.keyFindings} className="text-white" />
                        <span className="text-slate-500 ml-1 text-xs">critical items</span>
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-600 font-mono tracking-wider">Recommendations</span>
                      <p className="text-sm font-semibold text-white mt-1">
                        <AnimatedCounter value={data.recommendationsCount} className="text-white" />
                        <span className="text-slate-500 ml-1 text-xs">actions required</span>
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-600 font-mono tracking-wider">Confidence</span>
                      <p className="text-sm font-semibold text-cyan-400 mt-1">
                        <AnimatedCounter value={data.confidence} suffix="%" className="text-cyan-400" />
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ===== 5. Root Cause Explorer ===== */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <svg className="h-3 w-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Root Cause Explorer</h3>
                  <span className="text-[10px] text-slate-600 font-mono">3 causal chains identified</span>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {data.rootCauseChains.map((chain, ci) => (
                    <div key={ci} className="relative">
                      <h4 className="text-[10px] text-slate-500 font-mono tracking-wider mb-3 uppercase">{chain.title}</h4>
                      <div className="relative flex flex-col items-center">
                        {/* SVG connecting lines */}
                        <svg className="absolute top-0 left-1/2 w-full h-full -translate-x-1/2 pointer-events-none" style={{ zIndex: 0 }}>
                          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(6,182,212,0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
                        </svg>
                        {chain.chain.map((node, ni) => (
                          <div key={ni} className="relative z-10 w-full flex flex-col items-center">
                            {ni > 0 && (
                              <div className="flex flex-col items-center my-1">
                                <svg width="16" height="16" viewBox="0 0 16 16" className="text-cyan-500/40">
                                  <path d="M8 12L3 4h10z" fill="currentColor" />
                                </svg>
                              </div>
                            )}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: ni * 0.15 + ci * 0.1 }}
                              className={`w-full rounded-lg border p-3 transition-all hover:border-cyan-500/30 cursor-pointer
                                ${ni === 0 ? 'border-orange-500/20 bg-orange-500/[0.03]' : ni === 1 ? 'border-yellow-500/20 bg-yellow-500/[0.02]' : 'border-red-500/20 bg-red-500/[0.03]'}`}
                              onClick={() => setSelectedEvidence(selectedEvidence === `${ci}-${ni}` ? null : `${ci}-${ni}`)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-[10px] font-medium ${ni === 2 ? 'text-red-300' : 'text-slate-300'}`}>{node.cause}</p>
                                <span className="shrink-0 rounded bg-white/[0.04] px-1.5 py-0.5 text-[8px] font-mono text-slate-500">
                                  E:{node.evidence}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                  <div className={`h-full rounded-full ${node.confidence >= 90 ? 'bg-green-500' : node.confidence >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                                    style={{ width: `${node.confidence}%` }} />
                                </div>
                                <span className="text-[8px] font-mono text-slate-600">{node.confidence}%</span>
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ===== 6. Dependency Graph Visualization ===== */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Dependency Graph</h3>
                  <span className="text-[10px] text-slate-600 font-mono">4 services · 7 dependencies</span>
                </div>
                <div className="relative w-full overflow-x-auto">
                  <svg viewBox="0 0 700 350" className="w-full max-w-4xl mx-auto" style={{ minWidth: 600 }}>
                    <defs>
                      <marker id="arrowCyan" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(6,182,212,0.5)" />
                      </marker>
                      <marker id="arrowRed" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(239,68,68,0.5)" />
                      </marker>
                      <linearGradient id="nodeCyan" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(6,182,212,0.15)" />
                        <stop offset="100%" stopColor="rgba(6,182,212,0.05)" />
                      </linearGradient>
                      <linearGradient id="nodeRed" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(239,68,68,0.2)" />
                        <stop offset="100%" stopColor="rgba(239,68,68,0.05)" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* Background grid pattern */}
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                    </pattern>
                    <rect width="700" height="350" fill="url(#grid)" />

                    {/* Edges with labels */}
                    {/* API Gateway → Payment Service */}
                    <path d="M 105 80 C 105 140, 200 140, 200 200" fill="none" stroke="rgba(239,68,68,0.35)" strokeWidth="2" markerEnd="url(#arrowRed)" strokeDasharray="6 3" />
                    <text x="120" y="130" fill="#ef4444" fontSize="7" fontFamily="monospace" opacity="0.7">depends-on</text>

                    {/* API Gateway → Billing */}
                    <path d="M 105 80 C 105 140, 300 140, 300 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                    <text x="160" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">route-to</text>

                    {/* Payment → Database */}
                    <path d="M 330 80 C 330 140, 440 140, 440 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                    <text x="370" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">reads/writes</text>

                    {/* Payment → Auth */}
                    <path d="M 330 80 C 330 140, 530 140, 530 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                    <text x="400" y="160" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">auth-check</text>

                    {/* Billing → Notification */}
                    <path d="M 540 80 C 540 140, 620 140, 620 200" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" />
                    <text x="560" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">event</text>

                    {/* Billing → Payment */}
                    <path d="M 540 80 C 500 130, 380 130, 330 200" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" strokeDasharray="3 3" />
                    <text x="460" y="130" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">sync</text>

                    {/* Notification → Webhook */}
                    <path d="M 105 280 L 220 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" />
                    <text x="130" y="275" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">deliver</text>

                    {/* Payment → Redis */}
                    <path d="M 330 200 L 330 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" />
                    <text x="340" y="245" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">cache</text>

                    {/* Auth → Database */}
                    <path d="M 540 200 L 540 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" />
                    <text x="550" y="245" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">verify</text>

                    {/* Service Boxes — Top Row */}
                    {/* API Gateway */}
                    <rect x="45" y="50" width="120" height="48" rx="8" fill="url(#nodeCyan)" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5" />
                    <text x="105" y="73" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600" fontFamily="monospace">API Gateway</text>
                    <text x="105" y="88" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 72</text>

                    {/* Payment Service (critical) */}
                    <rect x="270" y="50" width="120" height="48" rx="8" fill="url(#nodeRed)" stroke="rgba(239,68,68,0.5)" strokeWidth="2" filter="url(#glow)" />
                    <text x="330" y="73" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="600" fontFamily="monospace">Payment Service</text>
                    <text x="330" y="88" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="monospace">Risk: 87 ⚠</text>

                    {/* Billing Service */}
                    <rect x="480" y="50" width="120" height="48" rx="8" fill="url(#nodeCyan)" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5" />
                    <text x="540" y="73" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600" fontFamily="monospace">Billing Service</text>
                    <text x="540" y="88" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 65</text>

                    {/* Service Boxes — Bottom Row */}
                    {/* Database (critical) */}
                    <rect x="270" y="200" width="120" height="48" rx="8" fill="url(#nodeRed)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
                    <text x="330" y="223" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="600" fontFamily="monospace">Database</text>
                    <text x="330" y="238" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 55</text>

                    {/* Auth Service */}
                    <rect x="480" y="200" width="120" height="48" rx="8" fill="url(#nodeCyan)" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />
                    <text x="540" y="223" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="monospace">Auth Service</text>
                    <text x="540" y="238" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 38</text>

                    {/* Notification Service */}
                    <rect x="45" y="250" width="120" height="40" rx="8" fill="url(#nodeCyan)" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />
                    <text x="105" y="270" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">Notification</text>
                    <text x="105" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 45</text>

                    {/* Webhook Gateway */}
                    <rect x="230" y="250" width="100" height="40" rx="8" fill="url(#nodeCyan)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                    <text x="280" y="270" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="600" fontFamily="monospace">Webhook GW</text>
                    <text x="280" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 42</text>

                    {/* Redis Cache */}
                    <rect x="480" y="250" width="100" height="40" rx="8" fill="url(#nodeCyan)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                    <text x="530" y="270" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">Redis Cache</text>
                    <text x="530" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 25</text>

                    {/* Legend */}
                    <rect x="590" y="290" width="12" height="6" rx="2" fill="rgba(239,68,68,0.3)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
                    <text x="606" y="296" fill="#64748b" fontSize="7" fontFamily="monospace">Critical</text>
                    <rect x="650" y="290" width="12" height="6" rx="2" fill="rgba(6,182,212,0.2)" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
                    <text x="666" y="296" fill="#64748b" fontSize="7" fontFamily="monospace">Normal</text>
                  </svg>
                </div>
              </motion.div>

              {/* ===== 7. Blast Radius Analysis ===== */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <svg className="h-3 w-3 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Blast Radius Analysis</h3>
                  <StatusBadge status="critical" label={`${data.blastRadius.totalServices} services affected`} />
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                  <svg viewBox="0 0 480 380" className="w-full max-w-md shrink-0">
                    <defs>
                      <radialGradient id="ring0" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(239,68,68,0.25)" />
                        <stop offset="100%" stopColor="rgba(239,68,68,0.05)" />
                      </radialGradient>
                      <radialGradient id="ring1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(239,68,68,0.12)" />
                        <stop offset="100%" stopColor="rgba(239,68,68,0.02)" />
                      </radialGradient>
                      <radialGradient id="ring2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(245,158,11,0.08)" />
                        <stop offset="100%" stopColor="rgba(245,158,11,0.02)" />
                      </radialGradient>
                      <radialGradient id="ring3" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(6,182,212,0.05)" />
                        <stop offset="100%" stopColor="rgba(6,182,212,0.01)" />
                      </radialGradient>
                    </defs>

                    {/* Ring 3 — Downstream Impact */}
                    <circle cx="240" cy="190" r="170" fill="url(#ring3)" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="4 6" />
                    <text x="370" y="70" fill="#67e8f9" fontSize="8" fontFamily="monospace" opacity="0.7">Downstream Impact</text>
                    <text x="380" y="85" fill="#64748b" fontSize="7" fontFamily="monospace">Database, Webhook GW</text>

                    {/* Ring 2 — Transitive Dependencies */}
                    <circle cx="240" cy="190" r="125" fill="url(#ring2)" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="50" y="130" fill="#fbbf24" fontSize="8" fontFamily="monospace" opacity="0.8">Transitive Dependencies</text>
                    <text x="50" y="145" fill="#64748b" fontSize="7" fontFamily="monospace">Billing, Auth Service</text>

                    {/* Ring 1 — Direct Dependencies */}
                    <circle cx="240" cy="190" r="80" fill="url(#ring1)" stroke="rgba(239,68,68,0.25)" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="240" y="130" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="monospace" opacity="0.9">Direct Dependencies</text>
                    <text x="240" y="142" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Payment, API Gateway</text>

                    {/* Center — The Change */}
                    <circle cx="240" cy="190" r="40" fill="url(#ring0)" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />
                    <text x="240" y="186" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="700" fontFamily="monospace">CHANGE</text>
                    <text x="240" y="200" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">Retry Logic</text>

                    {/* Labels for impact level */}
                    <text x="240" y="340" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                      Blast depth: {data.blastRadius.depth}
                    </text>
                    <text x="240" y="355" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">
                      Inner ring: CRITICAL · Middle: ELEVATED · Outer: MODERATE
                    </text>
                  </svg>

                  {/* Side panel with zone breakdown */}
                  <div className="w-full lg:w-64 space-y-2">
                    {data.blastRadius.zones.map((z, i) => (
                      <motion.div key={z.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className={`flex items-center justify-between rounded-lg border p-2.5 text-[10px] transition-all hover:border-cyan-500/20
                          ${z.critical ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${z.radius === 1 ? 'bg-red-500' : z.radius === 2 ? 'bg-orange-500' : 'bg-cyan-500'}`} />
                          <span className="text-slate-300 font-mono">{z.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono ${z.risk >= 80 ? 'text-red-400' : z.risk >= 50 ? 'text-orange-400' : 'text-cyan-400'}`}>
                            R:{z.risk}
                          </span>
                          <span className="text-[8px] text-slate-600">r={z.radius}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ===== 8. Evidence Timeline ===== */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Evidence Timeline</h3>
                  <span className="text-[10px] text-slate-600 font-mono">6 forensic artifacts</span>
                </div>
                <div className="relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/30 via-blue-500/20 to-transparent" />
                  <div className="space-y-0">
                    {data.evidenceTimeline.map((ev, i) => {
                      const typeColors = {
                        'Code Change': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                        'Incident': 'bg-red-500/10 text-red-400 border-red-500/20',
                        'Config Change': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                        'Alert': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                      }
                      const dotColors = {
                        'Code Change': 'bg-blue-500 border-blue-500/30',
                        'Incident': 'bg-red-500 border-red-500/30',
                        'Config Change': 'bg-yellow-500 border-yellow-500/30',
                        'Alert': 'bg-orange-500 border-orange-500/30',
                      }
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          className={`relative flex items-start gap-4 py-3 group cursor-pointer transition-all ${selectedEvidence === `ev-${i}` ? 'opacity-100' : 'hover:opacity-90'}`}
                          onClick={() => setSelectedEvidence(selectedEvidence === `ev-${i}` ? null : `ev-${i}`)}>
                          <div className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${dotColors[ev.type] || 'bg-slate-500 border-slate-500/30'} transition-all group-hover:scale-125`}>
                            <div className="absolute inset-0.5 rounded-full bg-current opacity-30 animate-pulse" />
                          </div>
                          <div className="flex-1 min-w-0 bg-white/[0.01] rounded-lg p-3 border border-white/[0.04] group-hover:border-cyan-500/15 transition-all">
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${typeColors[ev.type] || 'bg-slate-500/10 text-slate-400'}`}>{ev.type}</span>
                                <span className="text-[10px] font-mono text-slate-500">{ev.date}</span>
                              </div>
                              <span className="text-[10px] font-mono text-cyan-400">{ev.relevance}% relevance</span>
                            </div>
                            <p className="text-xs text-slate-300">{ev.description}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 013.75.808m.75 5.742a1.125 1.125 0 010 2.25m-2.25 0a1.125 1.125 0 010-2.25m9.75-7.5a1.125 1.125 0 010 2.25m0-2.25a1.125 1.125 0 010 2.25m-5.25 3.75h6.75" />
                              </svg>
                              <span className="text-[9px] font-mono text-slate-600">{ev.source}</span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* ===== 9. Incident Correlation Engine ===== */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                    <svg className="h-3 w-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Incident Correlation Engine</h3>
                  <span className="text-[10px] text-slate-600 font-mono">{data.correlations.length} correlations found</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {data.correlations.map((corr, i) => {
                    const corrColors = ['from-red-500/10 to-orange-500/5', 'from-orange-500/10 to-yellow-500/5', 'from-yellow-500/10 to-green-500/5', 'from-blue-500/10 to-cyan-500/5', 'from-purple-500/10 to-pink-500/5']
                    const borderColors = ['border-red-500/20', 'border-orange-500/20', 'border-yellow-500/20', 'border-blue-500/20', 'border-purple-500/20']
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className={`rounded-lg border ${borderColors[i]} bg-gradient-to-br ${corrColors[i]} p-3 hover:border-cyan-500/30 transition-all relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-semibold text-slate-200">{corr.incident}</h4>
                            <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                              </svg>
                              {corr.score}%
                            </span>
                          </div>
                          {/* Correlation score bar */}
                          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                            <div className={`h-full rounded-full ${corr.score >= 85 ? 'bg-red-500' : corr.score >= 75 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                              style={{ width: `${corr.score}%`, transition: 'width 1s ease-out' }} />
                          </div>
                          <div className="space-y-1 text-[9px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-600 w-16 shrink-0">Root Cause:</span>
                              <span className="text-slate-400 font-mono">{corr.commonCause}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-600 w-16 shrink-0">Services:</span>
                              <span className="text-slate-400">{corr.services.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-600 w-16 shrink-0">Timeline Gap:</span>
                              <span className="text-slate-400 font-mono">{corr.gap}</span>
                            </div>
                          </div>
                          {/* Visual linking indicator */}
                          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${corr.score >= 85 ? 'bg-red-500' : corr.score >= 75 ? 'bg-orange-500' : 'bg-yellow-500'} opacity-40`} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                {/* Correlation matrix note */}
                <div className="mt-3 rounded-lg bg-cyan-500/[0.03] border border-cyan-500/10 p-2.5">
                  <div className="flex items-center gap-2 text-[9px] text-cyan-400 font-mono">
                    <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    5 correlated incidents share {data.rootCauses.length} common root causes
                  </div>
                </div>
              </motion.div>

              {/* ===== 10. Risk Heatmap ===== */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <svg className="h-3 w-3 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Risk Heatmap</h3>
                  <span className="text-[10px] text-slate-600 font-mono">Phase vs. Severity</span>
                </div>
                <div className="overflow-x-auto">
                  <svg viewBox="0 0 600 380" className="w-full max-w-2xl mx-auto" style={{ minWidth: 500 }}>
                    <defs>
                      <linearGradient id="heatRed" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(239,68,68,0.4)" />
                        <stop offset="100%" stopColor="rgba(239,68,68,0.15)" />
                      </linearGradient>
                      <linearGradient id="heatAmber" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(245,158,11,0.35)" />
                        <stop offset="100%" stopColor="rgba(245,158,11,0.1)" />
                      </linearGradient>
                      <linearGradient id="heatYellow" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(234,179,8,0.25)" />
                        <stop offset="100%" stopColor="rgba(234,179,8,0.08)" />
                      </linearGradient>
                      <linearGradient id="heatGreen" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(34,197,94,0.2)" />
                        <stop offset="100%" stopColor="rgba(34,197,94,0.05)" />
                      </linearGradient>
                    </defs>

                    {/* Background */}
                    <rect width="600" height="380" fill="transparent" />

                    {/* Column headers */}
                    <text x="140" y="40" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Critical</text>
                    <text x="245" y="40" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">High</text>
                    <text x="350" y="40" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Medium</text>
                    <text x="455" y="40" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Low</text>

                    {/* Row header labels */}
                    {['Design', 'Implementation', 'Testing', 'Deployment', 'Post-Release'].map((phase, i) => (
                      <text key={phase} x="75" y={85 + i * 60} textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">{phase}</text>
                    ))}

                    {/* Heatmap cells */}
                    {data.heatmap.map((row, ri) => {
                      const cells = [
                        { label: row.critical, grad: 'heatRed', val: row.critical },
                        { label: row.high, grad: 'heatAmber', val: row.high },
                        { label: row.medium, grad: 'heatYellow', val: row.medium },
                        { label: row.low, grad: 'heatGreen', val: row.low },
                      ]
                      return cells.map((cell, ci) => {
                        const x = 110 + ci * 105
                        const y = 55 + ri * 60
                        return (
                          <motion.g key={`${ri}-${ci}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: (ri * 4 + ci) * 0.04 }}>
                            <rect x={x} y={y} width="90" height="40" rx="6"
                              fill={`url(#${cell.grad})`}
                              stroke={cell.val >= 70 ? 'rgba(239,68,68,0.3)' : cell.val >= 40 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)'}
                              strokeWidth="1" className="transition-all hover:stroke-cyan-500/40 hover:stroke-2 cursor-pointer" />
                            <text x={x + 45} y={y + 24} textAnchor="middle"
                              fill={cell.val >= 70 ? '#fca5a5' : cell.val >= 40 ? '#fbbf24' : '#86efac'}
                              fontSize="14" fontWeight="700" fontFamily="monospace">{cell.val}</text>
                          </motion.g>
                        )
                      })
                    })}

                    {/* Legend */}
                    <rect x="50" y="330" width="14" height="10" rx="2" fill="url(#heatRed)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
                    <text x="70" y="339" fill="#64748b" fontSize="8" fontFamily="monospace">Critical (70+)</text>
                    <rect x="170" y="330" width="14" height="10" rx="2" fill="url(#heatAmber)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                    <text x="190" y="339" fill="#64748b" fontSize="8" fontFamily="monospace">High (40-69)</text>
                    <rect x="280" y="330" width="14" height="10" rx="2" fill="url(#heatYellow)" stroke="rgba(234,179,8,0.15)" strokeWidth="1" />
                    <text x="300" y="339" fill="#64748b" fontSize="8" fontFamily="monospace">Medium (20-39)</text>
                    <rect x="400" y="330" width="14" height="10" rx="2" fill="url(#heatGreen)" stroke="rgba(34,197,94,0.1)" strokeWidth="1" />
                    <text x="420" y="339" fill="#64748b" fontSize="8" fontFamily="monospace">Low (0-19)</text>

                    <text x="300" y="368" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk escalates through phases — highest at Deployment</text>
                  </svg>
                </div>
              </motion.div>

              {/* ===== 11. Failure Mode Analysis (accordion) ===== */}
              <motion.div variants={item} className="glass-card overflow-hidden">
                <div className="flex items-center gap-2 p-5 pb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <svg className="h-3 w-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Failure Mode Analysis</h3>
                  <span className="text-[10px] text-slate-600 font-mono ml-1">({data.failureModes.length} modes detected)</span>
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
                                <div className="rounded bg-white/[0.02] p-2"><span className="text-slate-600 block mb-0.5 font-mono text-[9px] uppercase tracking-wider">Impact</span><span className="text-slate-400">{f.impact}</span></div>
                                <div className="rounded bg-white/[0.02] p-2"><span className="text-slate-600 block mb-0.5 font-mono text-[9px] uppercase tracking-wider">Detection</span><span className="text-slate-400">{f.detection}</span></div>
                                <div className="rounded bg-white/[0.02] p-2 sm:col-span-2"><span className="text-slate-600 block mb-0.5 font-mono text-[9px] uppercase tracking-wider">Mitigation</span><span className="text-cyan-400">{f.mitigation}</span></div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* ===== 12. AI Recommendations ===== */}
              <motion.div variants={item} className="glass-card overflow-hidden">
                <div className="flex items-center gap-2 p-5 pb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <svg className="h-3 w-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
                  <span className="text-[10px] text-slate-600 font-mono ml-1">Prioritized by risk impact</span>
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
                        <div className="flex flex-wrap gap-3 mt-0.5 text-[9px] text-slate-600">
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3 text-green-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            {r.impact}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {r.effort}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3 text-purple-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            Owner: {r.owner}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ===== 13. Confidence Meter ===== */}
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Confidence Meter</h3>
                  <span className="text-[10px] text-slate-600 font-mono ml-1">Investigation reliability</span>
                </div>
                <ConfidenceMeter confidence={data.confidence} />
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!data && !loading && (
          <motion.div variants={item} className="text-center py-16">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1 font-mono tracking-wide">INITIALIZE INVESTIGATION</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto font-mono text-[11px]">Enter a feature request or incident description above to run a full forensic analysis — failure modes, historical correlations, dependency chains, blast radius, and AI-powered mitigation intelligence.</p>
          </motion.div>
        )}

      </motion.div>
    </Layout>
  )
}