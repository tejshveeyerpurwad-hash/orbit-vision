import { motion } from 'framer-motion'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }
const fadeUpSmall = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

const stages = [
  {
    num: '01', title: 'Code Change',
    desc: 'Every deployment, merge request, and config change triggers immediate intelligence analysis across your entire engineering surface.',
    icon: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z',
    color: 'text-blue-400', border: 'border-blue-500/20', bg: 'from-blue-500/20 to-indigo-500/10', accent: 'rgba(59,130,246,0.5)', glow: 'rgba(59,130,246,0.15)',
  },
  {
    num: '02', title: 'AI Investigation Engine',
    desc: 'Neural networks scan 15 dimensions of engineering telemetry — code, traffic, dependencies, configs, logs — in milliseconds to surface hidden risks.',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
    color: 'text-violet-400', border: 'border-violet-500/20', bg: 'from-violet-500/20 to-purple-500/10', accent: 'rgba(139,92,246,0.5)', glow: 'rgba(139,92,246,0.15)',
  },
  {
    num: '03', title: 'Digital Twin Builder',
    desc: 'A real-time mirror of your production environment models every service, dependency, and traffic pattern for failure simulation.',
    icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
    color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'from-cyan-500/20 to-teal-500/10', accent: 'rgba(6,182,212,0.5)', glow: 'rgba(6,182,212,0.15)',
  },
  {
    num: '04', title: 'Knowledge Graph',
    desc: 'An auto-discovered dependency map with 847+ service nodes, live risk weights, and cascading failure propagation paths.',
    icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'from-emerald-500/20 to-green-500/10', accent: 'rgba(52,211,153,0.5)', glow: 'rgba(52,211,153,0.15)',
  },
  {
    num: '05', title: 'Business Impact Simulator',
    desc: 'Quantifies revenue exposure, SLA risk, and customer impact for every detected anomaly — before it reaches production.',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    color: 'text-amber-400', border: 'border-amber-500/20', bg: 'from-amber-500/20 to-orange-500/10', accent: 'rgba(251,191,36,0.5)', glow: 'rgba(251,191,36,0.15)',
  },
  {
    num: '06', title: 'Executive Action',
    desc: 'Boardroom-ready CTO reports, prioritized remediation plans, and one-click deployment decisions — generated in under 60 seconds.',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z',
    color: 'text-pink-400', border: 'border-pink-500/20', bg: 'from-pink-500/20 to-rose-500/10', accent: 'rgba(244,114,182,0.5)', glow: 'rgba(244,114,182,0.15)',
  },
]

const outcomes = [
  { label: 'Predict', desc: 'Detect failures before customers notice', color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'from-cyan-500/15 to-blue-500/5' },
  { label: 'Investigate', desc: 'Find root cause in seconds', color: 'text-violet-400', border: 'border-violet-500/20', bg: 'from-violet-500/15 to-purple-500/5' },
  { label: 'Prevent', desc: 'Stop outages before production', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'from-emerald-500/15 to-green-500/5' },
  { label: 'Optimize', desc: 'Reduce operational risk', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'from-amber-500/15 to-orange-500/5' },
  { label: 'Empower', desc: 'Give executives instant clarity', color: 'text-pink-400', border: 'border-pink-500/20', bg: 'from-pink-500/15 to-rose-500/5' },
]

const metrics = [
  { value: '30', suffix: 's', label: 'Average Investigation\nTime', color: 'text-cyan-400' },
  { value: '94', suffix: '%', label: 'Root Cause\nAccuracy', color: 'text-violet-400' },
  { value: '$2.8', suffix: 'M', label: 'Protected\nRevenue', color: 'text-emerald-400' },
  { value: '87', suffix: '%', label: 'Faster Incident\nResolution', color: 'text-amber-400' },
]

