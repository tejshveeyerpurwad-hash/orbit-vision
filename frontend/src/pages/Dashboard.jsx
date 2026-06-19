import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const presets = [
  'Add payment retry support',
  'Implement OAuth 2.0 SSO',
  'Add full-text search',
  'Refactor billing module',
  'Deploy microservices monitoring',
]

const resultsData = {
  kpis: { riskScore: 72, confidenceScore: 91, incidentProbability: 82, releaseReadiness: 74 },
  deployment: { readiness: 68, risk: 'moderate', recommendation: 'Proceed with Caution' },
  incidentPrediction: { probability: 82, confidence: 91, severity: 'High', nextWindow: 'Next 24 hours' },
  blastRadius: { services: 4, teams: 3, pipelines: 2, score: 65 },
  services: [
    { name: 'Payment Service', risk: 87, impact: 'critical', status: 'Analyzed' },
    { name: 'Billing Service', risk: 65, impact: 'high', status: 'Analyzed' },
    { name: 'Notification Service', risk: 45, impact: 'medium', status: 'Analyzed' },
    { name: 'API Gateway', risk: 72, impact: 'high', status: 'Analyzed' },
  ],
  teams: [
    { name: 'Payments', role: 'Primary Owner', load: 85, members: 8 },
    { name: 'Billing', role: 'Supporting', load: 60, members: 5 },
    { name: 'Platform', role: 'Consulting', load: 30, members: 6 },
  ],
  timeline: [
    { phase: 'Design Review', dur: '3 days', risk: 'Low' },
    { phase: 'Core Implementation', dur: '8 days', risk: 'High' },
    { phase: 'Integration Testing', dur: '5 days', risk: 'Medium' },
    { phase: 'Staging Deploy', dur: '2 days', risk: 'Low' },
    { phase: 'Production Release', dur: '1 day', risk: 'Critical' },
  ],
  risks: [
    { risk: 'Circuit breaker misconfiguration', severity: 'critical', mitigation: 'Add integration tests with fault injection', probability: 'Medium' },
    { risk: 'Retry queue overflow under peak load', severity: 'high', mitigation: 'Implement bounded retry queues', probability: 'High' },
    { risk: 'Billing reconciliation delay during rollout', severity: 'medium', mitigation: 'Feature flag with gradual rollout', probability: 'Low' },
  ],
  actions: [
    { priority: 'P0', action: 'Add circuit breaker to payment retry', owner: 'Payments', deadline: 'This sprint' },
    { priority: 'P1', action: 'Increase billing worker memory limit', owner: 'Billing', deadline: 'Next sprint' },
    { priority: 'P1', action: 'Add monitoring alerts for retry failures', owner: 'Platform', deadline: 'This sprint' },
  ],
  systemHealth: {
    overall: 92,
    services: [
      { name: 'Payment Service', status: 'healthy', uptime: 99.97, trend: 'stable' },
      { name: 'Auth Service', status: 'healthy', uptime: 99.99, trend: 'up' },
      { name: 'Database', status: 'healthy', uptime: 99.95, trend: 'stable' },
      { name: 'Redis Cache', status: 'degraded', uptime: 98.41, trend: 'down' },
      { name: 'Message Queue', status: 'healthy', uptime: 99.88, trend: 'up' },
      { name: 'CDN', status: 'healthy', uptime: 100.0, trend: 'stable' },
    ],
  },
  globalRisk: [
    { region: 'North America', risk: 'low', activeIncidents: 0, color: '#22c55e', x: 120, y: 80 },
    { region: 'Europe', risk: 'medium', activeIncidents: 2, color: '#eab308', x: 320, y: 70 },
    { region: 'Asia Pacific', risk: 'high', activeIncidents: 5, color: '#f97316', x: 560, y: 100 },
    { region: 'Latin America', risk: 'low', activeIncidents: 1, color: '#22c55e', x: 200, y: 220 },
    { region: 'Middle East', risk: 'critical', activeIncidents: 8, color: '#ef4444', x: 410, y: 160 },
    { region: 'Africa', risk: 'medium', activeIncidents: 3, color: '#eab308', x: 420, y: 240 },
  ],
  alerts: [
    { time: '14:23:15', severity: 'critical', service: 'Payment Service', message: 'Error rate spike >5% on payment endpoint', status: 'acknowledged' },
    { time: '14:21:02', severity: 'medium', service: 'Redis Cache', message: 'Memory usage exceeding 85% threshold', status: 'triggered' },
    { time: '14:18:44', severity: 'critical', service: 'Billing Service', message: 'Invoice generation latency >30s', status: 'triggered' },
    { time: '14:15:30', severity: 'medium', service: 'API Gateway', message: 'P99 latency increased by 200ms', status: 'acknowledged' },
    { time: '14:12:08', severity: 'high', service: 'Notification Service', message: 'Email delivery queue backlog 12k messages', status: 'triggered' },
    { time: '14:08:55', severity: 'medium', service: 'Database', message: 'Connection pool utilization 78%', status: 'resolved' },
    { time: '14:05:20', severity: 'critical', service: 'Payment Service', message: 'Webhook delivery failure rate 15%', status: 'triggered' },
    { time: '14:01:10', severity: 'low', service: 'CDN', message: 'Edge cache hit rate dropped to 82%', status: 'resolved' },
  ],
  deployments: [
    { service: 'payment-api', version: 'v2.1.0', env: 'production', status: 'successful', time: '14:15', author: '@alice' },
    { service: 'auth-service', version: 'v1.8.3', env: 'staging', status: 'running', time: '14:22', author: '@bob' },
    { service: 'billing-worker', version: 'v3.0.1', env: 'production', status: 'failed', time: '13:58', author: '@carol' },
    { service: 'notification-svc', version: 'v1.4.0', env: 'staging', status: 'successful', time: '13:45', author: '@alice' },
    { service: 'redis-cluster', version: 'v6.2.8', env: 'production', status: 'running', time: '14:05', author: '@bob' },
    { service: 'api-gateway', version: 'v4.2.1', env: 'production', status: 'successful', time: '13:30', author: '@dave' },
  ],
  gauges: [
    { label: 'API Latency', value: 42, threshold: 200, unit: 'ms', current: 42, max: 200 },
    { label: 'Error Rate', value: 0.3, threshold: 1, unit: '%', current: 0.3, max: 1 },
    { label: 'CPU Utilization', value: 67, threshold: 90, unit: '%', current: 67, max: 100 },
    { label: 'Memory Usage', value: 81, threshold: 90, unit: '%', current: 81, max: 100 },
  ],
  incidentTimeline: [
    { incident: 'Payment pipeline outage', detection: '2min', response: '5min', resolution: '45min', status: 'resolved', detectPct: 5, respPct: 15, resolPct: 100 },
    { incident: 'Auth token rotation failure', detection: '1min', response: '3min', resolution: '12min', status: 'resolved', detectPct: 8, respPct: 25, resolPct: 100 },
    { incident: 'Database replica lag', detection: '4min', response: '8min', resolution: '30min', status: 'resolved', detectPct: 13, respPct: 27, resolPct: 100 },
    { incident: 'CDN edge node failure', detection: '3min', response: '6min', resolution: '22min', status: 'resolved', detectPct: 14, respPct: 27, resolPct: 100 },
    { incident: 'Redis cluster split-brain', detection: '5min', response: '12min', resolution: '60min', status: 'resolved', detectPct: 8, respPct: 20, resolPct: 100 },
  ],
  dependencies: [
    { name: 'Payment Service', status: 'healthy', dependencies: ['Auth', 'DB', 'Queue'], riskScore: 87, lastIncident: '2h ago' },
    { name: 'API Gateway', status: 'degraded', dependencies: ['Auth', 'Cache', 'Rate Limit'], riskScore: 72, lastIncident: '45min ago' },
    { name: 'Billing Worker', status: 'healthy', dependencies: ['DB', 'Queue', 'Email'], riskScore: 65, lastIncident: '6h ago' },
    { name: 'Notification Svc', status: 'healthy', dependencies: ['Queue', 'Email', 'CDN'], riskScore: 45, lastIncident: '1d ago' },
  ],
}

