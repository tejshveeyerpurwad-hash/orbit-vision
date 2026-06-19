import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

const stages = [
  { id: 'build', label: 'Build', status: 'success', time: '32s' },
  { id: 'test', label: 'Test', status: 'success', time: '1m 12s' },
  { id: 'staging', label: 'Staging', status: 'running', time: '45s' },
  { id: 'canary', label: 'Canary', status: 'pending', time: null },
  { id: 'production', label: 'Production', status: 'pending', time: null },
]

const checks = [
  { name: 'Unit Tests', status: 'passed', time: '24s' },
  { name: 'Integration Tests', status: 'passed', time: '48s' },
  { name: 'Security Scan', status: 'passed', time: '1m 30s' },
  { name: 'Load Tests', status: 'running', time: '2m 15s' },
  { name: 'Smoke Tests', status: 'pending', time: null },
]

const failureScenarios = [
  { scenario: 'Retry queue overflow', cause: 'Missing circuit breaker in payment retry logic', cost: '$12,000/hr', recovery: '45 min', mitigation: 'Add circuit breaker with exponential backoff', severity: 'critical' },
  { scenario: 'Billing worker OOM', cause: 'Unbounded retry loop exhausting heap memory', cost: '$5,000/hr', recovery: '3 hr', mitigation: 'Bound retry count and add memory limit alerts', severity: 'high' },
  { scenario: 'Idempotency key collision', cause: 'Missing idempotency keys in webhook delivery', cost: '$2,000/hr', recovery: '2 hr', mitigation: 'Generate unique idempotency keys for all webhooks', severity: 'medium' },
]

export default function DeploymentSimulator() {
  const [simulating, setSimulating] = useState(false)
  const [currentStage, setCurrentStage] = useState(2)
  const [selectedScenario, setSelectedScenario] = useState(null)

  const simulate = () => {
    setSimulating(true)
    setCurrentStage(0)
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval)
          setSimulating(false)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  const reset = () => {
    setSimulating(false)
    setCurrentStage(2)
  }

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Deployment Simulator</h1>
            <p className="mt-1 text-sm text-slate-500">Simulate and analyze deployment pipelines before going live</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={simulate}
              disabled={simulating}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50 transition-all"
            >
              {simulating ? 'Simulating...' : 'Run Simulation'}
            </button>
            <button
              onClick={reset}
              className="rounded-lg border border-white/[0.06] px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-white/[0.04] transition-all"
            >
              Reset
            </button>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Failure Probability" value="34%" color="text-yellow-400" />
          <StatCard label="Estimated Cost" value="$19,000/hr" color="text-red-400" />
          <StatCard label="Recovery Time" value="45 min avg" color="text-orange-400" />
          <StatCard label="Mitigation Score" value="72%" color="text-green-400" trend="↑ 15% with actions" />
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Pipeline Stages</h3>
          <div className="flex items-start gap-2 overflow-x-auto pb-2">
            {stages.map((s, i) => (
              <div key={s.id} className="flex-1 min-w-[100px]">
                <div className={`rounded-lg border p-3 text-center transition-all ${
                  i === currentStage && s.status === 'running'
                    ? 'border-brand/40 bg-brand/[0.06]'
                    : s.status === 'success' || i < currentStage
                    ? 'border-green-500/20 bg-green-500/[0.04]'
                    : 'border-white/[0.06] bg-white/[0.02]'
                }`}>
                  <div className={`text-xs font-semibold mb-1 ${
                    s.status === 'success' || i < currentStage ? 'text-green-400' :
                    i === currentStage ? 'text-brand-light' : 'text-slate-600'
                  }`}>{s.label}</div>
                  <div className={`text-[10px] ${s.time ? 'text-slate-500' : 'text-slate-700'}`}>
                    {s.time || '---'}
                  </div>
                </div>
                {i < stages.length - 1 && (
                  <div className={`h-1 mx-auto w-0.5 my-1 ${i < currentStage ? 'bg-green-500/40' : 'bg-slate-800'}`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Pre-Deployment Checks</h3>
            <div className="space-y-2">
              {checks.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      c.status === 'passed' ? 'bg-green-500' :
                      c.status === 'running' ? 'bg-brand animate-pulse-soft' : 'bg-slate-700'
                    }`} />
                    <span className="text-xs text-slate-400">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={c.status} label={c.status} dot={false} />
                    {c.time && <span className="text-[10px] text-slate-600">{c.time}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Deployment Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Duration', value: '4m 29s' },
                { label: 'Services Deployed', value: '3' },
                { label: 'Risk Assessment', value: 'Medium', badge: 'warning' },
                { label: 'Rollback Plan', value: 'Automated — v1.2.3' },
                { label: 'Blast Radius', value: '2 downstream services' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{s.label}</span>
                  {s.badge ? (
                    <StatusBadge status={s.badge} label={s.value} />
                  ) : (
                    <span className="text-xs font-medium text-slate-300">{s.value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Failure Scenarios */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Failure Scenarios</h3>
            <StatusBadge status="error" label="3 risks identified" />
          </div>
          <div className="space-y-3">
            {failureScenarios.map((fs, i) => (
              <div key={i}>
                <button
                  onClick={() => setSelectedScenario(selectedScenario === i ? null : i)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-white/[0.12] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={fs.severity} label={fs.severity} />
                        <span className="text-xs font-semibold text-slate-200">{fs.scenario}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Cause: {fs.cause}</p>
                    </div>
                    <svg className={`h-3 w-3 text-slate-600 mt-1 transition-transform ${selectedScenario === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>
                {selectedScenario === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-lg border-x border-b border-white/[0.06] bg-brand/[0.03] p-3 grid gap-3 sm:grid-cols-3">
                      <div>
                        <span className="text-[10px] text-slate-600">Estimated Cost</span>
                        <div className="text-xs font-semibold text-red-400">{fs.cost}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-600">Recovery Time</span>
                        <div className="text-xs font-semibold text-yellow-400">{fs.recovery}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-600">Mitigation</span>
                        <div className="text-xs font-semibold text-green-400">{fs.mitigation}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}
