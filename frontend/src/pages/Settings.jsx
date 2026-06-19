import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const sections = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'team', label: 'Team & Billing' },
]

const configItems = [
  { label: 'Dark Mode', desc: 'System-wide theme preference', value: true, section: 'general' },
  { label: 'Auto-refresh data', desc: 'Refresh dashboards every 30 seconds', value: true, section: 'general' },
  { label: 'Email notifications', desc: 'Receive incident alerts via email', value: false, section: 'notifications' },
  { label: 'Slack integration', desc: 'Post deployment updates to Slack', value: true, section: 'integrations' },
  { label: 'PagerDuty alerts', desc: 'Route critical alerts to PagerDuty', value: false, section: 'integrations' },
  { label: 'Anomaly detection', desc: 'ML-powered anomaly detection for production metrics', value: true, section: 'general' },
  { label: 'Audit logging', desc: 'Log all configuration changes for compliance', value: true, section: 'general' },
  { label: 'Rollback automation', desc: 'Automatically roll back on deployment failure', value: false, section: 'general' },
  { label: 'Weekly digest', desc: 'Receive weekly performance summary', value: true, section: 'notifications' },
  { label: 'GitHub integration', desc: 'Sync incident data with GitHub issues', value: true, section: 'integrations' },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState(configItems)

  const toggle = (label) => {
    setSettings(prev => prev.map(s => s.label === label ? { ...s, value: !s.value } : s))
  }

  const filteredSettings = settings.filter(s => s.section === activeSection)

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your workspace configuration</p>
        </motion.div>

        <motion.div variants={item} className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeSection === s.id
                  ? 'bg-brand/[0.08] text-brand-light'
                  : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Configuration</h3>
              <p className="text-[10px] text-slate-600">Toggle features and integrations on or off</p>
            </div>
            <StatusBadge status="info" label={`${filteredSettings.length} options`} />
          </div>
          <div className="space-y-1">
            {filteredSettings.map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.02] transition-colors">
                <div>
                  <span className="text-sm text-slate-300">{s.label}</span>
                  <p className="text-[10px] text-slate-600">{s.desc}</p>
                </div>
                <button
                  onClick={() => toggle(s.label)}
                  className={`relative h-5 w-9 rounded-full transition-all shrink-0 ${
                    s.value ? 'bg-brand' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                    s.value ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">System Information</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Version', value: '2.4.1' },
              { label: 'Last Updated', value: 'Jun 15, 2026' },
              { label: 'Data Retention', value: '90 days' },
              { label: 'API Status', value: 'Operational', badge: 'success' },
              { label: 'ML Model', value: 'v3.2 — 94% accuracy' },
              { label: 'Uptime', value: '99.97% this quarter', badge: 'success' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <span className="text-[10px] text-slate-600">{s.label}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-medium text-slate-300">{s.value}</span>
                  {s.badge && <StatusBadge status={s.badge} label={s.value} dot={false} />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}
