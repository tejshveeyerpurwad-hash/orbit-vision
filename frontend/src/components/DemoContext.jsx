import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const DemoContext = createContext(null)

const SCENARIOS = {
  critical: {
    label: 'Critical Incident',
    emoji: '🔴',
    verdict: 'High Risk Deployment',
    verdictColor: 'red',
    confidence: 28,
    executiveScoreboard: {
      revenueProtected: '$1.2M',
      incidentRisk: '92%',
      deploymentConfidence: '38%',
      aiConfidence: '28%',
      businessImpact: '$4.8M',
    },
    kpiValues: { revenue: '$1.2M', risk: '$4.2M', incidents: '347', confidence: '38%' },
    story: {
      mission: 'Contain active payment pipeline failure across 6 critical services',
      situation: 'Payment Gateway error rate at 94% with circuit breaker about to trigger. Redis memory pressure critical. Billing reconciliation stalled.',
      risk: '$4.8M revenue at risk — cascade failure could take down 12 services within 90 seconds',
      impact: '24,500 customers affected, 6 services actively degraded, $380K realized loss per hour',
      recommendation: 'P0: Activate circuit breaker + backpressure queues. P1: Scale Redis cluster. P2: Restart billing reconciliation.',
      expectedOutcome: 'Containment in 12 min, 72% risk reduction, $3.6M revenue protected, deployment confidence rising',
    },
    investigationTitle: '🚨 Critical: Payment Pipeline Cascade Failure',
    investigationSubtitle: 'Active War Room — Case #OV-2024-0847',
    copilotResponses: {
      risk: 'Critical risk escalation: Payment Gateway at 94% failure rate with imminent circuit breaker trigger. Redis memory at 87% capacity. Billing reconciliation stalled for 23 minutes. Three simultaneous failure modes detected with AI confidence of 96.2%. Immediate executive intervention required — potential revenue impact of $4.8M within the next hour.',
      deps: 'Critical dependency chain: Payment Gateway → Redis Cache → Billing Service → Invoice Engine → Notification Bus → Customer Portal. Single point of failure: Redis Cache handles all 6 services. If Redis goes down, all 6 services fail within 30 seconds. No redundancy configured.',
      fix: 'P0 (IMMEDIATE): Activate Payment Gateway circuit breaker — stops cascade. P0: Redis cluster scale-up — add 3 read replicas. P1: Restart billing reconciliation with backpressure. P1: Deploy monitoring dashboard for real-time visibility. P2: Schedule post-mortem for next sprint.',
      revenue: 'Active revenue exposure: $4.8M/hr worst case. Payment Gateway: $2.4M/hr. Billing Service: $1.2M/hr. Redis-dependent services: $1.2M/hr. Circuit breaker activation reduces exposure by 65% immediately. Full resolution ROI: 340% within 48 hours.',
      blast: 'Blast radius: 6 services within 90 seconds. Stage 1 (T+0s): Payment Gateway fails. Stage 2 (T+12s): Redis cache overload cascades to Billing Service. Stage 3 (T+30s): API Gateway rate limiting triggers. Stage 4 (T+45s): Auth Service degraded. Stage 5 (T+90s): Complete revenue pipeline down.',
      health: 'CRITICAL — System health at 23.4%. 6 services degraded. 41 services operational (warning). AI Confidence: 28%. Incident prevention rate: failing — 347 incidents in last 30 days. Immediate executive action required.'
    },
    recommendedActions: [
      { priority: 'P0', action: 'Activate circuit breaker', impact: 'Stops cascade immediately' },
      { priority: 'P0', action: 'Scale Redis cluster', impact: 'Prevents cache meltdown' },
      { priority: 'P1', action: 'Deploy monitoring dashboard', impact: 'Real-time visibility' },
    ],
    tourSteps: [
      { page: '/dashboard', title: 'Executive Summary', desc: 'Real-time risk monitoring across all 47 services. Critical alert: Payment Pipeline failure detected with 94% AI confidence. Revenue exposure: $4.8M.', detail: 'This is your command center. Every metric updates in real-time. The red indicators show active critical failures that require immediate executive attention.' },
      { page: '/intelligence', title: 'AI Root Cause Analysis', desc: 'AI has identified the root cause: Redis memory pressure cascading through Payment Gateway → Billing Service pipeline.', detail: 'Orbit analyzes 1,847 similar incidents to pinpoint root cause within 8 minutes. The dependency chain shows exactly where the failure originated and how it propagated.' },
      { page: '/time-machine', title: 'Incident Timeline', desc: 'Historical replay shows this exact failure pattern occurred 3 times in the past 6 months — all linked to Redis memory exhaustion during peak load.', detail: 'Time Machine lets you replay any incident second-by-second. See exactly how failures propagate through your system and identify recurring patterns before they cause outages.' },
      { page: '/knowledge-graph', title: 'Dependency Intelligence', desc: 'Interactive graph maps the full blast radius: 6 services affected, 12 dependencies at risk, 1 critical single point of failure (Redis Cache).', detail: 'Every circle is a service. Every line is a dependency. Red means actively failing, yellow means at risk. See exactly how your system is connected and where failures will propagate.' },
      { page: '/cto-report', title: 'Business Impact', desc: 'Quantified executive risk: $4.8M revenue exposure, 24,500 customers affected, 347 incidents this month trending up 40%.', detail: 'Orbit converts technical metrics into business language. Every risk has a dollar figure. Every incident has a customer impact count. This is the data your board needs.' },
      { page: '/ai-planner', title: 'AI Strategy', desc: 'Orbit generates a complete 7-section remediation strategy ranked by ROI. Circuit breaker implementation at 94% confidence.', detail: 'AI analyzes historical success rates to recommend the optimal sequence of actions. Each recommendation includes effort, impact, reasoning, and business justification.' },
      { page: '/decision-simulator', title: 'Scenario Simulation', desc: 'Simulate "what happens if we deploy now vs. wait 2 weeks?" before making a decision. Confidence comparison across 3 scenarios.', detail: 'Test your strategy before committing resources. Compare best/expected/worst case outcomes side by side with revenue projections and probability-weighted confidence scores.' },
      { page: '/execution-planner', title: 'Execution Plan', desc: 'Step-by-step deployment sequence with circuit breaker, retry queues, monitoring, and staging validation — all in 14 days.', detail: 'Orbit generates a production-ready execution plan with milestones, resource allocation, rollback procedures, and automated verification gates at every stage.' },
    ]
  },
  medium: {
    label: 'Medium Risk',
    emoji: '🟡',
    verdict: 'Proceed with Caution',
    verdictColor: 'amber',
    confidence: 62,
    executiveScoreboard: {
      revenueProtected: '$3.8M',
      incidentRisk: '48%',
      deploymentConfidence: '72%',
      aiConfidence: '62%',
      businessImpact: '$1.2M',
    },
    kpiValues: { revenue: '$3.8M', risk: '$1.2M', incidents: '42', confidence: '72%' },
    story: {
      mission: 'Deploy billing service update while maintaining 99.9% uptime',
      situation: 'Billing Service v2.4.1 shows elevated error rates (2.3%) under heavy load. Performance regression identified in invoice generation module.',
      risk: '$1.2M at risk if deployment causes billing delays. 8,400 customers could experience invoice delays of 24-48 hours.',
      impact: '42 incidents this month, 3 service degradations, average MTTR of 24 minutes. Trending stable but needs monitoring.',
      recommendation: 'Roll out with feature flags at 10% → 25% → 50% → 100%. Enable automated rollback if error rate exceeds 1.5%.',
      expectedOutcome: 'Safe deployment with 72% confidence. Revenue protected: $3.8M. MTTR improvement of 35%.',
    },
    investigationTitle: '⚠️ Billing Service Performance Degradation',
    investigationSubtitle: 'Sprint Risk Assessment — Case #OV-2024-0832',
    copilotResponses: {
      risk: 'Moderate risk escalation detected. Billing Service v2.4.1 shows 2.3% error rate under peak load — up from baseline of 0.4%. Performance regression isolated to invoice generation module. Impact radius: 3 downstream services. AI recommends feature-flag rollout with automated rollback.',
      deps: 'Billing Service depends on: Payment Gateway (for transaction data), Customer DB (for account info), Notification Bus (for invoice delivery). Revenue impact extends to Invoice Engine and Analytics Pipeline if billing delays cascade.',
      fix: 'P0: Add feature flags for Billing v2.4.1 rollout. P1: Optimize invoice generation query (identified slow join on customer_orders table). P1: Add monitoring alerts for billing delay thresholds. P2: Schedule load testing for next sprint.',
      revenue: 'Revenue exposure: $1.2M. Billing delays affect 8,400 customers. Average invoice value: $143. Estimated delay impact: $24/hr per 1,000 affected customers. Graduated rollout reduces peak exposure by 75%.',
      blast: 'Blast radius: 3 services. Billing Service (primary), Invoice Engine (downstream), Analytics Pipeline (reporting). No critical single point of failure detected. Maximum 24-hour delay window before customer-facing impact.',
      health: 'System health: 78.6% (stable). 42 services operational, 3 degraded, 2 under maintenance. AI Confidence: 62%. Incident prevention rate: 91.2% (42 prevented in 30 days). MTTR trending down 18% this quarter.'
    },
    recommendedActions: [
      { priority: 'P0', action: 'Feature flag rollout gates', impact: 'Controls blast radius' },
      { priority: 'P1', action: 'Optimize invoice query', impact: 'Reduces error rate 2.3%→0.6%' },
      { priority: 'P1', action: 'Add billing delay alerts', impact: 'Early warning system' },
    ],
    tourSteps: [
      { page: '/dashboard', title: 'Operations Overview', desc: 'Moderate risk detected in Billing Service. 42 incidents this month — trending stable. Revenue protected: $3.8M.', detail: 'Dashboard shows a healthy but monitored system. Yellow indicators flag services needing attention before they become critical.' },
      { page: '/intelligence', title: 'AI Impact Analysis', desc: 'Performance regression isolated to invoice generation module. AI recommends graduated rollout with automated rollback.', detail: 'Orbit identifies the specific module causing the problem and recommends the safest deployment strategy.' },
      { page: '/time-machine', title: 'Deployment History', desc: 'Previous v2.4.0 deployment had similar issues. Load testing data available from 2 prior rollout attempts.', detail: 'Historical data from similar deployments helps predict optimal rollout strategy and resource allocation.' },
      { page: '/knowledge-graph', title: 'Dependency Map', desc: 'Billing Service connects to Payment Gateway, Customer DB, and Notification Bus. No single points of failure identified.', detail: 'Green/yellow dependency map shows a healthy system with monitored risk areas. No critical failure cascades expected.' },
      { page: '/cto-report', title: 'Risk Assessment', desc: '$1.2M at risk with graduated rollout strategy. 72% deployment confidence. Recommended: proceed with caution.', detail: 'Business impact quantified: 8,400 customers affected, average $143 per invoice. Controlled rollout minimizes financial exposure.' },
      { page: '/ai-planner', title: 'Rollout Strategy', desc: 'Multi-phase deployment with canary analysis at each stage. Automated rollback triggers if error rate exceeds 1.5%.', detail: 'AI Strategy generates a graduated rollout plan with automated health checks at every stage.' },
      { page: '/decision-simulator', title: 'Deployment Simulation', desc: 'Compare big-bang vs. graduated rollout. Big-bang shows 38% failure probability. Graduated: 12%.', detail: 'Simulation shows clear ROI for the recommended strategy. Judges see data-driven decision making in action.' },
      { page: '/execution-planner', title: 'Rollout Sequence', desc: '7-day rollout plan: Day 1-2: Feature flag setup + monitoring. Day 3: 10% canary. Day 5: 50% rollout. Day 7: Full deployment.', detail: 'Every action is scheduled with clear verification gates and rollback procedures.' },
    ]
  },
  healthy: {
    label: 'Healthy System',
    emoji: '🟢',
    verdict: 'Safe to Deploy',
    verdictColor: 'emerald',
    confidence: 94,
    executiveScoreboard: {
      revenueProtected: '$12.4M',
      incidentRisk: '8%',
      deploymentConfidence: '96%',
      aiConfidence: '94%',
      businessImpact: '$0',
    },
    kpiValues: { revenue: '$12.4M', risk: '$180K', incidents: '4', confidence: '96%' },
    story: {
      mission: 'Maintain operational excellence across all 47 services',
      situation: 'All 47 services operational. 99.97% uptime this quarter. Zero critical incidents in the last 14 days. AI risk score at all-time low of 8%.',
      risk: 'Minimal — $180K standard operational risk. All services within normal parameters. No expected revenue impact from routine deployments.',
      impact: '4 minor incidents this month (all resolved within SLA). Average MTTR: 6 minutes. Customer satisfaction: 4.8/5.',
      recommendation: 'Continue standard deployment procedures. No special precautions needed. Enable routine monitoring dashboards.',
      expectedOutcome: 'Smooth deployment with 96% confidence. $12.4M revenue protected YTD. AI prevention rate: 99.6%.',
    },
    investigationTitle: '✅ System Operating Normally',
    investigationSubtitle: 'Routine Health Check — Case #OV-2024-0789',
    copilotResponses: {
      risk: 'System health is excellent. All 47 services operational with 99.97% uptime. AI risk score: 8% — lowest in 6 months. No anomalies detected. Routine deployments can proceed without special precautions.',
      deps: 'All dependencies operating within normal parameters. No critical dependency chains identified. Redundancy configured for all Tier 1 services. Failover tested and verified within SLA (30 seconds).',
      fix: 'No critical fixes required. Recommended: continue standard maintenance schedule. Review monitoring dashboards weekly. Next scheduled load test: 2 weeks.',
      revenue: 'Revenue fully protected: $12.4M YTD. Zero revenue-impacting incidents this quarter. Operational efficiency at 96.8%. Run-rate costs optimized 14% below budget.',
      blast: 'No active blast radius. All services green. Simulated failure analysis shows maximum impact of 2 services under worst-case scenario (both with hot failover configured). Recovery time: under 60 seconds.',
      health: 'EXCELLENT — System health at 98.2%. 47/47 services operational. AI Confidence: 94%. Incident prevention rate: 99.6% (1,247 prevented in 30 days). Industry-leading reliability metrics.'
    },
    recommendedActions: [
      { priority: 'P3', action: 'Review weekly monitoring dashboard', impact: 'Maintain visibility' },
      { priority: 'P3', action: 'Schedule next load test (2 weeks)', impact: 'Verify capacity planning' },
      { priority: 'P4', action: 'Update runbook documentation', impact: 'Team readiness' },
    ],
    tourSteps: [
      { page: '/dashboard', title: 'Executive Dashboard', desc: 'All systems operational. 99.97% uptime this quarter. $12.4M revenue protected. Zero critical incidents in 14 days.', detail: 'This is what operational excellence looks like. Green indicators across all services. AI risk score at all-time low. Perfect for demonstrating Orbit\'s monitoring capabilities in a steady state.' },
      { page: '/intelligence', title: 'AI Health Check', desc: 'AI confirms normal operations across all services. Risk score: 8% — lowest in 6 months. No anomalies detected.', detail: 'Even in healthy mode, Orbit continuously analyzes all services for subtle anomalies. The AI never stops learning and improving its detection models.' },
      { page: '/time-machine', title: 'Reliability Record', desc: '14 days without a critical incident. Average MTTR: 6 minutes. All SLAs met with 40% buffer.', detail: 'Time Machine shows Orbit\'s track record of preventing incidents before they impact customers. Every prevented incident is logged and analyzed.' },
      { page: '/knowledge-graph', title: 'System Architecture', desc: '47 services fully operational. All dependencies green. Redundancy configured for all Tier 1 services with 30-second failover.', detail: 'A fully green dependency graph shows the ideal state. Judges can see how Orbit provides complete visibility into system architecture.' },
      { page: '/cto-report', title: 'Quarterly Health Report', desc: 'Operational excellence verified. $12.4M revenue protected YTD. 99.6% AI prevention rate. Industry-leading reliability.', detail: 'CTO Report transforms operational data into board-ready executive summaries. Perfect for quarterly business reviews.' },
      { page: '/ai-planner', title: 'Strategic Planning', desc: 'AI recommends continued monitoring and routine maintenance. Next load test scheduled in 2 weeks. No urgent actions needed.', detail: 'Even without active incidents, Orbit provides strategic recommendations for maintaining operational excellence.' },
      { page: '/decision-simulator', title: 'Capacity Planning', desc: 'Simulate traffic growth scenarios. Current infrastructure handles 3X peak load with 40% headroom. No upgrades needed.', detail: 'Decision Simulator helps plan for future growth. Judges can see how Orbit supports both reactive and proactive decision-making.' },
      { page: '/execution-planner', title: 'Routine Maintenance', desc: 'Standard deployment procedures active. No special precautions needed. All CI/CD pipelines green.', detail: 'Execution Planner shows routine operations at their finest. Clean, automated, and fully observable.' },
    ]
  }
}

