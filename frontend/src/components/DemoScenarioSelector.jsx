import { motion } from 'framer-motion'
import { useDemo } from './DemoContext'

export default function DemoScenarioSelector() {
  const { scenario, selectScenario, clearScenario, SCENARIOS } = useDemo()

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
      {Object.entries(SCENARIOS).map(([key, s]) => {
        const active = scenario === key
        const colorMap = { critical: 'red', medium: 'amber', healthy: 'emerald' }
        const c = colorMap[key]
        return (
          <motion.button
            key={key}
            onClick={() => selectScenario(active ? null : key)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9px] sm:text-[10px] font-semibold transition-all ${
              active
                ? `border-${c}-500/40 bg-${c}-500/10 text-${c}-300 shadow-sm shadow-${c}-500/20`
                : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-300 hover:border-white/[0.12]'
            }`}
          >
            <span className="text-xs">{s.emoji}</span>
            <span className="hidden sm:inline">{s.label}</span>
            <span className="sm:hidden">{s.label.split(' ')[0]}</span>
            {active && (
              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </motion.button>
        )
      })}
      {scenario && (
        <button onClick={clearScenario} className="text-[8px] font-mono text-slate-600 hover:text-slate-400 transition-colors px-1">
          Reset
        </button>
      )}
    </div>
  )
}
