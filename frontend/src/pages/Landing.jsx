import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import SolutionSection from '../components/SolutionSection'
import OrbitLogo from '../components/branding/OrbitLogo'

function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = value / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [value, duration])
  return <span>{count}{suffix}</span>
}

function AnimatedCounterDecimal({ value, suffix = '', duration = 2, decimals = 0 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = value / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(parseFloat(start.toFixed(decimals)))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [value, duration, decimals])
  return <span>{count.toFixed(decimals)}{suffix}</span>
}

function AnimatedCounterWithComma({ value, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = value / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [value, duration])
  const formatted = count.toLocaleString()
  return <span>{formatted}{suffix}</span>
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const staggerSlow = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const staggerFast = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }
const fadeUpSmall = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }
const slideUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

const bootLines = [
  'Loading Engineering Intelligence Engine',
  'Connecting Deployment Graph',
  'Loading Historical Intelligence',
  'Building Knowledge Graph',
  'Activating Risk Prediction Engine',
  'Initializing Executive Command Center',
  'Connecting Investigation Platform',
  'Syncing Incident Intelligence',
  'Calibrating Risk Thresholds',
  'Validating Data Pipelines',
  'Starting Monitoring Services',
  'Loading Alert Configurations',
  'Initializing Dashboard Modules',
  'Running Diagnostic Checks',
  'Enabling Incident Detection',
  'Finalizing System Startup',
]

