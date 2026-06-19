import { useState, useEffect } from 'react'

export default function Gauge({ value, label, sub, color, delay = 300, size = 36, format = '%', subtitle }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setPct(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  const circumference = Math.PI * (size - 8)
  const strokeDashoffset = circumference - (pct / 100) * circumference

  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">{label}</span>
        {sub && <span className="text-[10px] text-slate-600">{sub}</span>}
      </div>
      <div className="flex flex-col items-center py-2">
        <svg className={`w-${size} h-${size} -rotate-90`} viewBox={`0 0 ${size + 8} ${size + 8}`}>
          <circle cx={(size + 8) / 2} cy={(size + 8) / 2} r={size / 2} fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle
            cx={(size + 8) / 2}
            cy={(size + 8) / 2}
            r={size / 2}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="relative -mt-[72px]">
          <span className="text-3xl font-bold text-white">{pct}{format}</span>
        </div>
        {subtitle && <span className="text-[10px] text-slate-500 mt-1">{subtitle}</span>}
      </div>
    </div>
  )
}