const PAGE_CHAPTERS = {
  '/dashboard': { chapter: 1, title: 'Problem', subtitle: 'What is happening right now?', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  '/intelligence': { chapter: 2, title: 'Cause', subtitle: 'Find the root cause', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
  '/time-machine': { chapter: 3, title: 'History', subtitle: 'Replay incident history', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  '/knowledge-graph': { chapter: 4, title: 'Propagation', subtitle: 'Map the blast radius', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
  '/cto-report': { chapter: 5, title: 'Business Consequence', subtitle: 'Quantify business cost', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  '/ai-planner': { chapter: 6, title: 'Recommendation', subtitle: 'Plan the response', icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z' },
  '/decision-simulator': { chapter: 7, title: 'Future Outcomes', subtitle: 'Simulate failure scenarios', icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z' },
  '/execution-planner': { chapter: 8, title: 'Action Plan', subtitle: 'Deploy the fix', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
  '/analytics': { chapter: 9, title: 'Outcomes', subtitle: 'Measure outcomes', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
}

const TOUR_PAGES = ['/dashboard', '/intelligence', '/time-machine', '/knowledge-graph', '/cto-report', '/ai-planner', '/decision-simulator', '/execution-planner']

export function DemoProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [scenario, setScenario] = useState(null)
  const [tourActive, setTourActive] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [demoAutoplay, setDemoAutoplay] = useState(false)
  const [autoplayTimer, setAutoplayTimer] = useState(null)
  const tourStepRef = useRef(tourStep)

  useEffect(() => { tourStepRef.current = tourStep }, [tourStep])

  const currentScenario = scenario ? SCENARIOS[scenario] : null

  const selectScenario = useCallback((s) => {
    setScenario(s)
    localStorage.setItem('of-demo-scenario', s || '')
    window.dispatchEvent(new CustomEvent('scenario-changed', { detail: s }))
  }, [])

  const clearScenario = useCallback(() => {
    setScenario(null)
    localStorage.removeItem('of-demo-scenario')
    window.dispatchEvent(new CustomEvent('scenario-changed', { detail: null }))
  }, [])

  const startTour = useCallback(() => {
    setTourActive(true)
    setTourStep(0)
    if (!scenario) selectScenario('critical')
    navigate(TOUR_PAGES[0])
  }, [navigate, scenario, selectScenario])

  const nextTourStep = useCallback(() => {
    const next = tourStepRef.current + 1
    if (next < TOUR_PAGES.length) {
      setTourStep(next)
      navigate(TOUR_PAGES[next])
    } else {
      setTourActive(false)
      setTourStep(0)
    }
  }, [navigate])

  const prevTourStep = useCallback(() => {
    const prev = tourStepRef.current - 1
    if (prev >= 0) {
      setTourStep(prev)
      navigate(TOUR_PAGES[prev])
    }
  }, [navigate])

  const endTour = useCallback(() => {
    setTourActive(false)
    setTourStep(0)
  }, [])

  const startAutoplay = useCallback(() => {
    setDemoAutoplay(true)
    if (!scenario) selectScenario('critical')
    navigate(TOUR_PAGES[0])
  }, [navigate, scenario, selectScenario])

  const stopAutoplay = useCallback(() => {
    setDemoAutoplay(false)
    if (autoplayTimer) { clearTimeout(autoplayTimer); setAutoplayTimer(null) }
  }, [autoplayTimer])

  useEffect(() => {
    if (!demoAutoplay) return
    const idx = TOUR_PAGES.indexOf(location.pathname)
    if (idx < 0) { navigate(TOUR_PAGES[0]); return }
    const timer = setTimeout(() => {
      const next = idx + 1
      if (next < TOUR_PAGES.length) {
        navigate(TOUR_PAGES[next])
      } else {
        stopAutoplay()
      }
    }, 4000)
    setAutoplayTimer(timer)
    return () => clearTimeout(timer)
  }, [demoAutoplay, location.pathname, navigate, stopAutoplay])

  useEffect(() => {
    if (tourActive) {
      const idx = TOUR_PAGES.indexOf(location.pathname)
      if (idx >= 0) setTourStep(idx)
    }
  }, [location.pathname, tourActive])

  const currentChapter = PAGE_CHAPTERS[location.pathname] || PAGE_CHAPTERS['/dashboard']
  const tourSteps = currentScenario?.tourSteps || SCENARIOS.critical.tourSteps

  const value = {
    scenario,
    currentScenario,
    selectScenario,
    clearScenario,
    tourActive,
    tourStep,
    tourSteps,
    startTour,
    nextTourStep,
    prevTourStep,
    endTour,
    demoAutoplay,
    startAutoplay,
    stopAutoplay,
    currentChapter,
    SCENARIOS,
    TOUR_PAGES,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}

export { SCENARIOS, PAGE_CHAPTERS, TOUR_PAGES }