function AnimatedKPI({ value, label, color, delay = 0, format = '%', trend = 'stable', ringColor = '#22c55e' }) {
  const [count, setCount] = useState(0)
  const circumference = 2 * Math.PI * 22
  const offset = circumference - (count / 100) * circumference
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0; const inc = value / 40; const i = setInterval(() => { start += inc; if (start >= value) { setCount(value); clearInterval(i) } else setCount(Math.floor(start)) }, 25)
      return () => clearInterval(i)
    }, delay)
    return () => clearTimeout(t)
  }, [value, delay])
  const trendIcon = trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : '\u2192'
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay / 1000 }} className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 group hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="#1e293b" strokeWidth="4" />
            <circle cx="26" cy="26" r="22" fill="none" stroke={ringColor} strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-mono text-slate-500">{count}{format}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${color}`}>{count}{format === '%' ? '' : format}</span>
            <span className={`text-xs font-mono ${trendColor}`}>{trendIcon}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 tracking-wide uppercase">{label}</div>
          <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(count, 100)}%` }} transition={{ duration: 0.8, delay: delay / 1000 + 0.3 }} className={`h-full rounded-full ${color.replace('text-', 'bg-').replace('400', '500')}`} />
          </div>
        </div>
      </div>
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />
    </motion.div>
  )
}

function AnimatedGauge({ label, value, threshold, unit, max, delay = 0 }) {
  const [pct, setPct] = useState(0)
  const normVal = typeof max === 'number' ? (value / max) * 100 : value
  const ratio = normVal / 100
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (pct / 100) * circumference * ratio
  useEffect(() => { const t = setTimeout(() => setPct(100), delay); return () => clearTimeout(t) }, [delay])
  const color = normVal < 60 ? '#34d399' : normVal < 85 ? '#fbbf24' : '#f87171'
  const textColor = normVal < 60 ? 'text-emerald-400' : normVal < 85 ? 'text-amber-400' : 'text-red-400'
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: delay / 1000 }} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 flex flex-col items-center group hover:border-cyan-500/30 transition-all duration-300">
      <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="#1e293b" strokeWidth="5" />
        <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
        <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference * ratio} strokeDashoffset={circumference} className="transition-all duration-1000 ease-out" opacity="0.2" />
      </svg>
      <div className="relative -mt-[52px] sm:-mt-[60px] flex flex-col items-center">
        <span className={`text-xl sm:text-2xl font-bold font-mono ${textColor}`}>{value}<span className="text-xs text-slate-500">/{threshold}{unit}</span></span>
      </div>
      <span className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-wide">{label}</span>
    </motion.div>
  )
}

function ServiceBar({ name, risk, impact, index }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(risk), 300 + index * 100); return () => clearTimeout(t) }, [risk, index])
  const color = risk >= 80 ? 'from-red-500 to-red-600' : risk >= 60 ? 'from-orange-500 to-amber-500' : 'from-yellow-500 to-amber-400'
  const dotColor = risk >= 80 ? 'bg-red-500' : risk >= 60 ? 'bg-orange-500' : 'bg-yellow-500'
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="flex items-center gap-3 py-2">
      <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor} ${risk >= 80 ? 'animate-pulse' : ''}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium text-slate-300">{name}</span>
          <span className="text-[10px] font-semibold font-mono text-slate-400">{risk}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full bg-gradient-to-r ${color}`} />
        </div>
      </div>
    </motion.div>
  )
}

