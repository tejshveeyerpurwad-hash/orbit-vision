import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const actions = [
  { page: '/intelligence', label: 'Investigate', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: 'from-purple-500 to-violet-600', hoverColor: 'hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300' },
  { page: '/time-machine', label: 'Timeline', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-amber-500 to-orange-600', hoverColor: 'hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300' },
  { page: '/knowledge-graph', label: 'Map', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: 'from-emerald-500 to-green-600', hoverColor: 'hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300' },
  { page: '/cto-report', label: 'Report', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', color: 'from-violet-500 to-purple-600', hoverColor: 'hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-300' },
  { page: '/execution-planner', label: 'Execute', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z', color: 'from-rose-500 to-pink-600', hoverColor: 'hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300' },
]

export default function QuickActionBar({ currentPage }) {
  const navigate = useNavigate()

  return (
    <div className="hidden xl:flex fixed right-3 top-1/2 -translate-y-1/2 z-30 flex-col gap-1">
      {actions.map((a) => {
        const isActive = currentPage === a.page || (a.page !== '/' && currentPage.startsWith(a.page))
        return (
          <motion.button
            key={a.page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(a.page)}
            className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[8px] font-medium transition-all ${
              isActive
                ? `border-white/[0.08] bg-white/[0.04] text-slate-300`
                : `border-transparent text-slate-700 ${a.hoverColor}`
            }`}
            title={a.label}
          >
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
            </svg>
            <span className={isActive ? 'text-[7px]' : 'text-[7px]'}>{a.label}</span>
            {isActive && <div className="w-0.5 h-3 rounded-full bg-cyan-400 ml-0.5" />}
          </motion.button>
        )
      })}
    </div>
  )
}
