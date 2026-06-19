import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import MetricCard from '../components/MetricCard'

const services = [
  { name: 'Payment Service', risk: 87, files: 12, teams: ['Payments'], pipelines: ['CI/CD Payments'], status: 'critical', deps: ['Billing Service', 'Auth Service'], db: 'payment_db' },
  { name: 'Billing Service', risk: 65, files: 8, teams: ['Billing'], pipelines: ['CI/CD Billing'], status: 'warning', deps: ['Auth Service'], db: 'billing_db' },
  { name: 'Auth Service', risk: 23, files: 3, teams: ['Security'], pipelines: ['CI/CD Auth'], status: 'safe', deps: [], db: 'auth_db' },
  { name: 'Notification Service', risk: 45, files: 5, teams: ['Platform'], pipelines: ['CI/CD Notifications'], status: 'warning', deps: ['Auth Service'], db: null },
  { name: 'API Gateway', risk: 72, files: 9, teams: ['Platform', 'Infra'], pipelines: ['CI/CD Gateway'], status: 'critical', deps: ['Payment Service', 'Auth Service'], db: null },
]

const changes = [
  { file: 'src/services/payment/retry.go', type: 'modify', risk: 'high', lines: '+45/-12', author: '@alice' },
  { file: 'src/services/payment/config.go', type: 'modify', risk: 'medium', lines: '+8/-2', author: '@alice' },
  { file: 'src/services/billing/invoice.go', type: 'modify', risk: 'medium', lines: '+22/-5', author: '@bob' },
  { file: 'src/services/payment/webhook.go', type: 'delete', risk: 'low', lines: '0/-34', author: '@carol' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function ChangeImpactAnalysis() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Change Impact Analysis</h1>
          <p className="mt-1 text-sm text-slate-500">Service-level risk propagation and blast radius visualization</p>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Impacted Services" value="5" color="text-red-400" trend="↑ 2 from last change" />
          <StatCard label="Files Changed" value="4" color="text-yellow-400" />
          <StatCard label="Impacted Teams" value="3" color="text-orange-400" />
          <StatCard label="Impacted Databases" value="2" color="text-blue-400" />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Service Impact Map</h3>
              <StatusBadge status="warning" label="5 services" />
            </div>
            <div className="space-y-2">
              {services.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedService(selectedService?.name === s.name ? null : s)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    selectedService?.name === s.name
                      ? 'border-brand/30 bg-brand/[0.06]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{s.name}</span>
                    <StatusBadge status={s.status} label={`${s.risk}%`} />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600">
                    <span>{s.files} files</span>
                    <span>{s.teams.join(', ')}</span>
                    {s.db && <span>{s.db}</span>}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Change Set</h3>
              <div className="space-y-2">
                {changes.map((c, i) => (
                  <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-mono text-slate-400 truncate max-w-[180px]">{c.file}</span>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={c.risk} label={c.risk} dot={false} />
                        <span className="text-[10px] text-slate-600">{c.lines}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span className="capitalize">{c.type}</span>
                      <span>by {c.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <MetricCard
              title="Impacted Pipelines"
              metrics={[
                { label: 'CI/CD Payments', value: 'High Risk', badge: 'critical' },
                { label: 'CI/CD Billing', value: 'Medium Risk', badge: 'warning' },
                { label: 'CI/CD Gateway', value: 'High Risk', badge: 'critical' },
              ]}
            />
          </motion.div>
        </div>

        {selectedService && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="rounded-xl border border-brand/20 bg-brand/[0.04] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-brand-light">{selectedService.name} — Dependency Chain</h3>
              <StatusBadge status={selectedService.status} label={`${selectedService.risk}% Risk`} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <span className="text-[10px] text-slate-600">Teams</span>
                <div className="flex gap-1 mt-1">
                  {selectedService.teams.map(t => (
                    <span key={t} className="rounded bg-white/[0.06] px-2 py-1 text-xs text-slate-400">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-600">Upstream Dependencies</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {selectedService.deps.length > 0 ? selectedService.deps.map(d => (
                    <span key={d} className="rounded bg-white/[0.06] px-2 py-1 text-xs text-slate-400">{d}</span>
                  )) : <span className="text-xs text-slate-600">None</span>}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-600">Database</span>
                <div className="mt-1 text-xs text-slate-400">{selectedService.db || 'No database'}</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
