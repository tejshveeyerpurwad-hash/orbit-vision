import { useCallback, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from 'reactflow'
import 'reactflow/dist/style.css'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'

const initialNodes = [
  { id: 'gateway', position: { x: 400, y: 0 }, data: { label: 'API Gateway', type: 'API', risk: 'medium', team: 'Platform', deps: ['Payments', 'Auth', 'Billing'] } },
  { id: 'auth', position: { x: 100, y: 150 }, data: { label: 'Auth Service', type: 'Service', risk: 'low', team: 'Security', deps: [] } },
  { id: 'payments', position: { x: 350, y: 150 }, data: { label: 'Payment Service', type: 'Service', risk: 'high', team: 'Payments', deps: ['Auth', 'Database'] } },
  { id: 'billing', position: { x: 600, y: 150 }, data: { label: 'Billing Service', type: 'Service', risk: 'medium', team: 'Billing', deps: ['Auth', 'Cache'] } },
  { id: 'notifications', position: { x: 0, y: 320 }, data: { label: 'Notification Service', type: 'Service', risk: 'low', team: 'Platform', deps: ['Auth'] } },
  { id: 'webhooks', position: { x: 200, y: 320 }, data: { label: 'Webhook Service', type: 'Service', risk: 'medium', team: 'Platform', deps: ['Payments'] } },
  { id: 'cache', position: { x: 500, y: 320 }, data: { label: 'Redis Cache', type: 'Database', risk: 'low', team: 'Infra', deps: [] } },
  { id: 'db', position: { x: 700, y: 320 }, data: { label: 'PostgreSQL', type: 'Database', risk: 'low', team: 'Infra', deps: [] } },
  { id: 'ci-pipeline', position: { x: 350, y: 470 }, data: { label: 'CI Pipeline', type: 'Pipeline', risk: 'low', team: 'DevOps', deps: ['Gateway'] } },
  { id: 'cd-pipeline', position: { x: 550, y: 470 }, data: { label: 'CD Pipeline', type: 'Pipeline', risk: 'low', team: 'DevOps', deps: ['CI Pipeline'] } },
]

const initialEdges = [
  { id: 'e-gw-auth', source: 'gateway', target: 'auth', animated: true, style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-gw-pay', source: 'gateway', target: 'payments', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-gw-bill', source: 'gateway', target: 'billing', animated: true, style: { stroke: '#f59e0b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
  { id: 'e-auth-notif', source: 'auth', target: 'notifications', style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-pay-webhook', source: 'payments', target: 'webhooks', style: { stroke: '#f59e0b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
  { id: 'e-pay-bill', source: 'payments', target: 'billing', style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-bill-cache', source: 'billing', target: 'cache', style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-pay-db', source: 'payments', target: 'db', style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-ci-cd', source: 'ci-pipeline', target: 'cd-pipeline', style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-gw-ci', source: 'gateway', target: 'ci-pipeline', style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
]

const riskColors = {
  high: { bg: 'rgba(239,68,68,0.18)', border: '#ef4444', text: '#fca5a5', glow: '0 0 20px rgba(239,68,68,0.3)' },
  medium: { bg: 'rgba(245,158,11,0.18)', border: '#f59e0b', text: '#fcd34d', glow: '0 0 15px rgba(245,158,11,0.2)' },
  low: { bg: 'rgba(34,197,94,0.12)', border: '#22c55e', text: '#86efac', glow: '0 0 10px rgba(34,197,94,0.15)' },
}

const typeIcons = {
  Service: '⚙️',
  API: '🔌',
  Database: '🗄️',
  Pipeline: '🔄',
}

function CustomNode({ data }) {
  const c = riskColors[data.risk] || riskColors.low
  return (
    <div
      className="rounded-xl border-2 px-4 py-3 text-center shadow-lg backdrop-blur-xl min-w-[130px] cursor-pointer hover:scale-105 transition-transform duration-200"
      style={{ backgroundColor: c.bg, borderColor: c.border, boxShadow: c.glow }}
      title={`${data.label} (${data.risk} risk) - Team: ${data.team}`}
    >
      <div className="text-xs mb-1">{typeIcons[data.type] || '📦'}</div>
      <div className="text-xs font-semibold" style={{ color: c.text }}>{data.label}</div>
      <div className="text-[8px] text-slate-500 mt-0.5">{data.type} · {data.team}</div>
    </div>
  )
}

const nodeTypes = { custom: CustomNode }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function KnowledgeGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes.map(n => ({ ...n, type: 'custom' })))
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState(null)
  const [search, setSearch] = useState('')
  const [blastMode, setBlastMode] = useState(false)

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const filteredNodes = useMemo(() => {
    if (!search) return nodes
    const q = search.toLowerCase()
    return nodes.filter(n => n.data.label.toLowerCase().includes(q) || n.data.team.toLowerCase().includes(q) || n.data.type.toLowerCase().includes(q))
  }, [nodes, search])

  const blastNodes = useMemo(() => {
    if (!blastMode || !selectedNode) return nodes
    return nodes.map(n => {
      const isBlast = n.id === selectedNode.id || selectedNode.data.deps?.includes(n.data.label) || edges.some(e => e.source === selectedNode.id && e.target === n.id)
      return { ...n, data: { ...n.data, risk: n.id === selectedNode.id ? n.data.risk : isBlast ? 'medium' : 'low' } }
    })
  }, [nodes, selectedNode, blastMode, edges])

  const displayNodes = blastMode ? blastNodes : (search ? filteredNodes : nodes)

  const highCount = nodes.filter(n => n.data.risk === 'high').length
  const mediumCount = nodes.filter(n => n.data.risk === 'medium').length

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Knowledge Graph</h1>
            <p className="mt-1 text-sm text-slate-500">Interactive service topology with risk propagation visualization</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBlastMode(!blastMode)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${blastMode ? 'bg-brand/[0.12] border-brand/30 text-brand-light' : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12]'}`}
            >
              {blastMode ? 'Exit Blast Radius' : 'Blast Radius'}
            </button>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-4">
          <StatCard label="Total Services" value="10" color="text-brand-light" />
          <StatCard label="High Risk" value={String(highCount)} color="text-red-400" />
          <StatCard label="Medium Risk" value={String(mediumCount)} color="text-yellow-400" />
          <StatCard label="Dependencies" value="12" color="text-slate-300" />
        </motion.div>

        {/* Search */}
        <motion.div variants={item} className="relative max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search nodes by name, team, or type..."
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-brand/30 focus:bg-white/[0.06] transition-all"
          />
        </motion.div>

        <motion.div variants={item} className="h-[550px] rounded-xl border border-white/[0.06] overflow-hidden">
          <ReactFlow
            nodes={displayNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-950"
          >
            <Background color="#1e293b" gap={24} />
            <Controls className="bg-slate-900 border border-white/[0.06] rounded-lg [&>button]:border-white/[0.06] [&>button]:text-slate-400" />
            <MiniMap
              nodeColor={(n) => riskColors[n.data?.risk]?.border || '#475569'}
              maskColor="rgba(10,15,29,0.85)"
              className="border border-white/[0.06] rounded-lg"
            />
          </ReactFlow>
        </motion.div>

        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-brand/20 bg-brand/[0.04] p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-brand-light mb-1">{selectedNode.data.label}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="text-slate-400">{selectedNode.data.type}</span>
                  <span>Team: {selectedNode.data.team}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                    selectedNode.data.risk === 'high' ? 'bg-red-500/10 text-red-400' :
                    selectedNode.data.risk === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>Risk: {selectedNode.data.risk}</span>
                  <span className="text-slate-600">ID: {selectedNode.id}</span>
                </div>
              </div>
              <button
                onClick={() => setBlastMode(!blastMode)}
                className="rounded-lg border border-brand/20 px-2.5 py-1 text-[10px] font-medium text-brand-light hover:bg-brand/[0.06] transition-colors"
              >
                {blastMode ? 'Clear Blast Radius' : 'Show Blast Radius'}
              </button>
            </div>
            {selectedNode.data.deps?.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                <span className="text-slate-600">Dependencies:</span>
                {selectedNode.data.deps.map((d, i) => (
                  <span key={d} className="flex items-center gap-1">
                    <span className="rounded bg-white/[0.06] px-2 py-0.5 text-slate-400">{d}</span>
                    {i < selectedNode.data.deps.length - 1 && <span className="text-slate-700">→</span>}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {search && filteredNodes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-sm text-slate-600">No nodes matching "<span className="text-slate-400">{search}</span>"</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
