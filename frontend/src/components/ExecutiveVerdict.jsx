import { motion, AnimatePresence } from 'framer-motion'
import { useDemo } from './DemoContext'

const verdictColors = {
  red: { border: 'border-red-500/30', bg: 'bg-red-500/[0.06]', text: 'text-red-300', icon: 'text-red-400', badge: 'bg-red-500/15 text-red-400 border-red-500/20', bar: 'bg-red-500', pulse: 'bg-red-400' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/[0.06]', text: 'text-amber-300', icon: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20', bar: 'bg-amber-500', pulse: 'bg-amber-400' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/[0.06]', text: 'text-emerald-300', icon: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', bar: 'bg-emerald-500', pulse: 'bg-emerald-400' },
}

export default function ExecutiveVerdict() {
  const { scenario, currentScenario } = useDemo()

  if (!scenario || !currentScenario) return null

  const vc = verdictColors[currentScenario.verdictColor] || verdictColors.emerald

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.9 }}
        className={`flex items-center gap-2 rounded-xl border ${vc.border} ${vc.bg} px-3 py-1.5 sm:px-4 sm:py-2`}
      >
        <div className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${vc.pulse} opacity-75`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${vc.pulse}`} />
        </div>
        <div className="flex flex-col">
          <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${vc.text} opacity-70`}>Executive Verdict</span>
          <span className={`text-[11px] sm:text-xs font-extrabold ${vc.text} leading-tight`}>{currentScenario.verdict}</span>
        </div>
        <div className={`flex items-center gap-1 rounded-md border ${vc.badge} px-1.5 py-0.5 ml-1`}>
          <span className="text-[8px] font-mono font-bold">{currentScenario.confidence}%</span>
          <span className="text-[6px] opacity-60">conf</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
