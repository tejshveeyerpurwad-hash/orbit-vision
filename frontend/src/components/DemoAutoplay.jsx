import { motion } from 'framer-motion'
import { useDemo } from './DemoContext'

export default function DemoAutoplay() {
  const { demoAutoplay, startAutoplay, stopAutoplay, tourActive, TOUR_PAGES } = useDemo()

  return (
    <motion.button
      onClick={demoAutoplay ? stopAutoplay : startAutoplay}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      disabled={tourActive}
      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9px] sm:text-[10px] font-semibold transition-all ${
        demoAutoplay
          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-sm shadow-cyan-500/20'
          : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-300 hover:border-white/[0.12]'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <svg className={`h-3 w-3 ${demoAutoplay ? 'text-cyan-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {demoAutoplay ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        )}
      </svg>
      <span>{demoAutoplay ? `Auto Demo • ${TOUR_PAGES.length} pages` : 'Auto Demo'}</span>
    </motion.button>
  )
}
