import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAnalysis } from '../hooks/useAnalysis'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import Gauge from '../components/Gauge'
import StatusBadge from '../components/StatusBadge'
import MetricCard from '../components/MetricCard'
import IncidentPredictionPanel from '../components/IncidentPredictionPanel'
import DeploymentTimeline from '../components/DeploymentTimeline'
import { SkeletonBlock } from '../components/SkeletonCard'
import DashboardTabs from '../components/DashboardTabs'
import FeatureRequestInput from '../components/FeatureRequestInput'
import IncidentPredictionCenter from '../components/IncidentPredictionCenter'
import OrbitKnowledgeGraph from '../components/OrbitKnowledgeGraph'
import AICTOReportPage from '../components/AICTOReportPage'
import ErrorBanner from '../components/ErrorBanner'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('simulator')
  const { data, loading, error, analyze, reset, presets } = useAnalysis()

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
              {activeTab === 'simulator' && 'Incident Prediction Center'}
              {activeTab === 'knowledge-graph' && 'Orbit Knowledge Graph'}
              {activeTab === 'cto-report' && 'AI CTO Report'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === 'simulator' && 'Real-time risk analysis and deployment guidance for your feature changes'}
              {activeTab === 'knowledge-graph' && 'Interactive service topology with risk propagation and blast radius visualization'}
              {activeTab === 'cto-report' && 'Executive summary with team impact analysis and release readiness scoring'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="success" label="System Online" />
            <StatusBadge status="info" label="ML v3.2" />
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Risk Score" value="72%" color="text-red-400" trend="↑ 8% this week" delay={0} />
          <StatCard label="Confidence Score" value="91%" color="text-green-400" trend="↑ 3% this week" delay={0.05} />
          <StatCard label="Incident Probability" value="82%" color="text-orange-400" trend="↓ 5% this week" delay={0.1} />
          <StatCard label="Release Readiness" value="74%" color="text-yellow-400" trend="↑ 12% this week" delay={0.15} />
        </motion.div>

        {/* Gauges + Prediction Panel */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
            <Gauge value={72} label="Risk Score" sub="High Risk" color="#ef4444" delay={200} subtitle="of changes cause incidents" />
            <Gauge value={91} label="Confidence Score" sub="Model Accuracy" color="#22c55e" delay={400} subtitle="prediction confidence" />
            <Gauge value={82} label="Incident Probability" sub="Risk Assessment" color="#f59e0b" delay={600} subtitle="probability of incident" />
            <Gauge value={74} label="Release Readiness" sub="Deployment Health" color="#06b6d4" delay={800} subtitle="ready for production" />
          </motion.div>
          <motion.div variants={item}>
            <IncidentPredictionPanel />
          </motion.div>
        </div>

        {/* Metrics + Timeline */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={item}>
            <MetricCard
              title="Active Analyses"
              delay={0.2}
              metrics={[
                { label: 'Affected Services', value: '5', dot: 'bg-red-500', color: 'text-red-400' },
                { label: 'Affected Teams', value: '3', dot: 'bg-yellow-500', color: 'text-yellow-400' },
                { label: 'Affected Pipelines', value: '2', dot: 'bg-orange-500', color: 'text-orange-400' },
                { label: 'Deployment Recommendation', value: 'Proceed with Caution', badge: 'warning' },
              ]}
            />
          </motion.div>
          <motion.div variants={item} className="lg:col-span-2">
            <DeploymentTimeline />
          </motion.div>
        </div>

        {/* Input + Results */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <FeatureRequestInput onAnalyze={analyze} loading={loading} presets={presets} />
            </div>
            {data && !loading && (
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status="success" label="Analyzed" />
                <button
                  onClick={reset}
                  className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-[10px] text-slate-600 hover:bg-white/[0.04] hover:text-slate-400 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <ErrorBanner message={error} onDismiss={reset} />

        {loading && <SkeletonBlock />}

        {data && !loading && (
          <motion.div variants={item} className="space-y-6">
            <DashboardTabs active={activeTab} onChange={setActiveTab} />

            {activeTab === 'simulator' && <IncidentPredictionCenter data={data} />}
            {activeTab === 'knowledge-graph' && (
              <OrbitKnowledgeGraph
                services={data.blast_radius_explorer?.services}
                riskPaths={data.blast_radius_explorer?.risk_paths}
              />
            )}
            {activeTab === 'cto-report' && <AICTOReportPage data={data} />}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
