import { motion } from 'framer-motion'

export default function StatCard({ label, value, trend, color, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">{label}</span>
        {icon && <span className="text-slate-600">{icon}</span>}
      </div>
      <div className={`text-2xl font-bold mt-1.5 ${color || 'text-white'}`}>{value}</div>
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-[10px] font-medium ${trend.startsWith('↑') ? 'text-green-500' : trend.startsWith('↓') ? 'text-red-500' : 'text-slate-500'}`}>
            {trend}
          </span>
          <span className="text-[10px] text-slate-700">vs last period</span>
        </div>
      )}
    </motion.div>
  )
}
