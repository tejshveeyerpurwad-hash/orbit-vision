import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import IntelligenceCenter from './pages/IntelligenceCenter'
import KnowledgeGraph from './pages/KnowledgeGraph'
import ChangeImpactAnalysis from './pages/ChangeImpactAnalysis'
import AICTOReport from './pages/AICTOReport'
import DeploymentSimulator from './pages/DeploymentSimulator'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Help from './pages/Help'

function FadeIn({ children }) {
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [location])

  return (
    <div className={`transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FadeIn><Landing /></FadeIn>} />
      <Route path="/dashboard" element={<FadeIn><Dashboard /></FadeIn>} />
      <Route path="/intelligence" element={<FadeIn><IntelligenceCenter /></FadeIn>} />
      <Route path="/knowledge-graph" element={<FadeIn><KnowledgeGraph /></FadeIn>} />
      <Route path="/impact-analysis" element={<FadeIn><ChangeImpactAnalysis /></FadeIn>} />
      <Route path="/cto-report" element={<FadeIn><AICTOReport /></FadeIn>} />
      <Route path="/deployment-simulator" element={<FadeIn><DeploymentSimulator /></FadeIn>} />
      <Route path="/analytics" element={<FadeIn><Analytics /></FadeIn>} />
      <Route path="/settings" element={<FadeIn><Settings /></FadeIn>} />
      <Route path="/help" element={<FadeIn><Help /></FadeIn>} />
    </Routes>
  )
}