function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 3,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-brand/40"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function ConnectorDots({ index }) {
  const colors = ['rgba(59,130,246,0.4)', 'rgba(139,92,246,0.4)', 'rgba(6,182,212,0.4)', 'rgba(52,211,153,0.4)', 'rgba(251,191,36,0.4)']
  return (
    <div className="hidden lg:flex flex-col items-center justify-center px-1 relative">
      <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{ backgroundColor: colors[index] || 'rgba(244,114,182,0.4)' }}
        animate={{ y: [-20, 20], opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-1 h-1 rounded-full"
        style={{ backgroundColor: colors[index] || 'rgba(244,114,182,0.4)' }}
        animate={{ y: [20, -20], opacity: [1, 0.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 + 0.5, ease: 'easeInOut' }}
      />
    </div>
  )
}

export default function SolutionSection() {
  return (
    <section className="relative border-t border-white/[0.04] py-16 sm:py-20 overflow-hidden">
      <ParticleField />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mx-auto max-w-3xl text-center mb-14"
        >
          <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light tracking-wider uppercase">
            Intelligence Pipeline
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            How Orbit Foresight{' '}
            <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">Thinks</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            From a single deployment to executive action in under 30 seconds.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-0 lg:gap-2"
        >
          {stages.map((s, i) => (
            <div key={s.num} className="flex flex-col lg:flex-row items-center w-full lg:w-auto">
              <motion.div
                variants={fadeUpSmall}
                className="group relative w-full lg:w-48 xl:w-56 rounded-2xl border border-white/[0.06] bg-slate-900/60 backdrop-blur-xl p-5 transition-all duration-500 hover:scale-[1.03]"
                style={{
                  boxShadow: `0 0 40px ${s.glow}, 0 0 80px ${s.glow}`,
                }}
                whileHover={{
                  boxShadow: `0 0 60px ${s.glow}, 0 0 120px ${s.glow}`,
                  borderColor: s.accent,
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                <div className="relative flex items-start gap-3 lg:flex-col lg:items-center lg:text-center">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color} ring-1 ring-white/[0.06] transition-all duration-300 group-hover:ring-2 group-hover:scale-110`}
                    style={{ ringColor: s.accent }}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  <div className="lg:mt-3">
                    <span className={`text-[10px] font-mono font-bold tracking-wider ${s.color} opacity-50`}>{s.num}</span>
                    <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors mt-0.5">{s.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 hidden lg:block">{s.desc}</p>
                  </div>
                </div>

                <motion.div
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${s.accent}20, transparent 50%, ${s.accent}10)`,
                  }}
                />
              </motion.div>

              {i < stages.length - 1 && <ConnectorDots index={i} />}
            </div>
          ))}
        </motion.div>

        <div className="mt-12 lg:hidden space-y-3">
          {stages.map((s) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: parseInt(s.num) * 0.08 }}
              className={`flex items-start gap-3 rounded-xl border ${s.border} bg-gradient-to-br ${s.bg} p-4`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.color}`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-bold ${s.color} opacity-50`}>{s.num}</span>
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mt-14"
        >
          <motion.div variants={fadeUp} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-slate-400 tracking-wider uppercase">
              Outcomes
            </div>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {outcomes.map((o) => (
              <motion.div
                key={o.label}
                variants={fadeUpSmall}
                className={`group relative rounded-xl border ${o.border} bg-gradient-to-br ${o.bg} p-4 text-center transition-all duration-300 hover:scale-[1.04]`}
                style={{ boxShadow: '0 0 30px rgba(0,0,0,0.2)' }}
              >
                <div className={`text-lg font-bold ${o.color} mb-1`}>{o.label}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{o.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mt-10"
        >
          <motion.div variants={fadeUp} className="text-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light tracking-wider uppercase">
              Executive Intelligence Metrics
            </div>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-white/[0.06] bg-slate-900/50 backdrop-blur-xl p-5 text-center transition-all duration-300 hover:border-white/[0.12]"
              >
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className={`text-3xl sm:text-4xl font-bold ${m.color}`}>{m.value}</span>
                  <span className={`text-lg font-bold ${m.color} opacity-80`}>{m.suffix}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 whitespace-pre-line leading-relaxed">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-2 text-xs text-emerald-400 font-medium">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Intelligence pipeline operational — from signal to decision in under 30 seconds
          </div>
        </motion.div>
      </div>
    </section>
  )
}