const archLayers = [
  { layer: 'Application', components: 'React 18, Tailwind, Framer Motion', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/20' },
  { layer: 'API Gateway', components: 'FastAPI, WebSocket, Rate Limiting', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418', color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/10', border: 'border-green-500/20' },
  { layer: 'ML Engine', components: 'Risk Prediction, Pattern Recognition', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z', color: 'text-violet-400', bg: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/20' },
  { layer: 'Data Layer', components: 'Orbit API, PostgreSQL, Redis Cache', icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125', color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/20' },
  { layer: 'Infrastructure', components: 'Docker, Kubernetes, CI/CD', icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z', color: 'text-brand-light', bg: 'from-brand/20 to-violet-500/10', border: 'border-brand/20' },
]

const howItWorks = [
  {
    step: 1, title: 'Connect Your Stack',
    desc: 'Integrate Orbit Foresight with your GitLab repositories, CI/CD pipelines, and monitoring systems in minutes.',
    icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'from-cyan-500/20 to-blue-500/10',
  },
  {
    step: 2, title: 'AI Analyzes Everything',
    desc: 'Our machine learning engine scans your engineering history, dependency graph, and deployment patterns for risk signals.',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
    color: 'text-violet-400', border: 'border-violet-500/20', bg: 'from-violet-500/20 to-purple-500/10',
  },
  {
    step: 3, title: 'Predict & Prevent',
    desc: 'Get real-time risk scores, incident predictions, and blast radius maps before changes reach production.',
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    color: 'text-rose-400', border: 'border-rose-500/20', bg: 'from-rose-500/20 to-red-500/10',
  },
  {
    step: 4, title: 'Execute with Intelligence',
    desc: 'Generate engineering action plans, CTO reports, and deployment strategies backed by AI-driven insights.',
    icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605',
    color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'from-emerald-500/20 to-green-500/10',
  },
]

const securityItems = [
  { title: 'SOC 2 Type II Certified', desc: 'Enterprise-grade security controls and annual audits ensuring data protection and compliance.', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z', border: 'border-emerald-500/20', accent: 'text-emerald-500' },
  { title: 'GDPR Compliant', desc: 'Full compliance with European data protection regulations for global engineering teams.', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z', border: 'border-cyan-500/20', accent: 'text-cyan-500' },
  { title: 'Encryption at Rest & Transit', desc: 'AES-256 encryption for stored data and TLS 1.3 for all data in transit between services.', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', border: 'border-violet-500/20', accent: 'text-violet-500' },
  { title: '99.99% SLA Guarantee', desc: 'Enterprise service level agreement with guaranteed uptime and 24/7 support coverage.', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', border: 'border-brand/20', accent: 'text-brand-light' },
]

const statusMessages = [
  'Analysis complete: Payment pipeline risk assessment generated',
  'New incident detected: auth service latency anomaly in staging',
  'Knowledge Graph updated: 3 new service dependencies discovered',
  'Incident prevented: circuit breaker contained cascade failure',
  'CTO Report generated: Q3 Engineering Health Summary ready',
  'Deployment approved: billing service v2.4.1 promoted to production',
  'Risk scan complete: 12 services analyzed, 0 critical issues',
  'Executive briefing: weekly engineering intelligence digest ready',
  'System health check passed: all services operating within normal parameters',
  'New deployment detected: payment service rolling out canary release',
  'Incident analysis complete: root cause identified for cache invalidation bug',
  'Risk score updated: auth service risk decreased from 72% to 65%',
  'Knowledge Graph sync: 2 deprecated services removed from topology',
  'Executive report: monthly engineering ROI analysis generated',
  'Alert threshold adjusted: incident sensitivity calibrated for payment pipeline',
  'Dependency scan: 4 new service connections discovered in auth domain',
]

export default function Landing() {
  const navigate = useNavigate()
  const [booting, setBooting] = useState(true)
  const [bootProgress, setBootProgress] = useState(0)
  const [visibleBootLines, setVisibleBootLines] = useState(0)
  const [bootDone, setBootDone] = useState(false)
  const [feedIndex, setFeedIndex] = useState(0)
  const featuresRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex(i => (i + 1) % statusMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let frame
    const startTime = Date.now()
    const duration = 2500
    function tick() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(Math.round((elapsed / duration) * 100), 100)
      setBootProgress(progress)
      if (progress < 100) {
        frame = requestAnimationFrame(tick)
      } else {
        setBootDone(true)
        setTimeout(() => setBooting(false), 600)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (bootProgress === 0) return
    const lineIndex = Math.min(Math.floor((bootProgress / 100) * bootLines.length), bootLines.length - 1)
    const timer = setTimeout(() => setVisibleBootLines(lineIndex + 1), 80)
    return () => clearTimeout(timer)
  }, [bootProgress])

  function scrollToFeatures() {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <AnimatePresence>
        {booting && (
          <motion.div
            key="boot-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  ORBIT FORESIGHT
                </span>
              </motion.h1>
              <motion.p
                className="mt-3 text-lg text-slate-500 tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Predict Before Production
              </motion.p>
            </motion.div>

            <motion.div
              className="mt-10 w-72 sm:w-96"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand via-violet-400 to-cyan-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${bootProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            <div className="mt-8 space-y-2.5 w-80 sm:w-96">
              {bootLines.slice(0, visibleBootLines).map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2.5"
                >
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-xs text-slate-400 font-mono">{line}</span>
                </motion.div>
              ))}
              {bootDone && bootLines.slice(visibleBootLines).map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-2.5"
                >
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-xs text-slate-400 font-mono">{line}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: bootDone ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6"
            >
              {bootDone && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-[10px] text-slate-600 font-mono tracking-wider"
                >
                  SYSTEM READY
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-[8%] left-[12%] h-3 w-3 rounded-full bg-brand/10"
              animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
            />
            <motion.div
              className="absolute top-[15%] left-[30%] h-2 w-2 rounded-full bg-violet-500/10"
              animate={{ y: [0, -35, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
            <motion.div
              className="absolute top-[25%] left-[20%] h-4 w-4 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -45, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            />
            <motion.div
              className="absolute top-[40%] left-[45%] h-2.5 w-2.5 rounded-full bg-brand/10"
              animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
            <motion.div
              className="absolute top-[12%] right-[22%] h-3 w-3 rounded-full bg-violet-500/10"
              animate={{ y: [0, -50, 0], opacity: [0.15, 0.6, 0.15] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
            <motion.div
              className="absolute top-[30%] right-[30%] h-2 w-2 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -25, 0], opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            />
            <motion.div
              className="absolute top-[50%] right-[18%] h-3.5 w-3.5 rounded-full bg-brand/10"
              animate={{ y: [0, -40, 0], opacity: [0.1, 0.45, 0.1] }}
              transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            />
            <motion.div
              className="absolute bottom-[25%] left-[28%] h-2 w-2 rounded-full bg-violet-500/10"
              animate={{ y: [0, -35, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
            <motion.div
              className="absolute bottom-[30%] right-[22%] h-3 w-3 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -45, 0], opacity: [0.2, 0.65, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
            <motion.div
              className="absolute top-[10%] right-[15%] h-2 w-2 rounded-full bg-brand/10"
              animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            <motion.div
              className="absolute top-[75%] left-[15%] h-2.5 w-2.5 rounded-full bg-violet-500/10"
              animate={{ y: [0, -38, 0], opacity: [0.15, 0.55, 0.15] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
            />
            <motion.div
              className="absolute bottom-[15%] right-[30%] h-3 w-3 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -42, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            />
            <motion.div
              className="absolute top-[45%] left-[75%] h-2 w-2 rounded-full bg-brand/10"
              animate={{ y: [0, -28, 0], opacity: [0.1, 0.45, 0.1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
            />
            <motion.div
              className="absolute top-[55%] left-[65%] h-3.5 w-3.5 rounded-full bg-violet-500/10"
              animate={{ y: [0, -48, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            />
            <motion.div
              className="absolute top-[22%] left-[55%] h-2 w-2 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -32, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
            />
            <motion.div
              className="absolute bottom-[35%] left-[40%] h-3 w-3 rounded-full bg-brand/10"
              animate={{ y: [0, -36, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
            <motion.div
              className="absolute top-[80%] right-[18%] h-2.5 w-2.5 rounded-full bg-violet-500/10"
              animate={{ y: [0, -40, 0], opacity: [0.15, 0.6, 0.15] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
            />
            <motion.div
              className="absolute top-[8%] left-[65%] h-2 w-2 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
            />
            <motion.div
              className="absolute bottom-[10%] left-[22%] h-3 w-3 rounded-full bg-brand/10"
              animate={{ y: [0, -44, 0], opacity: [0.1, 0.55, 0.1] }}
              transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
            />
            <motion.div
              className="absolute bottom-[45%] right-[12%] h-2.5 w-2.5 rounded-full bg-violet-500/10"
              animate={{ y: [0, -38, 0], opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1.9 }}
            />
            <motion.div
              className="absolute top-[60%] left-[8%] h-2 w-2 rounded-full bg-brand/10"
              animate={{ y: [0, -35, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
            />
            <motion.div
              className="absolute top-[35%] right-[8%] h-3 w-3 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -42, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
            />
            <motion.div
              className="absolute top-[65%] left-[50%] h-2.5 w-2.5 rounded-full bg-violet-500/10"
              animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 2.8 }}
            />
            <motion.div
              className="absolute top-[5%] left-[45%] h-2 w-2 rounded-full bg-brand/10"
              animate={{ y: [0, -28, 0], opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            />
            <motion.div
              className="absolute bottom-[5%] left-[55%] h-3 w-3 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -38, 0], opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.75 }}
            />
            <motion.div
              className="absolute top-[70%] right-[40%] h-2 w-2 rounded-full bg-violet-500/10"
              animate={{ y: [0, -32, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}
            />
            <motion.div
              className="absolute top-[18%] left-[80%] h-2.5 w-2.5 rounded-full bg-brand/10"
              animate={{ y: [0, -36, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.7 }}
            />
            <motion.div
              className="absolute bottom-[20%] left-[70%] h-2 w-2 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.55 }}
            />
            <motion.div
              className="absolute top-[55%] left-[35%] h-3 w-3 rounded-full bg-violet-500/10"
              animate={{ y: [0, -44, 0], opacity: [0.15, 0.55, 0.15] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 2.6 }}
            />
            <motion.div
              className="absolute top-[85%] left-[45%] h-2 w-2 rounded-full bg-brand/10"
              animate={{ y: [0, -25, 0], opacity: [0.1, 0.45, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.25 }}
            />
            <motion.div
              className="absolute bottom-[40%] right-[55%] h-2.5 w-2.5 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -35, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
            <motion.div
              className="absolute top-[15%] left-[10%] h-2 w-2 rounded-full bg-violet-500/10"
              animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            />
            <motion.div
              className="absolute top-[75%] right-[55%] h-3 w-3 rounded-full bg-brand/10"
              animate={{ y: [0, -42, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            />
            <motion.div
              className="absolute bottom-[50%] left-[60%] h-2 w-2 rounded-full bg-cyan-500/10"
              animate={{ y: [0, -28, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
            />
            <motion.div
              className="absolute top-[42%] left-[18%] h-2.5 w-2.5 rounded-full bg-violet-500/10"
              animate={{ y: [0, -38, 0], opacity: [0.15, 0.55, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.85 }}
            />
            <motion.div className="absolute top-[32%] left-[12%] h-2 w-2 rounded-full bg-cyan-500/10" animate={{ y: [0, -29, 0], opacity: [0.14, 0.48, 0.14] }} transition={{ duration: 7.1, repeat: Infinity, ease: 'easeInOut', delay: 4 }} />
            <motion.div className="absolute bottom-[38%] right-[35%] h-3 w-3 rounded-full bg-violet-500/10" animate={{ y: [0, -37, 0], opacity: [0.18, 0.56, 0.18] }} transition={{ duration: 8.3, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }} />
            <motion.div className="absolute top-[55%] right-[55%] h-2 w-2 rounded-full bg-brand/10" animate={{ y: [0, -33, 0], opacity: [0.12, 0.44, 0.12] }} transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 3.1 }} />
            <motion.div className="absolute bottom-[12%] left-[35%] h-2.5 w-2.5 rounded-full bg-cyan-500/10" animate={{ y: [0, -41, 0], opacity: [0.16, 0.52, 0.16] }} transition={{ duration: 8.9, repeat: Infinity, ease: 'easeInOut', delay: 1.45 }} />
            <motion.div className="absolute top-[78%] left-[60%] h-2 w-2 rounded-full bg-violet-500/10" animate={{ y: [0, -30, 0], opacity: [0.11, 0.47, 0.11] }} transition={{ duration: 6.7, repeat: Infinity, ease: 'easeInOut', delay: 3.6 }} />
            <motion.div className="absolute top-[42%] right-[15%] h-3 w-3 rounded-full bg-brand/10" animate={{ y: [0, -39, 0], opacity: [0.17, 0.54, 0.17] }} transition={{ duration: 8.1, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
            <motion.div className="absolute top-[62%] left-[42%] h-2 w-2 rounded-full bg-cyan-500/10" animate={{ y: [0, -27, 0], opacity: [0.13, 0.46, 0.13] }} transition={{ duration: 6.3, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }} />
            <motion.div className="absolute bottom-[42%] left-[52%] h-2.5 w-2.5 rounded-full bg-violet-500/10" animate={{ y: [0, -35, 0], opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 7.6, repeat: Infinity, ease: 'easeInOut', delay: 0.85 }} />
            <motion.div className="absolute top-[25%] right-[65%] h-2 w-2 rounded-full bg-brand/10" animate={{ y: [0, -28, 0], opacity: [0.1, 0.42, 0.1] }} transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut', delay: 4.2 }} />
            <motion.div className="absolute top-[88%] left-[15%] h-3 w-3 rounded-full bg-cyan-500/10" animate={{ y: [0, -43, 0], opacity: [0.19, 0.58, 0.19] }} transition={{ duration: 9.1, repeat: Infinity, ease: 'easeInOut', delay: 1.75 }} />

            <div className="absolute -left-40 -top-40 h-[800px] w-[800px] rounded-full bg-brand/[0.03] blur-3xl" />
            <div className="absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-violet-500/[0.02] blur-3xl" />
            <div className="absolute left-1/4 top-1/3 h-48 w-48 rounded-full bg-brand/5 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/3 h-56 w-56 rounded-full bg-violet-500/5 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl" />
            <div className="absolute left-1/3 top-1/4 h-24 w-24 rounded-full bg-brand/5 blur-3xl" />
            <div className="absolute right-1/3 bottom-1/4 h-36 w-36 rounded-full bg-violet-500/5 blur-3xl" />
            <div className="absolute left-2/3 top-2/3 h-20 w-20 rounded-full bg-cyan-500/5 blur-3xl" />
            <motion.div
              className="absolute left-1/3 top-1/4 h-24 w-24 rounded-full bg-brand/5 blur-3xl"
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute right-1/3 bottom-1/4 h-36 w-36 rounded-full bg-violet-500/5 blur-3xl"
              animate={{ y: [0, 20, 0], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute left-2/3 top-2/3 h-20 w-20 rounded-full bg-cyan-500/5 blur-3xl"
              animate={{ x: [0, 15, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="absolute inset-0 opacity-[0.03]">
              <svg viewBox="0 0 800 600" className="h-full w-full">
                <motion.circle cx={200} cy={150} r={4} fill="#4f46e5" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 0 }} />
                <motion.circle cx={400} cy={100} r={4} fill="#7c3aed" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
                <motion.circle cx={600} cy={150} r={4} fill="#06b6d4" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
                <motion.circle cx={300} cy={300} r={4} fill="#4f46e5" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} />
                <motion.circle cx={500} cy={280} r={4} fill="#7c3aed" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }} />
                <motion.circle cx={400} cy={400} r={4} fill="#06b6d4" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 2.5 }} />
                <motion.circle cx={100} cy={250} r={3} fill="#4f46e5" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 4, repeat: Infinity, delay: 0.3 }} />
                <motion.circle cx={700} cy={250} r={3} fill="#7c3aed" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 4, repeat: Infinity, delay: 0.8 }} />
                <motion.circle cx={150} cy={400} r={3} fill="#06b6d4" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 4, repeat: Infinity, delay: 1.3 }} />
                <motion.circle cx={650} cy={400} r={3} fill="#4f46e5" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 4, repeat: Infinity, delay: 1.8 }} />
                <motion.circle cx={350} cy={200} r={2.5} fill="#06b6d4" animate={{ opacity: [0.15, 0.7, 0.15] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.6 }} />
                <motion.circle cx={450} cy={350} r={2.5} fill="#7c3aed" animate={{ opacity: [0.15, 0.7, 0.15] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1.1 }} />
                <motion.circle cx={250} cy={450} r={2.5} fill="#4f46e5" animate={{ opacity: [0.15, 0.7, 0.15] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1.6 }} />
                <motion.circle cx={550} cy={450} r={2.5} fill="#06b6d4" animate={{ opacity: [0.15, 0.7, 0.15] }} transition={{ duration: 3.5, repeat: Infinity, delay: 2.1 }} />
                <motion.circle cx={300} cy={120} r={2} fill="#7c3aed" animate={{ opacity: [0.1, 0.6, 0.1] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.2 }} />
                <motion.circle cx={500} cy={180} r={2} fill="#4f46e5" animate={{ opacity: [0.1, 0.6, 0.1] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.7 }} />
                <line x1={200} y1={150} x2={400} y2={100} stroke="#4f46e5" strokeWidth={0.5} opacity={0.3} />
                <line x1={400} y1={100} x2={600} y2={150} stroke="#7c3aed" strokeWidth={0.5} opacity={0.3} />
                <line x1={200} y1={150} x2={300} y2={300} stroke="#4f46e5" strokeWidth={0.5} opacity={0.3} />
                <line x1={600} y1={150} x2={500} y2={280} stroke="#06b6d4" strokeWidth={0.5} opacity={0.3} />
                <line x1={300} y1={300} x2={400} y2={400} stroke="#7c3aed" strokeWidth={0.5} opacity={0.3} />
                <line x1={500} y1={280} x2={400} y2={400} stroke="#4f46e5" strokeWidth={0.5} opacity={0.3} />
                <line x1={400} y1={100} x2={500} y2={280} stroke="#06b6d4" strokeWidth={0.5} opacity={0.3} />
                <line x1={200} y1={150} x2={100} y2={250} stroke="#4f46e5" strokeWidth={0.5} opacity={0.2} />
                <line x1={600} y1={150} x2={700} y2={250} stroke="#7c3aed" strokeWidth={0.5} opacity={0.2} />
                <line x1={300} y1={300} x2={150} y2={400} stroke="#06b6d4" strokeWidth={0.5} opacity={0.2} />
                <line x1={500} y1={280} x2={650} y2={400} stroke="#4f46e5" strokeWidth={0.5} opacity={0.2} />
                <line x1={400} y1={400} x2={650} y2={400} stroke="#7c3aed" strokeWidth={0.5} opacity={0.2} />
                <line x1={200} y1={150} x2={350} y2={200} stroke="#06b6d4" strokeWidth={0.3} opacity={0.15} />
                <line x1={600} y1={150} x2={500} y2={180} stroke="#4f46e5" strokeWidth={0.3} opacity={0.15} />
                <line x1={300} y1={300} x2={450} y2={350} stroke="#7c3aed" strokeWidth={0.3} opacity={0.15} />
                <line x1={500} y1={280} x2={550} y2={450} stroke="#06b6d4" strokeWidth={0.3} opacity={0.15} />
                <line x1={400} y1={400} x2={250} y2={450} stroke="#4f46e5" strokeWidth={0.3} opacity={0.15} />
                <line x1={400} y1={400} x2={550} y2={450} stroke="#7c3aed" strokeWidth={0.3} opacity={0.15} />
                <text x={190} y={170} fill="#4f46e5" fontSize={8} opacity={0.5}>Payment</text>
                <text x={390} y={90} fill="#7c3aed" fontSize={8} opacity={0.5}>Billing</text>
                <text x={590} y={170} fill="#06b6d4" fontSize={8} opacity={0.5}>Auth</text>
                <text x={285} y={320} fill="#4f46e5" fontSize={8} opacity={0.5}>Gateway</text>
                <text x={490} y={298} fill="#7c3aed" fontSize={8} opacity={0.5}>Cache</text>
                <text x={385} y={420} fill="#06b6d4" fontSize={8} opacity={0.5}>DB</text>
                <motion.circle cx={200} cy={150} r={2} fill="#4f46e5" animate={{ cx: [200, 400, 400, 200], cy: [150, 100, 100, 150] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={400} cy={100} r={2} fill="#7c3aed" animate={{ cx: [400, 600, 600, 400], cy: [100, 150, 150, 100] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={400} cy={100} r={2} fill="#06b6d4" animate={{ cx: [400, 500, 500, 400], cy: [100, 280, 280, 100] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={200} cy={150} r={2} fill="#4f46e5" animate={{ cx: [200, 300, 300, 200], cy: [150, 300, 300, 150] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={500} cy={280} r={2} fill="#7c3aed" animate={{ cx: [500, 400, 400, 500], cy: [280, 400, 400, 280] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={600} cy={150} r={2} fill="#06b6d4" animate={{ cx: [600, 700, 700, 600], cy: [150, 250, 250, 150] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={200} cy={150} r={2} fill="#4f46e5" animate={{ cx: [200, 100, 100, 200], cy: [150, 250, 250, 150] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={300} cy={300} r={2} fill="#7c3aed" animate={{ cx: [300, 150, 150, 300], cy: [300, 400, 400, 300] }} transition={{ duration: 7.5, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={500} cy={280} r={2} fill="#06b6d4" animate={{ cx: [500, 650, 650, 500], cy: [280, 400, 400, 280] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={400} cy={400} r={2} fill="#4f46e5" animate={{ cx: [400, 250, 250, 400], cy: [400, 450, 450, 400] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={400} cy={400} r={2} fill="#7c3aed" animate={{ cx: [400, 550, 550, 400], cy: [400, 450, 450, 400] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={350} cy={200} r={1.5} fill="#06b6d4" animate={{ cx: [350, 400, 400, 350], cy: [200, 100, 100, 200] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={450} cy={350} r={1.5} fill="#4f46e5" animate={{ cx: [450, 400, 400, 450], cy: [350, 400, 400, 350] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={350} cy={480} r={1.5} fill="#06b6d4" animate={{ cx: [350, 400, 400, 350], cy: [480, 400, 400, 480] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={480} cy={120} r={1.5} fill="#7c3aed" animate={{ cx: [480, 400, 400, 480], cy: [120, 100, 100, 120] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={250} cy={450} r={1.5} fill="#4f46e5" animate={{ cx: [250, 300, 300, 250], cy: [450, 300, 300, 450] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={550} cy={450} r={1.5} fill="#06b6d4" animate={{ cx: [550, 500, 500, 550], cy: [450, 280, 280, 450] }} transition={{ duration: 7.5, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={300} cy={120} r={1.5} fill="#7c3aed" animate={{ cx: [300, 200, 200, 300], cy: [120, 150, 150, 120] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={500} cy={180} r={1.5} fill="#4f46e5" animate={{ cx: [500, 400, 400, 500], cy: [180, 100, 100, 180] }} transition={{ duration: 7.2, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={250} cy={220} r={1.5} fill="#06b6d4" animate={{ cx: [250, 200, 200, 250], cy: [220, 150, 150, 220] }} transition={{ duration: 8.5, repeat: Infinity, ease: 'linear' }} />
                <line x1={350} y1={480} x2={250} y2={450} stroke="#4f46e5" strokeWidth={0.3} opacity={0.12} />
                <line x1={480} y1={120} x2={300} y2={120} stroke="#7c3aed" strokeWidth={0.3} opacity={0.12} />
                <line x1={500} y1={180} x2={480} y2={120} stroke="#06b6d4" strokeWidth={0.3} opacity={0.1} />
                <line x1={250} y1={220} x2={300} y2={120} stroke="#4f46e5" strokeWidth={0.3} opacity={0.1} />
              </svg>
            </div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
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
                AI-Powered Engineering Intelligence Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1]"
              >
                Predict. Prevent.{' '}
                <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">Deploy with confidence.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
              >
                Orbit Foresight analyzes your engineering systems in real-time — predicting incidents before they reach production,
                mapping blast radius automatically, and generating executive action plans.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand to-violet-500 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] overflow-hidden shadow-lg shadow-brand/25"
                >
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <svg className="h-4 w-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  ENTER COMMAND CENTER
                </button>
                <button
                  onClick={scrollToFeatures}
                  className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-slate-400 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white active:scale-[0.97]"
                >
                  Explore Features
                  <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-b border-white/[0.04] py-3 bg-slate-900/20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
              <span className="text-[9px] font-medium text-slate-600 uppercase tracking-wider">Trusted by engineering teams at</span>
              <span className="text-[10px] text-slate-500 font-semibold">Vercel</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">Stripe</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">Linear</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">Figma</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">Railway</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">Supabase</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">Cal.com</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">Netlify</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">PlanetScale</span>
              <span className="text-[9px] text-slate-700">|</span>
              <span className="text-[10px] text-slate-500 font-semibold">WorkOS</span>
            </div>
          </div>
        </motion.div>

        <div className="border-y border-white/[0.04] overflow-hidden bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 shrink-0 font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
              <div className="h-4 w-px bg-white/[0.06]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={feedIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-500 truncate"
                >
                  {statusMessages[feedIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="py-10 sm:py-12"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center mb-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Executive AI Briefing
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Engineering{' '}
                <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">Intelligence Overview</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">Real-time platform metrics powered by machine learning analysis across all engineering systems</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <motion.div
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-500 opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={847} suffix="" /></div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Engineering Systems Analyzed</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">Comprehensive analysis across all monitored services and infrastructure components</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-purple-500/10 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500 opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounterWithComma value={12400} suffix="+" /></div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Deployments Analyzed</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">Production and staging deployments evaluated for risk and failure patterns</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/20 to-red-500/10 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500 opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={184} suffix="" /></div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Incidents Processed</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">Historical incident records analyzed for root cause and pattern identification</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-green-500/10 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={124} suffix="" /></div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Production Failures Prevented</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">Incidents successfully predicted and mitigated before reaching end users</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500 opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={24} suffix="" /></div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Current High-Risk Services</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">Services exceeding acceptable risk thresholds requiring immediate attention</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/20 to-pink-500/10 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={3} suffix="" /></div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Predicted Critical Incidents</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">High-confidence incident predictions requiring immediate engineering review</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-brand/20 bg-gradient-to-br from-brand/20 to-violet-500/10 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={94} suffix="%" /></div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">AI Confidence</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">Machine learning model confidence score across all prediction models</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="group relative rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-teal-500/10 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-500 opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounterDecimal value={99.97} suffix="%" decimals={2} /></div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Platform Uptime</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">Enterprise-grade platform availability across all services and regions</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={fadeUp}
              className="mt-5 rounded-xl border border-white/[0.04] bg-slate-900/30 p-4 backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/[0.12]">
                    <svg className="h-4 w-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">AI Recommendation</div>
                    <div className="text-[10px] text-slate-500">Immediate review advised for 3 high-risk services across payment and auth infrastructure.</div>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Confidence</span>
                    <span>94%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '94%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-brand via-violet-400 to-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <SolutionSection />

        <section ref={featuresRef} className="border-t border-white/[0.04] py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="mx-auto max-w-2xl text-center mb-6"
            >
              <motion.div variants={fadeUp} className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Product Discovery Tour
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">ship safely</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-2 text-sm text-slate-500">
                Seven integrated modules powered by a unified AI intelligence engine
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <motion.div
                variants={fadeUpSmall}
                onClick={() => navigate('/dashboard')}
                className="group relative rounded-xl border border-brand/20 bg-gradient-to-br from-brand/20 to-violet-500/10 p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-brand/5 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-brand/[0.04] blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-violet-500/[0.04] blur-2xl" />
                </div>
                <div className="relative">
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.10] group-hover:text-white transition-all duration-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  </div>
                  <h3 className="mb-0.5 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">Executive Dashboard</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 mb-2">Real-time command center for engineering operations</p>
                  <p className="text-[9px] leading-relaxed text-slate-600 mb-2.5">Centralized visibility into service health, risk metrics, and team performance across your entire engineering organization.</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">12 services</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">94% health</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">4 active alerts</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">87% risk score</span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                onClick={() => navigate('/intelligence')}
                className="group relative rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-cyan-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-cyan-500/[0.04] blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-blue-500/[0.04] blur-2xl" />
                </div>
                <div className="relative">
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.10] group-hover:text-white transition-all duration-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v2.25m0 0V9m0-3.75h2.25M9.75 3.75h-2.25m0 0A2.25 2.25 0 005.25 6v.75m0 0A2.25 2.25 0 003 9v6.75A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75V9a2.25 2.25 0 00-2.25-2.25h-.75m0 0V6a2.25 2.25 0 00-2.25-2.25h-2.25m2.25 0V3.75" />
                    </svg>
                  </div>
                  <h3 className="mb-0.5 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">AI Intelligence Center</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 mb-2">Forensic investigation of production incidents</p>
                  <p className="text-[9px] leading-relaxed text-slate-600 mb-2.5">Deep-dive analysis tools for root cause investigation, incident correlation, and pattern recognition across your engineering stack.</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">15 sections</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">94% confidence</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">847 cases</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">8 root causes</span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                onClick={() => navigate('/time-machine')}
                className="group relative rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-amber-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-amber-500/[0.04] blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-orange-500/[0.04] blur-2xl" />
                </div>
                <div className="relative">
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.10] group-hover:text-white transition-all duration-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mb-0.5 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">Incident Time Machine</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 mb-2">Historical failure analysis and timeline replay</p>
                  <p className="text-[9px] leading-relaxed text-slate-600 mb-2.5">Rewind and replay production incidents to understand failure chains, blast radius, and service dependencies at the moment of impact.</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">1,598 events</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">12 patterns</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">94% accuracy</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">45min MTTR</span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                onClick={() => navigate('/ai-planner')}
                className="group relative rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-green-500/10 p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-emerald-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-emerald-500/[0.04] blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-green-500/[0.04] blur-2xl" />
                </div>
                <div className="relative">
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.10] group-hover:text-white transition-all duration-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </div>
                  <h3 className="mb-0.5 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">Engineering Planner</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 mb-2">AI-generated delivery strategy and sprint planning</p>
                  <p className="text-[9px] leading-relaxed text-slate-600 mb-2.5">Automated sprint planning with risk-aware task allocation, dependency mapping, and delivery timeline optimization.</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">87% success</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">34 story points</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">4 teams</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">3 sprints</span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                onClick={() => navigate('/execution-planner')}
                className="group relative rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/20 to-pink-500/10 p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-rose-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-rose-500/[0.04] blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-pink-500/[0.04] blur-2xl" />
                </div>
                <div className="relative">
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.10] group-hover:text-white transition-all duration-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                  </div>
                  <h3 className="mb-0.5 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">Mission Control</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 mb-2">Kanban-driven execution tracking</p>
                  <p className="text-[9px] leading-relaxed text-slate-600 mb-2.5">Real-time execution tracking with automated status updates, blocker detection, and cross-team dependency management.</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">12 sprints</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">8 team members</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">92% readiness</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">5 milestones</span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                onClick={() => navigate('/knowledge-graph')}
                className="group relative rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-purple-500/10 p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-violet-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-violet-500/[0.04] blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-purple-500/[0.04] blur-2xl" />
                </div>
                <div className="relative">
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.10] group-hover:text-white transition-all duration-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 10.5a6 6 0 01-6 6m0 0a6 6 0 01-6-6m6 6v-7.5m0 0a6 6 0 016-6m-6 6a6 6 0 00-6-6m6 6h7.5m-7.5 0h-7.5" />
                    </svg>
                  </div>
                  <h3 className="mb-0.5 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">Knowledge Graph</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 mb-2">Interactive service dependency topology</p>
                  <p className="text-[9px] leading-relaxed text-slate-600 mb-2.5">Visual map of all service dependencies with real-time risk propagation, blast radius analysis, and impact scoring.</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">174 nodes</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">846 edges</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">12 services</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">94% accuracy</span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                onClick={() => navigate('/cto-report')}
                className="group relative rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/20 to-indigo-500/10 p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-sky-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-sky-500/[0.04] blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-indigo-500/[0.04] blur-2xl" />
                </div>
                <div className="relative">
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.10] group-hover:text-white transition-all duration-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                  </div>
                  <h3 className="mb-0.5 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">AI CTO Reports</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 mb-2">Executive decision intelligence with ROI projection</p>
                  <p className="text-[9px] leading-relaxed text-slate-600 mb-2.5">Automated executive summaries with financial impact analysis, team performance metrics, and strategic recommendations.</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">320% ROI</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">$288K savings</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">87% confidence</span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">4 teams</span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="border-t border-white/[0.04] py-10 sm:py-12"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center mb-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Platform Architecture
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Enterprise{' '}
                <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">Tech Stack</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">Modern microservices architecture built for scale and reliability</p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-slate-900/30 p-5 sm:p-6 backdrop-blur-xl">
              <div className="grid gap-5 sm:grid-cols-5 items-center">
                {archLayers.map((a, i) => (
                  <div key={a.layer} className="flex flex-col items-center text-center group">
                    <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ${a.color} transition-all duration-300 group-hover:scale-110 group-hover:bg-white/[0.08]`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-white">{a.layer}</div>
                    <div className={`text-[9px] ${a.color} mt-0.5`}>{a.components}</div>
                    {i < 4 && (
                      <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="hidden sm:block text-slate-700 text-lg mt-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.04] text-center">
                <span className="text-[10px] text-slate-700">Tech Stack: React 18 · TailwindCSS · Framer Motion · FastAPI · PostgreSQL · Redis · Docker · Kubernetes</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="border-t border-white/[0.04] py-10 sm:py-12"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center mb-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Platform Integrations
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Connect your{' '}
                <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">entire stack</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">Seamless integration with your existing tools and infrastructure</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <motion.div variants={fadeUpSmall} className="group rounded-xl border border-white/[0.06] bg-slate-900/30 p-4 text-center hover:border-white/[0.12] transition-all duration-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/[0.1] text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
                  </svg>
                </div>
                <div className="text-[11px] font-semibold text-white">GitLab</div>
                <div className="text-[8px] text-slate-600 mt-0.5">CI/CD & Repos</div>
              </motion.div>

              <motion.div variants={fadeUpSmall} className="group rounded-xl border border-white/[0.06] bg-slate-900/30 p-4 text-center hover:border-white/[0.12] transition-all duration-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/[0.1] text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                </div>
                <div className="text-[11px] font-semibold text-white">Datadog</div>
                <div className="text-[8px] text-slate-600 mt-0.5">Monitoring</div>
              </motion.div>

              <motion.div variants={fadeUpSmall} className="group rounded-xl border border-white/[0.06] bg-slate-900/30 p-4 text-center hover:border-white/[0.12] transition-all duration-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/[0.1] text-violet-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
                  </svg>
                </div>
                <div className="text-[11px] font-semibold text-white">Slack</div>
                <div className="text-[8px] text-slate-600 mt-0.5">Notifications</div>
              </motion.div>

              <motion.div variants={fadeUpSmall} className="group rounded-xl border border-white/[0.06] bg-slate-900/30 p-4 text-center hover:border-white/[0.12] transition-all duration-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/[0.1] text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                </div>
                <div className="text-[11px] font-semibold text-white">PagerDuty</div>
                <div className="text-[8px] text-slate-600 mt-0.5">Incident Mgmt</div>
              </motion.div>

              <motion.div variants={fadeUpSmall} className="group rounded-xl border border-white/[0.06] bg-slate-900/30 p-4 text-center hover:border-white/[0.12] transition-all duration-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/[0.1] text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                  </svg>
                </div>
                <div className="text-[11px] font-semibold text-white">AWS</div>
                <div className="text-[8px] text-slate-600 mt-0.5">Cloud Infrastructure</div>
              </motion.div>

              <motion.div variants={fadeUpSmall} className="group rounded-xl border border-white/[0.06] bg-slate-900/30 p-4 text-center hover:border-white/[0.12] transition-all duration-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/[0.1] text-rose-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="text-[11px] font-semibold text-white">Sentry</div>
                <div className="text-[8px] text-slate-600 mt-0.5">Error Tracking</div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="border-t border-white/[0.04] py-10 sm:py-12"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center mb-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Live Status Wall
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Enterprise{' '}
                <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">Operations Dashboard</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">Real-time platform health and performance metrics across all engineering systems</p>
            </motion.div>

            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
            >
              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-rose-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Risk Score</div>
                    <div className="text-[9px] font-semibold text-rose-400">HIGH</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={72} suffix="%" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                    </svg>
                    <span className="text-[9px] font-medium text-rose-500">8% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">Overall platform risk assessment</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-emerald-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Deployment Health</div>
                    <div className="text-[9px] font-semibold text-emerald-400">SUCCESS</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={89} suffix="%" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <span className="text-[9px] font-medium text-emerald-500">5% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">Deployment success rate</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-emerald-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">System Stability</div>
                    <div className="text-[9px] font-semibold text-emerald-400">SUCCESS</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={94} suffix="%" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <span className="text-[9px] font-medium text-emerald-500">2% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">Platform stability index</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-blue-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Engineering Velocity</div>
                    <div className="text-[9px] font-semibold text-blue-400">INFO</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={85} suffix="%" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <span className="text-[9px] font-medium text-emerald-500">12% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">Team delivery velocity</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-green-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Incident Volume</div>
                    <div className="text-[9px] font-semibold text-green-400">LOW</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={5} suffix="" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <span className="text-[9px] font-medium text-emerald-500">18% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">Incidents this week</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-emerald-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Prediction Accuracy</div>
                    <div className="text-[9px] font-semibold text-emerald-400">SUCCESS</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={94} suffix="%" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <span className="text-[9px] font-medium text-emerald-500">3% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">ML model confidence</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-amber-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Recovery Readiness</div>
                    <div className="text-[9px] font-semibold text-amber-400">WARNING</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={78} suffix="%" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <span className="text-[9px] font-medium text-emerald-500">15% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">MTTR improvement</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-amber-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">MTTR</div>
                    <div className="text-[9px] font-semibold text-amber-400">WARNING</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={45} suffix="min" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                    </svg>
                    <span className="text-[9px] font-medium text-rose-500">22% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">Mean time to repair</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-emerald-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Change Failure Rate</div>
                    <div className="text-[9px] font-semibold text-emerald-400">SUCCESS</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounterDecimal value={5.8} suffix="%" decimals={1} /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                    </svg>
                    <span className="text-[9px] font-medium text-rose-500">32% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">Deployment failure rate</div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpSmall}
                className="relative rounded-xl border border-blue-500/30 bg-slate-900/40 p-4 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500/40" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Operational Readiness</div>
                    <div className="text-[9px] font-semibold text-blue-400">INFO</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter value={82} suffix="%" /></div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <span className="text-[9px] font-medium text-emerald-500">7% this week</span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 leading-tight">Overall ops health</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="border-t border-white/[0.04] py-10 sm:py-12"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center mb-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
                Enterprise Security & Compliance
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Built for{' '}
                <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">enterprise trust</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">Industry-standard security certifications and compliance frameworks</p>
            </motion.div>

            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <motion.div variants={fadeUpSmall} className={`group relative rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-transparent p-5 overflow-hidden`}>
                <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-2xl group-hover:bg-emerald-500/[0.06] transition-all duration-500" />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/[0.08] text-emerald-500 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">SOC 2 Type II Certified</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Enterprise-grade security controls and annual audits ensuring data protection and compliance for all customers.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUpSmall} className={`group relative rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.04] to-transparent p-5 overflow-hidden`}>
                <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-cyan-500/[0.03] blur-2xl group-hover:bg-cyan-500/[0.06] transition-all duration-500" />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/[0.08] text-cyan-500 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">GDPR Compliant</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Full compliance with European data protection regulations for global engineering teams and international operations.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUpSmall} className={`group relative rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.04] to-transparent p-5 overflow-hidden`}>
                <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet-500/[0.03] blur-2xl group-hover:bg-violet-500/[0.06] transition-all duration-500" />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/[0.08] text-violet-500 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Encryption at Rest & Transit</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">AES-256 encryption for stored data and TLS 1.3 for all data in transit between services and clients.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUpSmall} className={`group relative rounded-xl border border-brand/20 bg-gradient-to-br from-brand/[0.04] to-transparent p-5 overflow-hidden`}>
                <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-brand/[0.03] blur-2xl group-hover:bg-brand/[0.06] transition-all duration-500" />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/[0.08] text-brand-light mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">99.99% SLA Guarantee</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Enterprise service level agreement with guaranteed uptime, 24/7 support, and dedicated engineering coverage.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="border-t border-white/[0.04] py-10 sm:py-12"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              className="relative rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.08] to-violet-500/[0.05] p-6 sm:p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-brand/[0.04] blur-3xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet-500/[0.03] blur-3xl"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 h-40 w-40 rounded-full bg-cyan-500/[0.03] blur-3xl"
                  animate={{ rotate: 180 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/20"
                >
                  <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                  </svg>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Orbit Foresight predicts failures before production.
                </h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                    </svg>
                    <span className="text-[10px] text-emerald-500 font-semibold">94% Accuracy</span>
                  </div>
                  <div className="h-3 w-px bg-white/[0.06]" />
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] text-cyan-500 font-semibold">45min MTTR</span>
                  </div>
                  <div className="h-3 w-px bg-white/[0.06]" />
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    <span className="text-[10px] text-violet-500 font-semibold">320% ROI</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 max-w-lg mx-auto mb-6">
                  Identifies root causes instantly. Maps blast radius automatically. Generates engineering action plans.
                  Transforms engineering operations into executive intelligence.
                </p>
                <div className="space-y-2 mb-6 max-w-sm mx-auto text-left">
                  <div className="flex items-start gap-2.5">
                    <svg className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-slate-400">Real-time risk prediction across all services with 94% accuracy</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-slate-400">Automatic blast radius mapping for every detected incident</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-slate-400">Executive action plans with ROI projections and timeline estimates</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-slate-400">Zero-configuration integration with existing CI/CD workflows</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-slate-400">Team collaboration tools for cross-functional incident response</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-slate-400">Historical trend analysis with pattern recognition and anomaly detection</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand to-violet-500 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] shadow-lg shadow-brand/25"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  ENTER COMMAND CENTER
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="mb-3">
                <OrbitLogo size="sm" />
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed">AI-powered engineering intelligence platform that predicts incidents before they reach production. Built for GitLab Orbit ecosystem.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2.5">Product</h4>
              <ul className="space-y-1.5">
                <li><button onClick={() => navigate('/dashboard')} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Dashboard</button></li>
                <li><button onClick={() => navigate('/intelligence')} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Intelligence</button></li>
                <li><button onClick={() => navigate('/time-machine')} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Time Machine</button></li>
                <li><button onClick={() => navigate('/knowledge-graph')} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Knowledge Graph</button></li>
                <li><button onClick={() => navigate('/cto-report')} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">CTO Reports</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2.5">Company</h4>
              <ul className="space-y-1.5">
                <li><span className="text-[10px] text-slate-600">About</span></li>
                <li><span className="text-[10px] text-slate-600">Careers</span></li>
                <li><span className="text-[10px] text-slate-600">Security</span></li>
                <li><span className="text-[10px] text-slate-600">Privacy</span></li>
                <li><span className="text-[10px] text-slate-600">Terms</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2.5">Resources</h4>
              <ul className="space-y-1.5">
                <li><span className="text-[10px] text-slate-600">Documentation</span></li>
                <li><span className="text-[10px] text-slate-600">API Reference</span></li>
                <li><span className="text-[10px] text-slate-600">Status Page</span></li>
                <li><span className="text-[10px] text-slate-600">Changelog</span></li>
                <li><span className="text-[10px] text-slate-600">Support</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/[0.04] flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4 text-[10px] text-slate-700">
              <span>AI-Powered Engineering Intelligence Platform</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Built for GitLab Orbit</span>
              <span className="hidden sm:inline">·</span>
              <span>&copy; 2026 Orbit Foresight Inc.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
