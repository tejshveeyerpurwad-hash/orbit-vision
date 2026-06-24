/* ═══════════════════════════════════════════════════════════
   Orbit Foresight — Intelligence Proof Constants
   Single source of truth for all AI/Orbit intelligence metrics.
   Used across every page to ensure consistent, realistic values.
   ═══════════════════════════════════════════════════════════ */

export const ORBIT_INTELLIGENCE = {
  /* ── Knowledge Graph ── */
  knowledgeGraph: {
    totalNodes: 847,
    totalEdges: 1247,
    serviceRelationships: 2184,
    dependencyPaths: 3421,
    riskConnections: 892,
    correlationLinks: 1563,
    lastUpdated: '2026-06-25T14:32:00Z',
    coverage: '98.7%',
    accuracy: '96.3%',
  },

  /* ── Core Intelligence Metrics ── */
  coreMetrics: {
    rootCauseConfidence: { value: 94, suffix: '%', label: 'Root Cause Confidence' },
    blastRadiusAccuracy: { value: 92, suffix: '%', label: 'Blast Radius Accuracy' },
    revenueExposure: { value: 288000, prefix: '$', suffix: 'K', label: 'Revenue Exposure', format: 'currency' },
    recoverySavings: { value: 340000, prefix: '$', suffix: 'K', label: 'Recovery Savings', format: 'currency' },
    incidentPreventionProbability: { value: 89, suffix: '%', label: 'Incident Prevention Rate' },
    mttrReduction: { value: 18.7, suffix: 'm', label: 'MTTR Reduction' },
    deploymentConfidence: { value: 94.2, suffix: '%', label: 'Deployment Confidence' },
    aiConfidence: { value: 94, suffix: '%', label: 'AI Confidence' },
    patternMatchAccuracy: { value: 91, suffix: '%', label: 'Pattern Match Accuracy' },
    anomalyDetectionRate: { value: 96, suffix: '%', label: 'Anomaly Detection Rate' },
    falsePositiveRate: { value: 2.3, suffix: '%', label: 'False Positive Rate' },
    servicesMonitored: { value: 47, suffix: '', label: 'Services Monitored' },
    incidentsPrevented: { value: 1247, suffix: '', label: 'Incidents Prevented (30d)' },
  },

  /* ── Service Categories for Dependency Graph ── */
  serviceCategories: [
    { id: 'gateway', label: 'API Gateway', type: 'ingress', risk: 'medium', team: 'Platform', critical: true },
    { id: 'auth', label: 'Auth Service', type: 'security', risk: 'low', team: 'Security', critical: true },
    { id: 'payments', label: 'Payment Service', type: 'transaction', risk: 'critical', team: 'Payments', critical: true },
    { id: 'billing', label: 'Billing Service', type: 'transaction', risk: 'high', team: 'Billing', critical: true },
    { id: 'notifications', label: 'Notification Bus', type: 'messaging', risk: 'medium', team: 'Platform', critical: false },
    { id: 'webhooks', label: 'Webhook Delivery', type: 'egress', risk: 'low', team: 'Platform', critical: false },
    { id: 'cache', label: 'Redis Cache', type: 'data', risk: 'high', team: 'Infrastructure', critical: true },
    { id: 'db', label: 'Primary Database', type: 'data', risk: 'low', team: 'Infrastructure', critical: true },
    { id: 'ci-pipeline', label: 'CI Pipeline', type: 'devops', risk: 'low', team: 'DevOps', critical: false },
    { id: 'cd-pipeline', label: 'CD Pipeline', type: 'devops', risk: 'low', team: 'DevOps', critical: false },
    { id: 'monitoring', label: 'Monitoring Stack', type: 'observability', risk: 'low', team: 'SRE', critical: true },
    { id: 'analytics', label: 'Analytics Engine', type: 'data', risk: 'low', team: 'Data', critical: false },
  ],

  /* ── Risk Propagation Paths ── */
  propagationPaths: [
    { source: 'payments', target: 'billing', latency: '12s', risk: 'critical', type: 'synchronous' },
    { source: 'billing', target: 'notifications', latency: '8s', risk: 'high', type: 'async' },
    { source: 'payments', target: 'cache', latency: '3s', risk: 'critical', type: 'synchronous' },
    { source: 'cache', target: 'db', latency: '15s', risk: 'high', type: 'synchronous' },
    { source: 'gateway', target: 'payments', latency: '5s', risk: 'medium', type: 'synchronous' },
    { source: 'gateway', target: 'auth', latency: '2s', risk: 'low', type: 'synchronous' },
    { source: 'notifications', target: 'webhooks', latency: '6s', risk: 'medium', type: 'async' },
    { source: 'auth', target: 'db', latency: '10s', risk: 'low', type: 'synchronous' },
    { source: 'payments', target: 'notifications', latency: '4s', risk: 'medium', type: 'async' },
    { source: 'billing', target: 'analytics', latency: '20s', risk: 'low', type: 'async' },
  ],

  /* ── Blast Radius Scenarios ── */
  blastRadiusScenarios: [
    {
      service: 'Payment Service',
      stages: [
        { time: 'T+0s', event: 'Payment Gateway fails', services: 1, status: 'critical' },
        { time: 'T+12s', event: 'Circuit breaker triggers → Billing Service degraded', services: 2, status: 'critical' },
        { time: 'T+30s', event: 'Redis cache overload → API Gateway rate limiting', services: 3, status: 'degraded' },
        { time: 'T+45s', event: 'Auth Service experiences latency spike', services: 4, status: 'degraded' },
        { time: 'T+60s', event: 'Notification Bus queue backup', services: 5, status: 'warning' },
        { time: 'T+90s', event: 'Complete revenue pipeline failure', services: 6, status: 'critical' },
      ],
      totalServicesAffected: 6,
      revenueImpact: '$2.4M/hr',
      recoveryTime: '45 min',
    },
  ],

  /* ── Historical Incident Patterns ── */
  historicalPatterns: [
    { id: 'INC-2024-312', title: 'Redis Memory Exhaustion', similarity: 94, date: '2024-11-15', duration: '34m', services: ['payments', 'billing'], pattern: 'Memory pressure cascade' },
    { id: 'INC-2024-287', title: 'Payment Gateway Timeout', similarity: 87, date: '2024-10-28', duration: '28m', services: ['gateway', 'payments'], pattern: 'Circuit breaker threshold' },
    { id: 'INC-2024-256', title: 'Billing Reconciliation Failure', similarity: 82, date: '2024-10-02', duration: '52m', services: ['billing', 'db'], pattern: 'Deadlock contention' },
    { id: 'INC-2024-231', title: 'Authentication Token Expiry', similarity: 76, date: '2024-09-15', duration: '18m', services: ['auth', 'gateway'], pattern: 'Token rotation miss' },
    { id: 'INC-2024-198', title: 'Webhook Delivery Backlog', similarity: 71, date: '2024-08-30', duration: '41m', services: ['webhooks', 'notifications'], pattern: 'Queue depth overflow' },
    { id: 'INC-2024-167', title: 'Database Connection Pool Exhaustion', similarity: 68, date: '2024-08-12', duration: '63m', services: ['db', 'payments', 'billing'], pattern: 'Connection leak' },
  ],

  /* ── Deployment Risk Levels ── */
  deploymentRiskLevels: [
    { level: 'Critical', threshold: '>85%', color: '#ef4444', action: 'Immediate rollback required' },
    { level: 'High', threshold: '65-85%', color: '#f59e0b', action: 'Monitor closely, prepare rollback' },
    { level: 'Medium', threshold: '35-65%', color: '#06b6d4', action: 'Standard monitoring' },
    { level: 'Low', threshold: '<35%', color: '#34d399', action: 'Proceed with standard procedures' },
  ],

  /* ── Impact Chain Tracing ── */
  impactChain: {
    rootCause: 'Redis memory pressure → Payment Gateway circuit breaker saturation',
    propagation: [
      { service: 'Redis Cache', impact: 'Memory at 87% capacity, eviction policy active', timeToFailure: 'Immediate' },
      { service: 'Payment Gateway', impact: 'Circuit breaker at 94% threshold, 3 retry storms detected', timeToFailure: 'T+2s' },
      { service: 'Billing Service', impact: 'Invoice generation stalled, 12,400 pending transactions', timeToFailure: 'T+12s' },
      { service: 'Notification Bus', impact: 'Queue depth at 12K, delivery latency at 340ms', timeToFailure: 'T+30s' },
      { service: 'API Gateway', impact: 'Rate limiting engaged, P99 latency at 420ms', timeToFailure: 'T+45s' },
      { service: 'Customer Portal', impact: '4,200 users experiencing degraded experience', timeToFailure: 'T+90s' },
    ],
    businessImpact: {
      revenueLoss: '$2.4M/hr',
      customersAffected: '12,400',
      slaBreachProbability: '87%',
      recoveryCost: '$340K',
    },
  },
}

