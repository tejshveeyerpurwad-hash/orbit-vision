import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'

const incidentTrends = [
  { month: 'Jan', incidents: 12, prevented: 8 },
  { month: 'Feb', incidents: 9, prevented: 11 },
  { month: 'Mar', incidents: 15, prevented: 7 },
  { month: 'Apr', incidents: 7, prevented: 14 },
  { month: 'May', incidents: 10, prevented: 12 },
  { month: 'Jun', incidents: 5, prevented: 16 },
  { month: 'Jul', incidents: 8, prevented: 13 },
]

const deploymentData = [
  { name: 'Payments', success: 92, failed: 8 },
  { name: 'Billing', success: 85, failed: 15 },
  { name: 'Auth', success: 98, failed: 2 },
  { name: 'Notifications', success: 78, failed: 22 },
  { name: 'API Gateway', success: 95, failed: 5 },
  { name: 'Webhooks', success: 88, failed: 12 },
]

const riskData = [
  { name: 'Low Risk', value: 45, color: '#22c55e' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b' },
  { name: 'High Risk', value: 18, color: '#ef4444' },
  { name: 'Critical', value: 7, color: '#dc2626' },
]

const teamData = [
  { name: 'Payments', commits: 142, incidents: 4, velocity: 85 },
  { name: 'Billing', commits: 98, incidents: 2, velocity: 72 },
  { name: 'Auth', commits: 76, incidents: 0, velocity: 91 },
  { name: 'Notifications', commits: 54, incidents: 1, velocity: 64 },
  { name: 'Platform', commits: 112, incidents: 3, velocity: 78 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-white/[0.06] bg-slate-900/90 p-3 text-xs shadow-xl backdrop-blur-xl">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-slate-200" style={{ color: p.color || '#e2e8f0' }}>
          {p.name}: {p.value}{p.name === 'value' ? '%' : ''}
        </p>
      ))}
    </div>
  )
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-[10px] text-slate-600 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function Analytics() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Platform-wide metrics and performance insights</p>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Incidents" value="66" trend="↓ 12% this quarter" color="text-red-400" />
          <StatCard label="Incidents Prevented" value="81" trend="↑ 24% this quarter" color="text-green-400" />
          <StatCard label="Avg Response Time" value="4.2m" trend="↓ 18%" color="text-brand-light" />
          <StatCard label="Deployment Success" value="89.3%" trend="↑ 5.2%" color="text-green-400" />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Incident Trends" subtitle="Actual incidents vs prevented over time" delay={0.1}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incidentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Incidents" />
                <Line type="monotone" dataKey="prevented" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} name="Prevented" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Deployment Success Rate" subtitle="By service for the current period" delay={0.15}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deploymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="success" fill="#22c55e" radius={[3, 3, 0, 0]} name="Success" />
                <Bar dataKey="failed" fill="#ef4444" radius={[3, 3, 0, 0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Risk Distribution" subtitle="Across all analyzed services" delay={0.2}>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {riskData.map((r) => (
                  <div key={r.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-[10px] text-slate-500">{r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Team Impact" subtitle="Velocity and commits by team" delay={0.25}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="velocity" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} name="Velocity" />
                <Area type="monotone" dataKey="commits" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} name="Commits" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </motion.div>
    </Layout>
  )
}
