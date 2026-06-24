import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDemo } from './DemoContext'

export default function JudgeTour() {
  const { tourActive, tourStep, tourSteps, nextTourStep, prevTourStep, endTour, TOUR_PAGES } = useDemo()
  const step = tourSteps[tourStep]
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!tourActive) return
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextTourStep() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevTourStep() }
      else if (e.key === 'Escape') { e.preventDefault(); endTour() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [tourActive, nextTourStep, prevTourStep, endTour])

  if (!tourActive || !step) return null

  const isFirst = tourStep === 0
  const isLast = tourStep === TOUR_PAGES.length - 1

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto" onClick={endTour} />
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative pointer-events-auto mx-4 mb-4 sm:mb-0 w-full max-w-2xl rounded-2xl border border-white/[0.10] bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/[0.04] blur-3xl" />

          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
              <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">👑 Orbit Judge Tour</span>
                <span className="rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 text-[8px] font-mono font-bold">
                  {tourStep + 1} / {TOUR_PAGES.length}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono mt-0.5">Arrow keys to navigate · Esc to exit</p>
            </div>
            <div className="flex items-center gap-1">
              {TOUR_PAGES.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === tourStep ? 'w-5 bg-cyan-400' : i < tourStep ? 'w-1.5 bg-emerald-500/50' : 'w-1.5 bg-slate-700'}`} />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400/80 uppercase tracking-wider">
                Chapter {step.title ? tourStep + 1 : ''}
              </span>
              <span className="h-3 w-px bg-white/[0.06]" />
              <span className="text-[10px] font-mono text-slate-500">{step.title}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {step.desc}
            </p>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider">Judge Insight</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">{step.detail}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-white/[0.06] bg-white/[0.01]">
            <button onClick={endTour} className="text-[9px] font-mono text-slate-600 hover:text-slate-400 transition-colors px-2 py-1">
              Skip Tour
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={prevTourStep}
                disabled={isFirst}
                className="flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-1.5 text-[10px] font-medium text-slate-400 hover:text-white hover:border-white/[0.15] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>
              <button
                onClick={nextTourStep}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-[10px] font-bold text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isLast ? 'Complete Tour' : 'Next'}
                {!isLast && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