/* ── Orbit Intelligence Terminology Map ── */
export const ORBIT_TERMS = [
  { generic: 'AI', orbit: 'Orbit Knowledge Graph Intelligence', short: 'Orbit AI' },
  { generic: 'dependency', orbit: 'Dependency Graph Analysis', short: 'Dependency Graph' },
  { generic: 'service', orbit: 'Service Relationship Mapping', short: 'Service Map' },
  { generic: 'failure spread', orbit: 'Blast Radius Prediction', short: 'Blast Radius' },
  { generic: 'history', orbit: 'Historical Incident Correlation', short: 'Incident History' },
  { generic: 'deploy risk', orbit: 'Deployment Risk Intelligence', short: 'Deploy Risk' },
  { generic: 'decision', orbit: 'Engineering Decision Support', short: 'Decision Support' },
]

/* ── ROI Calculator Output ── */
export const ROI_CALCULATIONS = {
  circuitBreakerImplementation: {
    cost: 20400,
    annualSavings: 2840000,
    roi: 13800,
    paybackPeriod: '2.6 days',
    riskReduction: 78,
    confidence: 94,
  },
  retryQueueDeployment: {
    cost: 12000,
    annualSavings: 890000,
    roi: 7317,
    paybackPeriod: '4.9 days',
    riskReduction: 65,
    confidence: 89,
  },
  monitoringDashboard: {
    cost: 8500,
    annualSavings: 420000,
    roi: 4841,
    paybackPeriod: '7.4 days',
    riskReduction: 52,
    confidence: 86,
  },
}

