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

const mockResults = {
  incidentProbability: 82,
  confidenceScore: 91,
  severity: 'high',
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
    { priority: 'P0', action: 'Add circuit breaker to payment retry logic', owner: 'Payments Team', detail: 'Prevents cascading failures in payment pipeline. Estimated effort: 3 story points.' },
    { priority: 'P1', action: 'Increase billing worker memory limit', owner: 'Billing Team', detail: 'Prevents OOM during peak load. Estimated effort: 1 story point.' },
    { priority: 'P2', action: 'Add idempotency keys to webhook delivery', owner: 'Platform Team', detail: 'Eliminates duplicate event processing. Estimated effort: 5 story points.' },
    { priority: 'P2', action: 'Add regression tests for timeout configurations', owner: 'QA Team', detail: 'Catches accidental timeout removal during refactors. Estimated effort: 2 story points.' },
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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function IncidentTimeMachine() {
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const inputRef = useRef(null)
  const [selectedPreset, setSelectedPreset] = useState(-1)

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
        {/* Header */}
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

        {/* Input */}
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

        {/* Loading */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse">
                  <div className="h-3 w-20 skeleton rounded mb-3" />
                  <div className="h-8 w-16 skeleton rounded mb-2" />
                  <div className="h-2 skeleton rounded" />
                </div>
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse">
                  <div className="h-3 w-32 skeleton rounded mb-4" />
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-12 skeleton rounded mb-2" />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results && !analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={container}
              className="space-y-8"
            >
              {/* Gauges + Scores Row */}
              <motion.div variants={item} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              </motion.div>

              {/* Similar MRs + Incidents */}
              <div className="grid gap-6 lg:grid-cols-2">
                <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Similar Historical Merge Requests</h3>
                    <StatusBadge status="warning" label={`${results.mrs.length} matches`} />
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                    {results.mrs.map((mr, i) => (
                      <motion.div
                        key={mr.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all"
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
                          <span className="text-[10px] text-slate-500">{mr.match}% match</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Similar Production Incidents</h3>
                    <StatusBadge status="error" label={`${results.incidents.length} incidents`} />
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                    {results.incidents.map((inc, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
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
                </motion.div>
              </div>

              {/* Root Cause Analysis */}
              <motion.div variants={item} className="rounded-xl border border-brand/10 bg-slate-900/50 p-5">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Root Cause Analysis</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { title: 'Primary Cause', detail: 'Missing circuit breaker in payment retry logic causes cascading failures when downstream services are unavailable.', severity: 'critical' },
                    { title: 'Contributing Factor', detail: 'Unbounded retry queues exhaust worker memory, leading to OOM kills and degraded billing processing.', severity: 'high' },
                    { title: 'Systemic Issue', detail: 'No idempotency guarantees across webhook deliveries results in duplicate event processing and data inconsistency.', severity: 'medium' },
                  ].map((rca, i) => (
                    <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={rca.severity} label={rca.severity} />
                        <span className="text-xs font-medium text-slate-300">{rca.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{rca.detail}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Lessons Learned */}
              <motion.div variants={item} className="rounded-xl border border-green-500/10 bg-slate-900/50 p-5">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Lessons Learned</h3>
                <div className="grid gap-4 sm:grid-cols-2">
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
              </motion.div>

              {/* Recommended Actions */}
              <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Recommended Actions</h3>
                  <StatusBadge status="info" label={`${results.recommendations.length} actions`} />
                </div>
                <div className="space-y-2">
                  {results.recommendations.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-white/[0.12] transition-all"
                    >
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold mt-0.5 ${
                        r.priority === 'P0' ? 'bg-red-500/10 text-red-400' :
                        r.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>{r.priority}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-200">{r.action}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-600 flex-wrap">
                          <span>Owner: {r.owner}</span>
                          <span>{r.detail}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
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