function TeamCard({ team, index }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(team.load), 400 + index * 100); return () => clearTimeout(t) }, [team.load, index])
  const color = team.load >= 80 ? 'bg-red-500' : team.load >= 60 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 rounded-lg items-center justify-center text-[9px] font-bold ${index === 0 ? 'bg-red-500/20 text-red-300' : index === 1 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>{team.name[0]}</div>
          <div><div className="text-xs font-medium text-white">{team.name}</div><div className="text-[9px] text-slate-600">{team.role} · {team.members} eng</div></div>
        </div>
        <span className={`text-[10px] font-medium ${team.load >= 80 ? 'text-red-400' : team.load >= 60 ? 'text-yellow-400' : 'text-green-400'}`}>{team.load}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${color}`} />
      </div>
    </motion.div>
  )
}

function RiskCard({ item, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-red-500/20 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <StatusBadge status={item.severity} label={item.severity} />
          <span className="text-xs text-slate-300">{item.risk}</span>
        </div>
        <StatusBadge status={item.probability === 'High' ? 'critical' : item.probability === 'Medium' ? 'warning' : 'info'} label={item.probability} />
      </div>
      <p className="text-[10px] text-slate-600 mt-1">{item.mitigation}</p>
    </motion.div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

function Timestamp() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i) }, [])
  return <span className="font-mono text-[10px] text-cyan-400/70">{time.toISOString().replace('T', ' ').slice(0, 19)}Z</span>
}

function Sparkline({ data = [40, 60, 55, 70, 65, 80, 75, 90, 85, 92], color = '#22c55e' }) {
  const w = 60; const h = 20
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg className="w-[60px] h-[20px]" viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

function WorldMap({ regions }) {
  const [pulseIdx, setPulseIdx] = useState(0)
  useEffect(() => { const i = setInterval(() => setPulseIdx(p => (p + 1) % 6), 1500); return () => clearInterval(i) }, [])
  const riskColors = { low: '#22c55e', medium: '#eab308', high: '#f97316', critical: '#ef4444' }
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto">
      <defs>
        <radialGradient id="grid-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1e293b" stopOpacity="0.3" /><stop offset="100%" stopColor="transparent" /></radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="400" fill="transparent" />
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.3" />
      </pattern>
      <rect x="0" y="0" width="800" height="400" fill="url(#grid)" />
      <text x="400" y="20" textAnchor="middle" fill="#334155" fontSize="9" fontFamily="monospace" letterSpacing="4">GLOBAL INCIDENT MAP</text>

      {/* NA */}
      <rect x="60" y="60" width="160" height="100" rx="8" fill="#0f172a" stroke={regions[0].color} strokeWidth="1" strokeOpacity="0.5" />
      <text x="140" y="90" textAnchor="middle" fill={regions[0].color} fontSize="10" fontFamily="monospace" fontWeight="bold">{regions[0].region}</text>
      <text x="140" y="105" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{regions[0].risk.toUpperCase()} RISK</text>
      <text x="140" y="118" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">{regions[0].activeIncidents} incidents</text>
      <circle cx="140" cy="135" r="4" fill={regions[0].color} className={regions[0].activeIncidents > 0 ? 'animate-ping' : ''} opacity="0.8" />

      {/* EU */}
      <rect x="280" y="40" width="130" height="90" rx="8" fill="#0f172a" stroke={regions[1].color} strokeWidth="1" strokeOpacity="0.5" />
      <text x="345" y="65" textAnchor="middle" fill={regions[1].color} fontSize="10" fontFamily="monospace" fontWeight="bold">{regions[1].region}</text>
      <text x="345" y="80" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{regions[1].risk.toUpperCase()} RISK</text>
      <text x="345" y="93" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">{regions[1].activeIncidents} incidents</text>
      {Array.from({ length: regions[1].activeIncidents }).map((_, i) => (
        <circle key={i} cx={310 + i * 15} cy="110" r="3" fill={regions[1].color} className={pulseIdx === 1 ? 'animate-ping' : ''} opacity="0.8" />
      ))}

      {/* APAC */}
      <rect x="520" y="70" width="160" height="110" rx="8" fill="#0f172a" stroke={regions[2].color} strokeWidth="1" strokeOpacity="0.5" />
      <text x="600" y="100" textAnchor="middle" fill={regions[2].color} fontSize="10" fontFamily="monospace" fontWeight="bold">{regions[2].region}</text>
      <text x="600" y="115" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{regions[2].risk.toUpperCase()} RISK</text>
      <text x="600" y="128" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">{regions[2].activeIncidents} incidents</text>
      {Array.from({ length: Math.min(regions[2].activeIncidents, 4) }).map((_, i) => (
        <circle key={i} cx={555 + i * 20} cy="150" r="3" fill={regions[2].color} className={pulseIdx === 2 ? 'animate-ping' : ''} opacity="0.8" />
      ))}

      {/* LATAM */}
      <rect x="140" y="200" width="130" height="80" rx="8" fill="#0f172a" stroke={regions[3].color} strokeWidth="1" strokeOpacity="0.5" />
      <text x="205" y="225" textAnchor="middle" fill={regions[3].color} fontSize="10" fontFamily="monospace" fontWeight="bold">{regions[3].region}</text>
      <text x="205" y="240" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{regions[3].risk.toUpperCase()} RISK</text>
      <text x="205" y="253" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">{regions[3].activeIncidents} incidents</text>
      <circle cx="205" cy="265" r="3" fill={regions[3].color} opacity="0.8" />

      {/* ME */}
      <rect x="360" y="140" width="120" height="80" rx="8" fill="#0f172a" stroke={regions[4].color} strokeWidth="1.5" strokeOpacity="0.8" />
      <text x="420" y="165" textAnchor="middle" fill={regions[4].color} fontSize="10" fontFamily="monospace" fontWeight="bold">{regions[4].region}</text>
      <text x="420" y="180" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{regions[4].risk.toUpperCase()} RISK</text>
      <text x="420" y="193" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">{regions[4].activeIncidents} incidents</text>
      <circle cx="420" cy="205" r="5" fill={regions[4].color} className="animate-ping" opacity="0.9" />
      <circle cx="420" cy="205" r="3" fill={regions[4].color} opacity="1" />

      {/* AFR */}
      <rect x="370" y="230" width="110" height="80" rx="8" fill="#0f172a" stroke={regions[5].color} strokeWidth="1" strokeOpacity="0.5" />
      <text x="425" y="255" textAnchor="middle" fill={regions[5].color} fontSize="10" fontFamily="monospace" fontWeight="bold">{regions[5].region}</text>
      <text x="425" y="270" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{regions[5].risk.toUpperCase()} RISK</text>
      <text x="425" y="283" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">{regions[5].activeIncidents} incidents</text>
      <circle cx="425" cy="295" r="3" fill={regions[5].color} className={pulseIdx === 5 ? 'animate-ping' : ''} opacity="0.8" />

      {/* Connecting lines */}
      <line x1="220" y1="110" x2="280" y2="85" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
      <line x1="410" y1="85" x2="520" y2="125" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
      <line x1="140" y1="160" x2="140" y2="200" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
      <line x1="410" y1="220" x2="410" y2="230" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
      <line x1="480" y1="200" x2="425" y2="230" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />

      {/* Legend */}
      <rect x="30" y="340" width="740" height="40" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="50" y="363" fill="#64748b" fontSize="8" fontFamily="monospace">RISK LEGEND:</text>
      {[{ l: 'CRITICAL', c: '#ef4444' }, { l: 'HIGH', c: '#f97316' }, { l: 'MEDIUM', c: '#eab308' }, { l: 'LOW', c: '#22c55e' }].map((l, i) => (
        <g key={l.l}>
          <circle cx={160 + i * 120} cy="360" r="4" fill={l.c} />
          <text x={168 + i * 120} y="363" fill={l.c} fontSize="8" fontFamily="monospace">{l.l}</text>
        </g>
      ))}
      <text x="680" y="363" fill="#475569" fontSize="8" fontFamily="monospace">UPDATED: REALTIME</text>
    </svg>
  )
}

function LoadingSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 animate-pulse"><div className="h-2 w-16 bg-slate-800 rounded mb-3" /><div className="h-5 w-12 bg-slate-800 rounded mb-2" /><div className="h-2 w-full bg-slate-800 rounded mb-2" /><div className="h-4 w-full bg-slate-800 rounded" /></div>))}
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-64 bg-slate-800 rounded" /></div>
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-3 w-20 bg-slate-800 rounded mb-3" /><div className="h-8 w-16 bg-slate-800 rounded mb-2" /><div className="h-2 bg-slate-800 rounded" /></div>))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (<div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-3 w-32 bg-slate-800 rounded mb-4" />{Array.from({ length: 4 }).map((_, j) => (<div key={j} className="h-6 bg-slate-800 rounded mb-2" />))}</div>))}
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [acknowledged, setAcknowledged] = useState(new Set())
  const inputRef = useRef(null)
  const alertsRef = useRef(null)
  const [alertScroll, setAlertScroll] = useState(0)

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const analyze = (text) => {
    if (!text.trim()) return
    setLoading(true)
    setData(null)
    setActiveTab('overview')
    setTimeout(() => {
      setData(resultsData)
      setLoading(false)
    }, 2000)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); analyze(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  useEffect(() => {
    if (!data || !alertsRef.current) return
    const i = setInterval(() => {
      setAlertScroll(prev => {
        const max = alertsRef.current.scrollHeight - alertsRef.current.clientHeight
        const next = prev + 1
        if (next >= max) { alertsRef.current.scrollTop = 0; return 0 }
        alertsRef.current.scrollTop = next
        return next
      })
    }, 200)
    return () => clearInterval(i)
  }, [data])

  const handleAcknowledge = (idx) => {
    setAcknowledged(prev => new Set(prev).add(idx))
  }

  const depStatusColor = { healthy: '#22c55e', degraded: '#eab308', down: '#ef4444' }
  const gaColors = ['#06b6d4', '#34d399', '#fbbf24', '#f87171']

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* 1. COMMAND HEADER */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.08] bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/80 backdrop-blur-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-[0.2em] font-mono text-white uppercase">COMMAND CENTER</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
                  <span className="text-[10px] font-mono text-emerald-400/80 tracking-wider uppercase">System Active</span>
                  <span className="text-slate-700">|</span>
                  <span className="flex items-center gap-1 text-[9px] font-mono text-slate-600">
                    <svg className="h-3 w-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    UPTIME: 99.97%
                  </span>
                  <span className="text-slate-700">|</span>
                  <Timestamp />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                <span className="text-[9px] font-mono text-emerald-400/80">THREAT LVL: 3</span>
              </span>
              <StatusBadge status="success" label="All Systems" />
              <StatusBadge status="info" label="v3.4.1" />
              <div className="h-6 w-px bg-white/[0.06]" />
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/60">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75H17.25m-5.25 0h-1.5m-1.5 0h-1.5M21 12h-1.5M3 18h12m0 0l-3-3m3 3l-3 3" /></svg>
                SYS-OP: MONITOR
              </div>
            </div>
          </div>
        </motion.div>

        {/* Input */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-2xl p-4 sm:p-5">
          <form onSubmit={e => { e.preventDefault(); analyze(input) }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                onFocus={() => setShowPresets(true)}
                onKeyDown={handleKey}
                placeholder='Enter a feature request to analyze, e.g. "Add payment retry support"'
                className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-44 text-sm text-white placeholder-slate-600 outline-none focus:border-brand/40 focus:bg-slate-800/80 transition-all"
                disabled={loading}
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                <button type="submit" disabled={loading || !input.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand to-violet-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20">
                  {loading ? (
                    <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Analyzing</>
                  ) : (
                    <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>Analyze Feature</>
                  )}
                </button>
              </div>
            </div>
          </form>
          <AnimatePresence>
            {showPresets && filtered.length > 0 && !loading && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden">
                {filtered.map((s, i) => (
                  <button key={s} type="button" className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-brand/10 text-brand-light' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`} onClick={() => { setInput(s); setShowPresets(false); analyze(s) }}>
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {data && !loading && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <StatusBadge status="success" label="Analysis Complete" />
              <span className="text-[10px] text-slate-600">Feature: <span className="text-slate-400 font-medium">{input}</span></span>
              <button onClick={() => { setData(null); setInput(''); setAcknowledged(new Set()) }} className="ml-auto text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Clear</button>
            </div>
          )}
        </motion.div>

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Tab bar */}
              <motion.div variants={item} className="flex gap-1 rounded-xl border border-white/[0.06] bg-slate-900/60 p-1 overflow-x-auto">
                {['overview', 'services', 'risks', 'actions'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`rounded-lg px-3 sm:px-4 py-2 text-xs font-medium transition-all whitespace-nowrap ${activeTab === t ? 'bg-gradient-to-r from-brand/15 to-violet-500/15 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t === 'overview' ? 'Overview' : t === 'services' ? 'Services & Teams' : t === 'risks' ? 'Risk Analysis' : 'Action Plan'}
                  </button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-5">
                    {/* 2. LIVE SYSTEM STATUS WALL */}
                    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Live System Status Wall</h2>
                        <StatusBadge status="success" label="6 of 6 Reporting" />
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {data.systemHealth.services.map((s, i) => {
                          const isOk = s.status === 'healthy'
                          const dotColor = isOk ? 'bg-emerald-500' : 'bg-amber-500'
                          const borderColor = isOk ? 'border-emerald-500/20' : 'border-amber-500/30'
                          const badgeStatus = isOk ? 'success' : 'warning'
                          return (
                            <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-lg border ${borderColor} bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-all group`}>
                              <div className="flex items-center gap-1.5 mb-2">
                                <span className={`relative flex h-2 w-2 ${isOk ? '' : ''}`}>
                                  <span className={`absolute inline-flex h-full w-full rounded-full ${isOk ? 'animate-ping' : 'animate-ping'} opacity-75 ${dotColor}`} />
                                  <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 truncate">{s.name}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <StatusBadge status={badgeStatus} label={s.status} />
                                <span className="text-[10px] font-mono text-slate-500 ml-auto">{s.uptime}%</span>
                              </div>
                              <Sparkline color={isOk ? '#22c55e' : '#f59e0b'} />
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>

                    {/* 3. GLOBAL RISK MAP */}
                    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Global Risk Map</h2>
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" /></span>
                          <span className="text-[9px] font-mono text-amber-400/70">LIVE TRACKING</span>
                        </div>
                      </div>
                      <div className="rounded-lg border border-white/[0.04] bg-slate-950/80 p-1">
                        <WorldMap regions={data.globalRisk} />
                      </div>
                    </motion.div>

                    {/* 4. EXECUTIVE KPI CARDS */}
                    <motion.div variants={item}>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Executive KPIs</h2>
                        <StatusBadge status="info" label="Real-Time" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <AnimatedKPI value={data.systemHealth.overall} label="System Health" color="text-emerald-400" delay={0} trend="stable" ringColor="#22c55e" />
                        <AnimatedKPI value={12} label="Active Incidents" color="text-red-400" delay={100} format="" trend="up" ringColor="#ef4444" />
                        <AnimatedKPI value={24} label="MTTR (min)" color="text-cyan-400" delay={200} format="m" trend="down" ringColor="#06b6d4" />
                        <AnimatedKPI value={47} label="Services Monitored" color="text-amber-400" delay={300} format="" trend="stable" ringColor="#f59e0b" />
                      </div>
                    </motion.div>

                    {/* 7. SYSTEM HEALTH GAUGES */}
                    <motion.div variants={item}>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">System Health Gauges</h2>
                        <StatusBadge status="info" label="Auto-Refresh" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {data.gauges.map((g, i) => (
                          <AnimatedGauge key={g.label} label={g.label} value={g.value} threshold={g.threshold} unit={g.unit} max={g.max} delay={i * 150} />
                        ))}
                      </div>
                    </motion.div>

                    {/* 5 + 6 + 8 + 9 + 10: Two column layout for remaining panels */}
                    <div className="grid gap-5 lg:grid-cols-2">

                      {/* 5. REAL-TIME ALERTS FEED */}
                      <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Real-Time Alerts Feed</h2>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[9px] font-mono text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{data.alerts.filter(a => a.status === 'resolved').size || data.alerts.filter(a => a.status === 'resolved').length} resolved
                            </span>
                            <span className="text-slate-700 text-[8px]">|</span>
                            <div className="flex items-center gap-1.5">
                              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>
                              <span className="text-[9px] font-mono text-slate-500">{data.alerts.filter(a => a.status === 'triggered').length} active</span>
                            </div>
                          </div>
                        </div>
                        <div ref={alertsRef} className="space-y-1 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
                          {data.alerts.map((a, idx) => {
                            const borderColor = a.severity === 'critical' ? 'border-l-red-500' : a.severity === 'high' ? 'border-l-orange-500' : a.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                            const isAck = acknowledged.has(idx) || a.status === 'acknowledged' || a.status === 'resolved'
                            return (
                              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }} className={`rounded-lg border border-white/[0.04] border-l-2 ${borderColor} bg-white/[0.01] p-2.5 hover:bg-white/[0.03] transition-colors`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="text-[9px] font-mono text-slate-600">{a.time}</span>
                                      <StatusBadge status={a.severity} label={a.severity} />
                                      <span className="text-[10px] text-slate-500 truncate">{a.service}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 truncate">{a.message}</p>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {!isAck && (
                                      <button onClick={() => handleAcknowledge(idx)} className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all whitespace-nowrap">
                                        ACKNOWLEDGE
                                      </button>
                                    )}
                                    <StatusBadge status={a.status === 'triggered' ? 'running' : a.status === 'acknowledged' ? 'info' : 'success'} label={a.status} />
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </motion.div>

                      {/* 6. DEPLOYMENT ACTIVITY STREAM */}
                      <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Deployment Activity Stream</h2>
                          <StatusBadge status="info" label="Live" />
                        </div>
                        <div className="space-y-0">
                          {data.deployments.map((d, idx) => {
                            const statusColor = d.status === 'successful' ? 'bg-emerald-500' : d.status === 'running' ? 'bg-cyan-500' : 'bg-red-500'
                            const statusBadge = d.status === 'successful' ? 'success' : d.status === 'running' ? 'running' : 'failed'
                            const envBadge = d.env === 'production' ? 'critical' : 'info'
                            return (
                              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }} className="relative flex items-start gap-3 pb-4 last:pb-0">
                                {/* Timeline connector */}
                                <div className="flex flex-col items-center shrink-0">
                                  <div className={`h-3 w-3 rounded-full ${statusColor} ${d.status === 'running' ? 'animate-ping' : ''} ring-2 ring-slate-800`} />
                                  {idx < data.deployments.length - 1 && <div className="w-px flex-1 bg-slate-800 mt-1" />}
                                </div>
                                <div className="flex-1 min-w-0 -mt-0.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-medium text-slate-200 font-mono">{d.service}</span>
                                      <span className="text-[9px] font-mono text-slate-600">{d.version}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <StatusBadge status={envBadge} label={d.env} />
                                      <StatusBadge status={statusBadge} label={d.status} />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] font-mono text-slate-600">{d.time}</span>
                                    <span className="text-slate-700">·</span>
                                    <span className="text-[9px] font-mono text-slate-600">{d.author}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </motion.div>

                      {/* 8. SERVICE DEPENDENCIES GRID */}
                      <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Service Dependencies</h2>
                          <StatusBadge status="info" label="Topology" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {data.dependencies.map((d, idx) => {
                            const sColor = depStatusColor[d.status] || '#64748b'
                            const riskColor = d.riskScore >= 80 ? 'text-red-400' : d.riskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'
                            const riskBar = d.riskScore >= 80 ? 'bg-red-500' : d.riskScore >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            return (
                              <motion.div key={d.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.08 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`h-2 w-2 rounded-full ${d.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                    <span className="text-xs font-medium text-slate-200">{d.name}</span>
                                  </div>
                                  <StatusBadge status={d.status === 'healthy' ? 'success' : 'warning'} label={d.status} />
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  <span className="text-[9px] text-slate-600">dep:</span>
                                  {d.dependencies.map((dep, di) => (
                                    <span key={dep} className="flex items-center gap-0.5">
                                      <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                                      <span className="text-[9px] font-mono text-slate-500">{dep}</span>
                                      {di < d.dependencies.length - 1 && <span className="text-slate-700 text-[8px]">→</span>}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[10px] font-mono font-semibold ${riskColor}`}>{d.riskScore}</span>
                                    <span className="text-[9px] text-slate-600">risk score</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-slate-600">last:</span>
                                    <span className="text-[9px] font-mono text-slate-500">{d.lastIncident}</span>
                                  </div>
                                </div>
                                <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.riskScore}%` }} transition={{ duration: 0.8, delay: 0.3 + idx * 0.08 }} className={`h-full rounded-full ${riskBar}`} />
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </motion.div>

                      {/* 9. INCIDENT RESPONSE TIMELINE */}
                      <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Incident Response Timeline</h2>
                          <StatusBadge status="success" label="5 Resolved" />
                        </div>
                        <div className="space-y-3">
                          {data.incidentTimeline.map((inc, idx) => (
                            <motion.div key={inc.incident} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-[11px] font-medium text-slate-300 truncate">{inc.incident}</span>
                                </div>
                                <StatusBadge status={inc.status === 'resolved' ? 'success' : 'running'} label={inc.status} />
                              </div>
                              <div className="flex items-center gap-3 text-[9px] font-mono text-slate-600 mb-2">
                                <span>detect: {inc.detection}</span>
                                <span className="text-slate-700">|</span>
                                <span>response: {inc.response}</span>
                                <span className="text-slate-700">|</span>
                                <span>resolve: {inc.resolution}</span>
                              </div>
                              <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${inc.detectPct}%` }} transition={{ duration: 0.6, delay: 0.2 }} className="absolute inset-y-0 left-0 rounded-full bg-cyan-500/60" />
                                <motion.div initial={{ width: 0 }} animate={{ width: `${inc.respPct}%` }} transition={{ duration: 0.6, delay: 0.4 }} className="absolute inset-y-0 left-0 rounded-full bg-amber-500/60" />
                                <motion.div initial={{ width: 0 }} animate={{ width: `${inc.resolPct}%` }} transition={{ duration: 0.6, delay: 0.6 }} className="absolute inset-y-0 left-0 rounded-full bg-emerald-500/60" />
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[8px] text-cyan-500/60 font-mono">DETECT</span>
                                <span className="text-[8px] text-amber-500/60 font-mono">RESPOND</span>
                                <span className="text-[8px] text-emerald-500/60 font-mono">RESOLVE</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                    </div>

                    {/* SLA Compliance Rings */}
                    <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'API SLA', value: 99.95, color: '#22c55e', max: 100 },
                        { label: 'DB SLA', value: 99.99, color: '#06b6d4', max: 100 },
                        { label: 'CACHE SLA', value: 98.5, color: '#f59e0b', max: 100 },
                        { label: 'CDN SLA', value: 99.99, color: '#22c55e', max: 100 },
                      ].map((sla, i) => {
                        const circumference = 2 * Math.PI * 14
                        const offset = circumference - (sla.value / sla.max) * circumference
                        return (
                          <motion.div key={sla.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 flex items-center gap-3">
                            <svg className="w-10 h-10 -rotate-90 shrink-0" viewBox="0 0 34 34">
                              <circle cx="17" cy="17" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
                              <circle cx="17" cy="17" r="14" fill="none" stroke={sla.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
                            </svg>
                            <div>
                              <div className="text-xs font-bold font-mono text-white">{sla.value}%</div>
                              <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{sla.label}</div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>

                    {/* System Metrics Ticker */}
                    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-r from-slate-900 to-slate-900/50 p-3 overflow-hidden">
                      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
                        {[
                          { label: 'INCIDENTS TODAY', value: '23', color: 'text-red-400' },
                          { label: 'MEAN DETECTION TIME', value: '3.2m', color: 'text-cyan-400' },
                          { label: 'MEAN RESPONSE TIME', value: '6.8m', color: 'text-emerald-400' },
                          { label: 'RESOLUTION RATE', value: '97.4%', color: 'text-emerald-400' },
                          { label: 'SLA COMPLIANCE', value: '99.2%', color: 'text-amber-400' },
                          { label: 'TOTAL DEPLOYS TODAY', value: '14', color: 'text-violet-400' },
                          { label: 'ROLLBACKS', value: '1', color: 'text-red-400' },
                          { label: 'ON-CALL ENGINEERS', value: '4', color: 'text-cyan-400' },
                        ].map((m, i) => (
                          <div key={m.label} className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{m.label}</span>
                            <span className={`text-sm font-bold font-mono ${m.color}`}>{m.value}</span>
                            {i < 7 && <span className="text-slate-800 text-[8px]">|</span>}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* 10. QUICK ACTION PANEL */}
                    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Quick Action Panel</h2>
                        <StatusBadge status="info" label="SYS-OP TOOLS" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                          { label: 'Run Risk Scan', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400' },
                          { label: 'Deploy Hotfix', icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400' },
                          { label: 'Rollback Service', icon: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400' },
                          { label: 'Scale Cluster', icon: 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400' },
                          { label: 'Trigger Runbook', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400' },
                        ].map((action, i) => (
                          <motion.button key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-xl border ${action.color} bg-gradient-to-br ${action.color.split(' ')[0].split(':')[0].trim()} p-4 flex flex-col items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group`}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={action.icon} /></svg>
                            <span className="text-[9px] font-semibold uppercase tracking-wider text-center">{action.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                  </motion.div>
                )}

                {activeTab === 'services' && (
                  <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Affected Services</h3>
                      {data.services.map((s, i) => <ServiceBar key={s.name} {...s} index={i} />)}
                      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-[10px] text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-red-500" /> Critical
                        <span className="h-2 w-2 rounded-full bg-orange-500 ml-2" /> High
                        <span className="h-2 w-2 rounded-full bg-yellow-500 ml-2" /> Medium
                        <span className="ml-auto">{data.blastRadius.pipelines} pipelines affected</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Affected Teams</h3>
                      <div className="space-y-2">
                        {data.teams.map((t, i) => <TeamCard key={t.name} team={t} index={i} />)}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'risks' && (
                  <motion.div key="risks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Risk Analysis</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Detected Risks</h4>
                        <div className="space-y-2">
                          {data.risks.map((r, i) => <RiskCard key={i} item={r} index={i} />)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Blast Radius Impact</h4>
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div><div className="text-xl font-bold text-red-400">{data.blastRadius.services}</div><div className="text-[9px] text-slate-600">Services</div></div>
                            <div><div className="text-xl font-bold text-yellow-400">{data.blastRadius.teams}</div><div className="text-[9px] text-slate-600">Teams</div></div>
                            <div><div className="text-xl font-bold text-orange-400">{data.blastRadius.pipelines}</div><div className="text-[9px] text-slate-600">Pipelines</div></div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-[9px] text-slate-600 mb-1"><span>Blast Radius</span><span>{data.blastRadius.score}%</span></div>
                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${data.blastRadius.score}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'actions' && (
                  <motion.div key="actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Recommended Actions</h3>
                    <div className="space-y-2">
                      {data.actions.map((a, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-brand/20 transition-all">
                          <StatusBadge status={a.priority === 'P0' ? 'critical' : a.priority === 'P1' ? 'warning' : 'info'} label={a.priority} dot={false} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-300">{a.action}</div>
                            <div className="text-[9px] text-slate-600 mt-0.5">Owner: {a.owner} · Target: {a.deadline}</div>
                          </div>
                          <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!data && !loading && (
          <motion.div variants={item} className="text-center py-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-br from-brand/5 to-violet-500/5">
              <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Analyze a feature request</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter a feature request above to run instant risk analysis, impact prediction, and deployment readiness scoring.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
