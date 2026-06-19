import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const faqs = [
  { q: 'How does the risk score work?', a: 'Risk scores are calculated using ML models trained on historical incident data, dependency graph analysis, and change characteristics. The model achieves 94% accuracy against known incidents.' },
  { q: 'What data sources are integrated?', a: 'Orbit Foresight integrates with GitHub, GitLab, PagerDuty, Slack, Docker, Kubernetes, and major CI/CD providers including Jenkins, CircleCI, and GitHub Actions.' },
  { q: 'How often is the data refreshed?', a: 'Dashboards refresh every 30 seconds. Real-time alerts are pushed via WebSocket connections. Historical data is re-processed nightly for ML model retraining.' },
  { q: 'Can I customize the risk thresholds?', a: 'Yes. Navigate to Settings to configure custom risk thresholds per service and team. You can set warning and critical thresholds independently.' },
  { q: 'What is the blast radius visualization?', a: 'Blast radius shows all downstream services that would be affected by a failure in any given service. This includes direct and transitive dependencies up to 3 levels deep.' },
  { q: 'How do I integrate with my CI/CD pipeline?', a: 'Use the Deployment Simulator to test integrations. Then add the Orbit webhook to your pipeline configuration. See our API Reference for endpoint details.' },
]

const docs = [
  { title: 'Getting Started Guide', desc: 'Set up your workspace and configure data sources', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { title: 'API Reference', desc: 'REST API documentation for programmatic access', icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
  { title: 'Architecture Overview', desc: 'System architecture, deployment, and scaling guide', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { title: 'Security & Compliance', desc: 'Security model, encryption, and compliance certifications', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
]

const architecture = [
  { layer: 'Frontend', tech: 'React + Vite + TailwindCSS', desc: 'Single-page application with real-time WebSocket updates and interactive visualizations' },
  { layer: 'API Gateway', tech: 'FastAPI + Python', desc: 'RESTful API with automatic OpenAPI documentation and request validation' },
  { layer: 'ML Engine', tech: 'scikit-learn + PyTorch', desc: 'Risk prediction models trained on 10K+ historical incidents with 94% accuracy' },
  { layer: 'Database', tech: 'PostgreSQL + Redis', desc: 'Primary data store with Redis caching layer for sub-100ms query responses' },
  { layer: 'Infrastructure', tech: 'Docker + Kubernetes', desc: 'Containerized microservices deployed on Kubernetes with auto-scaling' },
]

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null)
  const [activeDoc, setActiveDoc] = useState('docs')

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Help & Documentation</h1>
          <p className="mt-1 text-sm text-slate-500">Guides, references, architecture, and frequently asked questions</p>
        </motion.div>

        <motion.div variants={item} className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {['docs', 'architecture', 'faq'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveDoc(tab)}
              className={`rounded-lg px-4 py-2 text-xs font-medium capitalize transition-all ${
                activeDoc === tab ? 'bg-brand/[0.08] text-brand-light' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
            >
              {tab === 'faq' ? 'FAQ' : tab === 'docs' ? 'Documentation' : 'Architecture'}
            </button>
          ))}
        </motion.div>

        {activeDoc === 'docs' && (
          <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {docs.map((d) => (
              <button
                key={d.title}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left hover:border-brand/20 hover:bg-brand/[0.04] transition-all"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-slate-500 group-hover:border-brand/30 group-hover:bg-brand/10 group-hover:text-brand-light transition-all">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={d.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{d.title}</h3>
                <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">{d.desc}</p>
              </button>
            ))}
          </motion.div>
        )}

        {activeDoc === 'architecture' && (
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Orbit Foresight Architecture</h3>
            <div className="space-y-3">
              {architecture.map((a, i) => (
                <div key={a.layer} className="flex items-start gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-xs font-bold text-brand-light">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{a.layer}</span>
                      <StatusBadge status="info" label={a.tech} dot={false} />
                    </div>
                    <p className="text-xs text-slate-500">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center">
              <svg className="w-full max-w-lg" viewBox="0 0 400 60" fill="none">
                <line x1="50" y1="10" x2="350" y2="10" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="50" cy="10" r="4" fill="#06b6d4" />
                <circle cx="125" cy="10" r="4" fill="#06b6d4" />
                <circle cx="200" cy="10" r="4" fill="#06b6d4" />
                <circle cx="275" cy="10" r="4" fill="#06b6d4" />
                <circle cx="350" cy="10" r="4" fill="#06b6d4" />
              </svg>
            </div>
          </motion.div>
        )}

        {activeDoc === 'faq' && (
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-1">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-xs text-slate-300 hover:bg-white/[0.02] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <svg className={`h-3 w-3 text-slate-600 shrink-0 transition-transform ${openFaq === faq.q ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openFaq === faq.q && (
                    <div className="px-3 pb-3 text-[10px] text-slate-500 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
