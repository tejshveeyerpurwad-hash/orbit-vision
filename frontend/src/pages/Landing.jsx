import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAnalysis } from '../hooks/useAnalysis'
import Navbar from '../components/Navbar'
import FeatureRequestInput from '../components/FeatureRequestInput'
import RiskScoreGauge from '../components/RiskScoreGauge'
import ImpactCard from '../components/ImpactCard'
import HistoricalIncidents from '../components/HistoricalIncidents'
import DependencyGraph from '../components/DependencyGraph'
import RecommendedActions from '../components/RecommendedActions'
import ImplementationPlan from '../components/ImplementationPlan'
import FailureSimulator from '../components/FailureSimulator'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'
import IncidentPredictionPanel from '../components/IncidentPredictionPanel'

const features = [
  {
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    title: 'Incident Prediction',
    desc: 'ML-powered risk scoring that predicts incidents with 94% confidence before they reach production.',
  },
  {
    icon: 'M9.75 3.75v2.25m0 0V9m0-3.75h2.25M9.75 3.75h-2.25m0 0A2.25 2.25 0 005.25 6v.75m0 0A2.25 2.25 0 003 9v6.75A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75V9a2.25 2.25 0 00-2.25-2.25h-.75m0 0V6a2.25 2.25 0 00-2.25-2.25h-2.25m2.25 0V3.75',
    title: 'Knowledge Graph',
    desc: 'Interactive service topology with real-time risk propagation and blast radius visualization.',
  },
  {
    icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5',
    title: 'CTO Reports',
    desc: 'Executive summaries with team impact analysis, release readiness scoring, and action plans.',
  },
  {
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    title: 'Actionable Plans',
    desc: 'Prioritized implementation plans with phase timelines, team assignments, and status tracking.',
  },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function Landing() {
  const navigate = useNavigate()
  const { data, loading, error, analyze, reset, presets } = useAnalysis()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <motion.section style={{ opacity }} className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20">
          {/* Animated grid background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand/[0.04] blur-3xl" />
            <div className="absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-brand/[0.02] blur-3xl" />
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
            {/* Floating orbs */}
            <motion.div
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-brand/5 blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-brand/5 blur-2xl"
            />
          </div>

          <motion.div style={{ scale }} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                Predict. Prevent. Deploy with confidence.
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white"
              >
                Predict software risks{' '}
                <span className="text-gradient">before production</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
              >
                Orbit Foresight analyzes feature requests against your engineering history,
                surfacing incident predictions, service dependencies, and executive reports
                before you merge a single line of code.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <button
                  onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-[0.97] overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <svg className="h-4 w-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
                  </svg>
                  Try Demo
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-500 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white active:scale-[0.97]"
                >
                  Executive Dashboard
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="py-12 border-y border-white/[0.04]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Incidents Analyzed' },
                { value: '94%', label: 'Prediction Accuracy' },
                { value: '45min', label: 'Avg Response Time' },
                { value: '99.97%', label: 'Platform Uptime' },
              ].map((s) => (
                <motion.div key={s.label} variants={fadeUp} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-[11px] text-slate-600 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          id="features"
          className="py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Platform Features
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Everything engineering leaders{' '}
                <span className="text-gradient">need to ship safely</span>
              </h2>
            </motion.div>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="group glass-card p-5 hover:border-brand/20 transition-all duration-300"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-slate-500 transition-all duration-300 group-hover:border-brand/30 group-hover:bg-brand/10 group-hover:text-brand-light">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{f.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Architecture */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="py-16 sm:py-20 border-t border-white/[0.04]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Architecture
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Built for <span className="text-gradient">enterprise scale</span>
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-slate-900/30 p-6 sm:p-8 backdrop-blur-xl">
              <div className="grid gap-6 sm:grid-cols-5 items-center">
                {[
                  { layer: 'Frontend', tech: 'React + Vite', icon: '⚛️' },
                  { layer: 'API', tech: 'FastAPI', icon: '🔌' },
                  { layer: 'ML Engine', tech: 'PyTorch', icon: '🧠' },
                  { layer: 'Database', tech: 'PostgreSQL', icon: '🗄️' },
                  { layer: 'Infra', tech: 'Kubernetes', icon: '☸️' },
                ].map((a, i) => (
                  <div key={a.layer} className="flex flex-col items-center text-center">
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <div className="text-sm font-semibold text-white">{a.layer}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{a.tech}</div>
                    {i < 4 && <div className="hidden sm:block text-slate-700 text-lg mt-2">→</div>}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Analyzer */}
        <section id="analyzer" className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="mx-auto max-w-2xl text-center mb-8"
            >
              <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Live Demo
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                See it in action
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-2 text-sm text-slate-600">
                Enter a feature change below to see instant risk analysis
              </motion.p>
            </motion.div>

            <div className="mx-auto max-w-2xl">
              <div className="glass-strong rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/40">
                <FeatureRequestInput onAnalyze={analyze} loading={loading} presets={presets} />
              </div>
            </div>

            <div className="mx-auto max-w-5xl mt-8">
              <ErrorBanner message={error} onDismiss={reset} />

              {loading && <LoadingSkeleton />}

              {!data && !loading && !error && (
                <div className="mt-8">
                  <EmptyState onAnalyze={analyze} presets={presets} />
                </div>
              )}

              {data && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-12 space-y-12"
                >
                  <FailureSimulator data={data} />

                  <div className="border-t border-white/[0.04] pt-12">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20">
                        <svg className="h-4 w-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Risk Breakdown</h2>
                        <p className="text-xs text-slate-600">Services, files, and historical context</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      <RiskScoreGauge score={data.risk_score} />
                      <ImpactCard title="Impacted Services" items={data.impacted_services} type="service" />
                      <ImpactCard title="Impacted Files" items={data.impacted_files} type="file" />
                      <ImpactCard title="Potential Failures" items={data.potential_failures} type="failure" />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2 mt-6">
                      <DependencyGraph deps={data.dependency_analysis} interactive />
                      <HistoricalIncidents changes={data.historical_changes} />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2 mt-6">
                      <RecommendedActions actions={data.recommended_actions} />
                      <ImplementationPlan plan={data.implementation_plan} />
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-6 py-3 text-sm font-semibold text-brand-light transition-all hover:bg-brand/20 hover:shadow-lg hover:shadow-brand/10 active:scale-[0.97]"
                    >
                      Open Executive Dashboard
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.04] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-6 w-6 items-center justify-center">
                <div className="absolute h-6 w-6 rounded-full bg-brand/20" />
                <div className="relative h-1.5 w-1.5 rounded-full bg-brand" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                Orbit<span className="text-brand">Foresight</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-700">
              Predict. Prevent. Deploy with confidence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