/* ── Mock Investigation: Evidence Chain ── */
export const EVIDENCE_CHAIN = {
  title: 'Payment Pipeline Failure — Root Cause Investigation',
  status: 'completed',
  confidence: 94,
  evidence: [
    { type: 'anomaly', description: 'Payment Gateway error rate spiked from 0.4% to 8.7%', timestamp: '2026-06-25T13:42:00Z', severity: 'critical', source: 'Orbit Monitoring' },
    { type: 'correlation', description: 'Redis memory usage increased from 62% to 87% in 3 minutes', timestamp: '2026-06-25T13:40:00Z', severity: 'high', source: 'Orbit Metrics' },
    { type: 'pattern', description: 'Identical failure pattern to INC-2024-312 (94% similarity)', timestamp: '2026-06-25T13:38:00Z', severity: 'critical', source: 'Historical Incident Correlation' },
    { type: 'dependency', description: 'Payment → Redis → Billing dependency chain confirmed as critical path', timestamp: '2026-06-25T13:36:00Z', severity: 'high', source: 'Dependency Graph Analysis' },
    { type: 'propagation', description: 'Circuit breaker saturation predicted 12 seconds before trigger', timestamp: '2026-06-25T13:34:00Z', severity: 'critical', source: 'Blast Radius Prediction' },
    { type: 'impact', description: '6 services affected, $2.4M/hr revenue exposure confirmed', timestamp: '2026-06-25T13:30:00Z', severity: 'critical', source: 'Engineering Decision Support' },
  ],
  rootCause: 'Redis memory pressure cascading through Payment Gateway → Billing Service pipeline. Circuit breaker saturation at 94% threshold triggered retry storms that escalated to system-wide degradation.',
  impactReasoning: 'Payment Gateway is a single point of failure for 3 revenue-critical downstream services. Billing Service invoice generation depends on Payment transaction data via Redis cache. When Redis eviction policy activated under memory pressure, Payment retries flooded the circuit breaker, creating a cascade failure.',
  riskExplanation: 'Risk score of 92/100 driven by: (1) Critical dependency chain with no redundancy, (2) Historical recurrence pattern (3 incidents in 6 months), (3) Revenue exposure concentration ($2.4M/hr through single gateway).',
  similarIncidents: [
    { id: 'INC-2024-312', similarity: 94, date: '2024-11-15', resolution: 'Redis cluster scale-up + circuit breaker tune', duration: '34m' },
    { id: 'INC-2024-287', similarity: 87, date: '2024-10-28', resolution: 'Payment Gateway timeout threshold adjustment', duration: '28m' },
    { id: 'INC-2024-256', similarity: 82, date: '2024-10-02', resolution: 'Billing deadlock query optimization', duration: '52m' },
  ],
}

export default ORBIT_INTELLIGENCE
