import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import NarrativeCTA from '../components/NarrativeCTA'
import ExecutiveBanner from '../components/ExecutiveBanner'

const reportData = {
  feature: 'Add payment retry support',
  verdict: { shouldBuild: true, confidence: 87, summary: 'Build — Strong ROI with acceptable risk. Estimated 320% ROI within 30 days of deployment. Mitigation investment of $14K offsets potential $288K/month incident cost. Analysis based on 6 risk vectors across 3 engineering teams with 12-month projection horizon. Historical data from 14 similar payment-reliability features shows 89% success rate for this pattern.' },
  businessImpact: { revenueAtRisk: 12000, customerImpact: 'All payment flows', slaViolation: '45 min', regulatory: 'PCI compliance', businessScore: 72 },
  engineeringCost: { hours: 136, engineers: 4, sprints: 3, storyPoints: 34, costUSD: 14000, costScore: 65 },
  riskLevel: { score: 68, level: 'Moderate', criticalRisks: 1, highRisks: 2, mediumRisks: 1 },
  roi: { percentage: 320, breakevenHours: 3.5, monthlySavings: 288000, investment: 14000, projectionMonths: 12 },
  deploymentWindow: { earliest: 'Jul 8', latest: 'Jul 22', recommended: 'Jul 15', confidence: 'High' },
  recommendation: { decision: 'BUILD', reasoning: 'Feature delivers critical payment reliability improvements. The mitigation plan reduces all identified risks to acceptable levels with circuit breaker patterns, dead-letter queues, and shadow-read migrations. ROI of 320% within 30 days of deployment strongly validates the investment decision. The 87% confidence score reflects high data quality and strong historical pattern matching across 14 similar features. All 5 mitigation plans have clear owners, timelines, and measurable reduction targets.', teamReadiness: 'Payments team at 85% capacity — recommend adding 1 contractor for Sprint 2 to handle webhook integration workload. Billing team needs 1 senior engineer unblocked from Platform rotation before Sprint 2 begins.', alternative: 'Defer billing integration (P2 risk) to separate release if timeline pressure requires scope reduction. The P0 payment gateway circuit breaker and P1 webhook dead-letter queue should remain in scope regardless.' },
  teamReadiness: [
    { team: 'Payments', readiness: 72, load: 85, confidence: 'On Track', members: 8, availability: '2 blocked by upstream dependency', sprintVelocity: 48, capacityRemaining: 15, focusArea: 'Core retry logic + circuit breaker' },
    { team: 'Billing', readiness: 65, load: 60, confidence: 'Needs Support', members: 5, availability: '1 on leave until Jul 12', sprintVelocity: 32, capacityRemaining: 40, focusArea: 'Migration + compliance tokenization' },
    { team: 'Platform', readiness: 88, load: 30, confidence: 'Ready', members: 12, availability: 'All available, 3 on-call rotation', sprintVelocity: 72, capacityRemaining: 70, focusArea: 'Webhook DLQ + observability + rate limiting' },
    { team: 'QA', readiness: 45, load: 90, confidence: 'Needs Support', members: 3, availability: '1 shared with other project', sprintVelocity: 18, capacityRemaining: 10, focusArea: 'E2E testing + load testing + chaos testing' },
  ],
  riskCategories: [
    { name: 'Payment Gateway Failure', severity: 'Critical', score: 92, mitigation: 'Active', service: 'Payment API', impact: 'All transactions fail', likelihood: 35, detectionTime: '30s', rto: '5 min' },
    { name: 'Database Migration Conflicts', severity: 'High', score: 74, mitigation: 'In Progress', service: 'Billing DB', impact: 'Data inconsistency', likelihood: 55, detectionTime: '2 min', rto: '30 min' },
    { name: 'Webhook Timeout Issues', severity: 'High', score: 68, mitigation: 'Planned', service: 'Webhook Svc', impact: 'Event loss up to 5 min', likelihood: 45, detectionTime: '1 min', rto: '15 min' },
    { name: 'PCI Compliance Gap', severity: 'Medium', score: 45, mitigation: 'Active', service: 'Compliance', impact: 'Audit failure risk', likelihood: 25, detectionTime: '24 hr', rto: '7 days' },
    { name: 'Rate Limiting Bottleneck', severity: 'Low', score: 28, mitigation: 'Resolved', service: 'API Gateway', impact: 'Degraded throughput', likelihood: 15, detectionTime: '5 min', rto: '10 min' },
    { name: 'Logging Pipeline Lag', severity: 'Low', score: 22, mitigation: 'Resolved', service: 'Observability', impact: 'Delayed alerting', likelihood: 10, detectionTime: '15 min', rto: '30 min' },
    { name: 'Secrets Rotation Gap', severity: 'Medium', score: 40, mitigation: 'In Progress', service: 'Security', impact: 'Credential exposure', likelihood: 20, detectionTime: '1 hr', rto: '4 hr' },
    { name: 'Cache Invalidation Bug', severity: 'Low', score: 18, mitigation: 'Resolved', service: 'Cache Layer', impact: 'Stale data served', likelihood: 12, detectionTime: '10 min', rto: '20 min' },
    { name: 'Idempotency Key Collision', severity: 'Medium', score: 38, mitigation: 'In Progress', service: 'Payment API', impact: 'Duplicate charges', likelihood: 18, detectionTime: '5 min', rto: '10 min' },
    { name: 'Async Queue Backpressure', severity: 'Low', score: 15, mitigation: 'Resolved', service: 'Message Queue', impact: 'Processing delay', likelihood: 8, detectionTime: '30 min', rto: '1 hr' },
    { name: 'Third-Party Provider Rate Limit', severity: 'Medium', score: 35, mitigation: 'Active', service: 'Payment API', impact: 'Transaction delays', likelihood: 40, detectionTime: '1 min', rto: '5 min' },
    { name: 'Configuration Drift in Canary', severity: 'Low', score: 20, mitigation: 'Planned', service: 'Deployment', impact: 'Inconsistent behavior', likelihood: 15, detectionTime: '15 min', rto: '30 min' },
  ],
  riskByService: [
    { service: 'Payment API', score: 92, color: 'red' },
    { service: 'Billing DB', score: 74, color: 'orange' },
    { service: 'Webhook Svc', score: 68, color: 'orange' },
    { service: 'Compliance', score: 45, color: 'yellow' },
    { service: 'Security', score: 40, color: 'yellow' },
    { service: 'API Gateway', score: 28, color: 'green' },
    { service: 'Observability', score: 22, color: 'green' },
    { service: 'Cache Layer', score: 18, color: 'green' },
    { service: 'Message Queue', score: 15, color: 'green' },
    { service: 'Idempotency', score: 38, color: 'yellow' },
  ],
  mitigationPlans: [
    { risk: 'Payment Gateway Failure', severity: 'Critical', strategy: 'Circuit breaker pattern with 3 retries + fallback queue. Automatic failover to secondary provider after 30s timeout. P99 latency target under 200ms.', owner: 'Alice Chen', timeline: 'Sprint 1', reduction: 85, costImpact: 2000, successMetric: 'Zero payment failures during canary' },
    { risk: 'Database Migration Conflicts', severity: 'High', strategy: 'Shadow reads on replica before cutover. Automated rollback script with data validation checks. Zero-downtime migration plan with 5-phase gating.', owner: 'Bob Kumar', timeline: 'Sprint 2', reduction: 70, costImpact: 1500, successMetric: 'Zero data inconsistency incidents' },
    { risk: 'Webhook Timeout Issues', severity: 'High', strategy: 'Async processing with dead-letter queue and alerting. Retry with exponential backoff up to 5 attempts. Max latency per event under 10s.', owner: 'Carol Davis', timeline: 'Sprint 1', reduction: 65, costImpact: 1800, successMetric: '100% event delivery within SLA' },
    { risk: 'PCI Compliance Gap', severity: 'Medium', strategy: 'Tokenization layer for stored payment methods. Vault integration for key management. Quarterly audit automation with evidence collection.', owner: 'David Lee', timeline: 'Sprint 3', reduction: 90, costImpact: 3000, successMetric: 'Clean PCI DSS audit pass' },
    { risk: 'Secrets Rotation Gap', severity: 'Medium', strategy: 'Automate secrets rotation with HashiCorp Vault integration. 30-day rotation policy with expiry alerts and automatic invalidation.', owner: 'Eve Park', timeline: 'Sprint 2', reduction: 88, costImpact: 1200, successMetric: '100% secrets rotated within policy window' },
  ],
  costBreakdown: [
    { phase: 'Kickoff & Requirements', hours: 6, pct: 4, cost: 618, deliverables: 'PRD refinement, stakeholder alignment doc' },
    { phase: 'Design & Planning', hours: 18, pct: 13, cost: 1854, deliverables: 'Architecture doc, sequence diagrams, risk register' },
    { phase: 'Core Implementation', hours: 52, pct: 38, cost: 5356, deliverables: 'Circuit breaker, retry logic, queue handlers' },
    { phase: 'Integration & Testing', hours: 36, pct: 26, cost: 3708, deliverables: 'Integration tests, E2E tests, chaos tests' },
    { phase: 'Security Review', hours: 18, pct: 13, cost: 1854, deliverables: 'Security audit report, penetration test results' },
    { phase: 'Deployment & Docs', hours: 12, pct: 9, cost: 1236, deliverables: 'Runbook, KB article, monitoring dashboards' },
    { phase: 'Post-Launch Support', hours: 8, pct: 6, cost: 824, deliverables: 'Warranty period, incident response readiness' },
  ],
  monthlyProjection: [
    { month: 'Jul', savings: 0, cumulative: 0, events: 0 },
    { month: 'Aug', savings: 96000, cumulative: 96000, events: 120 },
    { month: 'Sep', savings: 192000, cumulative: 288000, events: 240 },
    { month: 'Oct', savings: 240000, cumulative: 528000, events: 300 },
    { month: 'Nov', savings: 264000, cumulative: 792000, events: 330 },
    { month: 'Dec', savings: 280000, cumulative: 1072000, events: 350 },
    { month: 'Jan', savings: 288000, cumulative: 1360000, events: 360 },
    { month: 'Feb', savings: 288000, cumulative: 1648000, events: 360 },
    { month: 'Mar', savings: 288000, cumulative: 1936000, events: 360 },
    { month: 'Apr', savings: 288000, cumulative: 2224000, events: 360 },
    { month: 'May', savings: 288000, cumulative: 2512000, events: 360 },
    { month: 'Jun', savings: 288000, cumulative: 2800000, events: 360 },
  ],
  milestones: [
    { name: 'Design Sign-off', date: 'Jun 28', progress: 100, status: 'Complete', owner: 'Alice Chen', blockers: 'None', phase: 'Planning' },
    { name: 'Core Complete', date: 'Jul 5', progress: 65, status: 'In Progress', owner: 'Bob Kumar', blockers: 'Payment API rate limit negotiation pending with vendor', phase: 'Implementation' },
    { name: 'Integration Pass', date: 'Jul 12', progress: 30, status: 'At Risk', owner: 'Carol Davis', blockers: 'Webhook spec not finalized with partner team', phase: 'Testing' },
    { name: 'Staging Validation', date: 'Jul 19', progress: 10, status: 'Pending', owner: 'David Lee', blockers: 'Awaiting staging environment allocation from DevOps', phase: 'Validation' },
    { name: 'Production Launch', date: 'Jul 26', progress: 0, status: 'Pending', owner: 'Eve Park', blockers: 'Requires change advisory board approval by Jul 22', phase: 'Launch' },
  ],
  aiRecommendations: [
    { priority: 'P0', action: 'Implement circuit breaker for payment gateway calls with automatic failover to secondary provider', impact: 'Prevents cascading failures across all payment flows', effort: '8 SP', owner: 'Payments', confidence: 92, rationale: 'Single point of failure for all payment transactions' },
    { priority: 'P0', action: 'Add dead-letter queue for failed webhooks with exponential backoff retry up to 5 attempts', impact: 'Zero lost events with guaranteed delivery SLA', effort: '5 SP', owner: 'Platform', confidence: 88, rationale: 'Webhook delivery is critical for partner integrations' },
    { priority: 'P1', action: 'Shadow-read migration validation for billing DB with automated data consistency checks', impact: 'Zero-downtime cutover with rollback confidence', effort: '8 SP', owner: 'Billing', confidence: 78, rationale: 'High impact but lower probability of failure' },
    { priority: 'P1', action: 'Tokenize stored payment methods for PCI DSS v4.0 compliance with Vault integration', impact: 'Compliance pass with automated audit trail', effort: '6 SP', owner: 'Payments', confidence: 85, rationale: 'Regulatory requirement with fixed deadline' },
    { priority: 'P1', action: 'Implement structured logging for retry events with correlation IDs across all services', impact: 'Debug production issues 3x faster with full trace view', effort: '3 SP', owner: 'Platform', confidence: 91, rationale: 'Observability gap identified in post-mortems' },
    { priority: 'P2', action: 'Add rate limiting telemetry to API Gateway with dynamic threshold adjustment', impact: 'Observability improvement for capacity planning', effort: '3 SP', owner: 'Platform', confidence: 95, rationale: 'Nice-to-have for operational excellence' },
    { priority: 'P2', action: 'Create runbook for payment retry incident response with automated diagnostic script', impact: 'Reduce MTTR from 45 min to 15 min for retry-related incidents', effort: '2 SP', owner: 'Payments', confidence: 87, rationale: 'Improves SRE readiness for new feature' },
  ],
  scenarios: [
    { name: 'Best Case', riskReduction: 85, roi: 420, cost: 11000, timeline: '5 weeks', probability: 20, savingsYear1: 3800000, riskScore: 25, confidence: 94 },
    { name: 'Expected', riskReduction: 68, roi: 320, cost: 14000, timeline: '6 weeks', probability: 60, savingsYear1: 2800000, riskScore: 68, confidence: 87 },
    { name: 'Worst Case', riskReduction: 45, roi: 180, cost: 22000, timeline: '9 weeks', probability: 20, savingsYear1: 1500000, riskScore: 82, confidence: 62 },
    { name: 'Aggressive Skip', riskReduction: 30, roi: 120, cost: 8000, timeline: '3 weeks', probability: 15, savingsYear1: 900000, riskScore: 91, confidence: 45 },
    { name: 'Phased Rollout', riskReduction: 75, roi: 280, cost: 16000, timeline: '8 weeks', probability: 10, savingsYear1: 2200000, riskScore: 35, confidence: 80 },
  ],
  technicalDebt: {
    currentDebtDays: 23, projectedDebtDays: 8, codeQuality: 72, testCoverage: 58, docScore: 44,
    debtReductionPct: 65,
    categories: [
      { area: 'Untested error paths in retry logic', days: 8, severity: 'High', priority: 'P1', resolution: 'Add unit tests for all 6 retry scenarios' },
      { area: 'Missing integration tests for webhook flow', days: 6, severity: 'High', priority: 'P1', resolution: 'E2E test suite with webhook simulator' },
      { area: 'Legacy webhook handler needs refactor', days: 5, severity: 'Medium', priority: 'P2', resolution: 'Refactor to use new async handler pattern' },
      { area: 'Hardcoded config values for timeouts', days: 3, severity: 'Low', priority: 'P3', resolution: 'Externalize to environment config' },
      { area: 'Deprecated HTTP client library usage', days: 1, severity: 'Low', priority: 'P3', resolution: 'Upgrade to latest major version' },
    { area: 'Missing circuit breaker configuration validation', days: 2, severity: 'Medium', priority: 'P2', resolution: 'Add config schema validation tests' },
    { area: 'Incomplete OpenAPI spec for retry endpoints', days: 1.5, severity: 'Low', priority: 'P3', resolution: 'Generate spec from code annotations' },
    { area: 'Stale feature flags after rollout', days: 0.5, severity: 'Low', priority: 'P3', resolution: 'Add flag cleanup to launch checklist' },
    ],
  },
  deploymentConfig: {
    strategy: 'Canary (10% -> 50% -> 100%)', rollbackPlan: 'Automated rollback on >1% error rate increase or >500ms latency increase sustained for 2 min', canarySteps: '10% for 4hr -> 50% for 8hr -> 100% with 24hr observation',
    blastRadius: 'Payment API cluster (3 pods out of 12 total pods)', canaryDuration: '12 hours active, 24 hr observation', monitoring: 'Error rate, latency p95, throughput, success rate, CPU, memory, GC pause time',
    metricsWindow: '15 min rolling window', alertThresholds: 'Error rate >1%, Latency p95 >500ms, Throughput drop >10%', observability: 'Datadog dashboard + PagerDuty integration',
  },
  complianceChecks: [
    { standard: 'PCI DSS v4.0', status: 'In Progress', required: true, deadline: 'Aug 15', owner: 'Security Team', notes: 'Tokenization layer addresses requirement 3.4' },
    { standard: 'SOC 2 Type II', status: 'Compliant', required: true, deadline: 'N/A', owner: 'Compliance', notes: 'Annual audit passed in Q2 2026' },
    { standard: 'GDPR Data Handling', status: 'Compliant', required: true, deadline: 'N/A', owner: 'Legal', notes: 'DPA in place with all processors' },
    { standard: 'CCPA Consumer Rights', status: 'Not Applicable', required: false, deadline: 'N/A', owner: 'Legal', notes: 'No California consumer data processed' },
    { standard: 'ISO 27001', status: 'Compliant', required: true, deadline: 'N/A', owner: 'Security', notes: 'Certification renewed Q1 2026' },
    { standard: 'HIPAA BA Agreement', status: 'Not Applicable', required: false, deadline: 'N/A', owner: 'Legal', notes: 'No PHI processed in payment flows' },
  ],
  securityFindings: [
    { finding: 'Payment token not encrypted at rest in retry queue', severity: 'Critical', fixEffort: '4h', status: 'Remediating', owner: 'Alice Chen', dueDate: 'Jul 5' },
    { finding: 'Webhook secret key in environment file', severity: 'High', fixEffort: '1h', status: 'Remediated', owner: 'Carol Davis', dueDate: 'Jun 28' },
    { finding: 'Missing request validation on retry endpoint', severity: 'High', fixEffort: '3h', status: 'Remediating', owner: 'Bob Kumar', dueDate: 'Jul 3' },
    { finding: 'Rate limiter bypass possible via header manipulation', severity: 'Medium', fixEffort: '6h', status: 'Planned', owner: 'Platform', dueDate: 'Jul 10' },
    { finding: 'Verbose error messages in API responses exposing stack traces', severity: 'Low', fixEffort: '2h', status: 'Planned', owner: 'Payments', dueDate: 'Jul 12' },
    { finding: 'Missing audit log for retry admin actions', severity: 'Medium', fixEffort: '4h', status: 'Planned', owner: 'Security', dueDate: 'Jul 15' },
    { finding: 'TLS certificate expiration on webhook endpoint', severity: 'High', fixEffort: '1h', status: 'Remediated', owner: 'DevOps', dueDate: 'Jun 30' },
  ],
  environmentMatrix: [
    { env: 'Development', status: 'Ready', config: 'Latest commit', dataVolume: 'Synthetic test data', refreshRate: 'Daily', access: 'All engineers' },
    { env: 'Staging', status: 'Provisioning', config: 'Mirror prod (feat branch)', dataVolume: 'Anonymized prod copy', refreshRate: 'Weekly', access: 'Engineers + QA' },
    { env: 'Production', status: 'Live', config: 'Locked (change controlled)', dataVolume: '12M transactions/month', refreshRate: 'Real-time', access: 'On-call + SRE' },
    { env: 'DR/Disaster Recovery', status: 'Standby', config: 'Async replica', dataVolume: 'Replicated', refreshRate: 'Continuous', access: 'SRE only' },
    { env: 'Load Testing', status: 'On-demand', config: 'Ephemeral', dataVolume: 'Generated', refreshRate: 'Per test', access: 'QA + Performance' },
  ],
  communicationPlan: [
    { stakeholder: 'Engineering Team', channel: 'Slack #payment-retry channel', frequency: 'Daily standup at 9:30am', owner: 'Tech Lead', format: 'Async + sync' },
    { stakeholder: 'Product Management', channel: 'Weekly sync (Mon 2pm)', frequency: 'Every Monday', owner: 'PM', format: 'Slides + demo' },
    { stakeholder: 'Executive Team', channel: 'Bi-weekly written report', frequency: 'Every other Friday', owner: 'Director Eng', format: '1-pager + metrics' },
    { stakeholder: 'Customer Support', channel: 'KB article + training session', frequency: 'Before launch (Jul 25)', owner: 'Support Lead', format: 'Documentation' },
    { stakeholder: 'Security Team', channel: 'Formal security review meeting', frequency: 'End of Sprint 2 (Jul 10)', owner: 'Security Lead', format: 'Review + sign-off' },
    { stakeholder: 'QA Team', channel: 'Daily test status in #quality', frequency: 'Daily at 4pm', owner: 'QA Lead', format: 'Dashboard + blockers' },
    { stakeholder: 'Partner Engineering', channel: 'Weekly sync (Wed 11am)', frequency: 'Every Wednesday', owner: 'Partner Eng Lead', format: 'Video call + doc' },
    { stakeholder: 'Customer Success', channel: 'Monthly newsletter + training', frequency: 'Before launch + monthly', owner: 'CS Lead', format: 'Email + KB update' },
  ],
  resourceAllocation: [
    { resource: 'Payment engineers (BE)', allocated: 3, needed: 3, gap: 0, critical: true, recruiting: 'None needed' },
    { resource: 'Payment engineers (FE)', allocated: 1, needed: 2, gap: 1, critical: true, recruiting: 'Borrow from checkout team' },
    { resource: 'Platform engineers', allocated: 2, needed: 2, gap: 0, critical: false, recruiting: 'None needed' },
    { resource: 'QA engineers', allocated: 1, needed: 2, gap: 1, critical: false, recruiting: 'Contractor starting Jul 1' },
    { resource: 'DevOps engineers', allocated: 0.5, needed: 1, gap: 0.5, critical: false, recruiting: 'Part-time from infra team' },
    { resource: 'Security engineers', allocated: 0.5, needed: 1, gap: 0.5, critical: false, recruiting: 'Security review only' },
    { resource: 'Technical writers', allocated: 0, needed: 0.5, gap: 0.5, critical: false, recruiting: 'Shared with platform docs' },
    { resource: 'SRE / On-call engineers', allocated: 2, needed: 2, gap: 0, critical: true, recruiting: 'Existing team covers rotation' },
  ],
  dependencyGraph: [
    { dependency: 'Payment gateway API key rotation by Security', status: 'Blocked', owner: 'Security', resolution: 'Jul 2', risk: 'High', criticalPath: true },
    { dependency: 'Partner webhook spec finalization', status: 'In Progress', owner: 'Partner Eng', resolution: 'Jul 3', risk: 'Medium', criticalPath: true },
    { dependency: 'Staging environment provisioned with prod config', status: 'Pending', owner: 'DevOps', resolution: 'Jul 8', risk: 'Low', criticalPath: false },
    { dependency: 'Change advisory board approval for production deployment', status: 'Scheduled', owner: 'Eve Park', resolution: 'Jul 22', risk: 'Low', criticalPath: true },
    { dependency: 'Load testing results meet SLO thresholds', status: 'Pending', owner: 'QA', resolution: 'Jul 15', risk: 'Low', criticalPath: false },
    { dependency: 'Tokenization vault provisioning by Security', status: 'In Progress', owner: 'Security', resolution: 'Jul 10', risk: 'Medium', criticalPath: true },
    { dependency: 'PagerDuty alert routing configuration for new retry alerts', status: 'Pending', owner: 'DevOps', resolution: 'Jul 18', risk: 'Low', criticalPath: false },
    { dependency: 'Datadog dashboard creation for retry metrics', status: 'Pending', owner: 'Platform', resolution: 'Jul 16', risk: 'Low', criticalPath: false },
    { dependency: 'Runbook review and approval by SRE team', status: 'Not Started', owner: 'SRE', resolution: 'Jul 20', risk: 'Low', criticalPath: false },
  ],
  monitoringAlerts: [
    { metric: 'Payment retry rate', threshold: '>5% of total payments', severity: 'Warning', response: 'Investigate within 15 min' },
    { metric: 'Circuit breaker open', threshold: 'Any occurrence', severity: 'Critical', response: 'Page on-call immediately' },
    { metric: 'DLQ message count', threshold: '>100 messages in queue', severity: 'Warning', response: 'Review and reprocess within 1 hr' },
    { metric: 'Retry success rate', threshold: '<95%', severity: 'Critical', response: 'Escalate to engineering team' },
    { metric: 'End-to-end latency p99', threshold: '>500ms', severity: 'Warning', response: 'Triage with platform team' },
    { metric: 'Payment success rate', threshold: '<99.5%', severity: 'Critical', response: 'Immediate incident response' },
    { metric: 'DLQ reprocess rate', threshold: '<90% within 1hr', severity: 'Warning', response: 'Manual reprocess trigger' },
    { metric: 'Canary error rate', threshold: '>1% above baseline', severity: 'Critical', response: 'Auto-rollback + page SRE' },
    { metric: 'Memory usage per pod', threshold: '>80% for 5 min', severity: 'Warning', response: 'Investigate memory leak' },
    { metric: 'Retry queue depth', threshold: '>1000 messages', severity: 'Warning', response: 'Scale consumer workers' },
    { metric: 'Payment idempotency collision rate', threshold: '>0.01%', severity: 'Warning', response: 'Review idempotency key generation' },
  ],
}

function AnimatedScoreBar({ value, label, sublabel, color = 'bg-brand', delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 300 + delay); return () => clearTimeout(t) }, [value, delay])
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
        <span className="text-[10px] font-semibold text-white">{sublabel || `${value}%`}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  )
}

function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, delay = 300 }) {
  const [c, setC] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0
      const dur = 1200
      const go = (now) => {
        const p = Math.min((now - begin) / dur, 1)
        setC(Math.round((1 - Math.pow(1 - p, 3)) * value * Math.pow(10, decimals)) / Math.pow(10, decimals))
        if (p < 1) requestAnimationFrame(go)
      }
      const begin = performance.now()
      requestAnimationFrame(go)
    }, delay)
    return () => clearTimeout(t)
  }, [value, delay, decimals])
  return <>{prefix}{c.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>
}

function MilestoneBar({ progress, status }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(progress), 500); return () => clearTimeout(t) }, [progress])
  const color = status === 'Complete' ? 'bg-emerald-500' : status === 'In Progress' ? 'bg-amber-500' : status === 'At Risk' ? 'bg-red-500' : 'bg-slate-600'
  return (
    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${color}`} />
    </div>
  )
}

function RingGauge({ value, size = 80, stroke = 6, color = '#22c55e', label = '', sub = '' }) {
  const [pct, setPct] = useState(0)
  useEffect(() => { const t = setTimeout(() => setPct(value), 400); return () => clearTimeout(t) }, [value])
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="text-lg font-bold text-white mt-1"><AnimatedCounter value={value} suffix="%" delay={400} /></span>
      {label && <span className="text-[9px] text-slate-500">{label}</span>}
    </div>
  )
}

function StatusDot({ status }) {
  const colors = { Complete: 'bg-emerald-500', 'In Progress': 'bg-amber-500', 'At Risk': 'bg-red-500', Pending: 'bg-slate-600', Live: 'bg-emerald-500', Ready: 'bg-emerald-500', Provisioning: 'bg-amber-500', Blocked: 'bg-red-500', Scheduled: 'bg-blue-500', Remediated: 'bg-emerald-500', Remediating: 'bg-amber-500', Planned: 'bg-slate-500', Compliant: 'bg-emerald-500', 'Not Applicable': 'bg-slate-600', Warning: 'bg-yellow-500', Critical: 'bg-red-500' }
  return <span className={`h-1.5 w-1.5 rounded-full ${colors[status] || 'bg-slate-600'} inline-block`} />
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function AICTOReport() {
  const data = reportData

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        <ExecutiveBanner currentPage="/cto-report" />
        {/* 1. Executive Verdict Hero */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-4 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-500/[0.03] blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-amber-500/[0.02] blur-3xl" />
          <div className="relative flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <svg className="h-3.5 w-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
                </div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-white">AI CTO Executive Report</h1>
                <StatusBadge status="success" label="Q3 2026" />
              </div>
              <p className="text-xs text-slate-500 mb-3">Strategic decision analysis with business impact, engineering cost, ROI projection, and deployment recommendation for: <span className="text-slate-300">{data.feature}</span></p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs font-bold text-emerald-400">BUILD</span>
                  <span className="text-[10px] text-slate-500">— Recommended</span>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] text-slate-500 hover:border-white/[0.12] hover:text-slate-300 transition-all">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Export PDF
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RingGauge value={data.verdict.confidence} size={72} stroke={5} color="#22c55e" label="Decision Confidence" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white"><AnimatedCounter value={data.roi.percentage} suffix="%" /></div>
                <div className="text-[9px] text-slate-500">Projected ROI</div>
                <div className="text-[10px] text-slate-600 mt-1">Breakeven: {data.roi.breakevenHours}h post-deploy</div>
                <div className="text-[9px] text-slate-600">$<AnimatedCounter value={data.roi.monthlySavings} />/mo savings</div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] text-slate-600">Decision Confidence</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden max-w-xs">
              <motion.div initial={{ width: 0 }} animate={{ width: `${data.verdict.confidence}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
            </div>
            <span className="text-xs font-bold text-emerald-400"><AnimatedCounter value={data.verdict.confidence} suffix="%" /></span>
          </div>
        </motion.div>

        {/* 2. Executive Metrics */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-3 text-center">
            <div className="text-lg font-bold text-red-400">{data.riskLevel.score}<span className="text-[10px] text-slate-600 font-normal">/100</span></div>
            <div className="text-[9px] text-slate-500">Risk Score</div>
            <div className="text-[8px] text-slate-600 mt-0.5">{data.riskLevel.level}</div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-3 text-center">
            <div className="text-lg font-bold text-amber-400">{data.businessImpact.businessScore}<span className="text-[10px] text-slate-600 font-normal">/100</span></div>
            <div className="text-[9px] text-slate-500">Impact Score</div>
            <div className="text-[8px] text-slate-600 mt-0.5">Business</div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-3 text-center">
            <div className="text-lg font-bold text-emerald-400"><AnimatedCounter value={data.roi.percentage} suffix="%" /></div>
            <div className="text-[9px] text-slate-500">ROI</div>
            <div className="text-[8px] text-slate-600 mt-0.5">{data.roi.breakevenHours}h breakeven</div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-3 text-center">
            <div className="text-lg font-bold text-white">$<AnimatedCounter value={data.engineeringCost.costUSD / 1000} decimals={1} suffix="K" /></div>
            <div className="text-[9px] text-slate-500">Cost</div>
            <div className="text-[8px] text-slate-600 mt-0.5">{data.engineeringCost.hours} hrs</div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-3 text-center">
            <div className="text-lg font-bold text-cyan-400">{data.verdict.confidence}%</div>
            <div className="text-[9px] text-slate-500">Confidence</div>
            <div className="text-[8px] text-slate-600 mt-0.5">Based on 14 similar features</div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-3 text-center">
            <div className="text-lg font-bold text-violet-400">{data.deploymentWindow.recommended}</div>
            <div className="text-[9px] text-slate-500">Target Date</div>
            <div className="text-[8px] text-slate-600 mt-0.5">Jul 15 recommended</div>
          </div>
        </motion.div>

        {/* 3. Business Impact Analysis */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/20">
              <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Business Impact Analysis</h2>
            <StatusBadge status="warning" label={`Score: ${data.businessImpact.businessScore}%`} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
            <div className="rounded-lg border border-red-500/10 bg-red-500/[0.03] p-3">
              <div className="text-[9px] text-slate-500 mb-0.5">Revenue at Risk</div>
              <div className="text-sm font-bold text-red-400">$<AnimatedCounter value={data.businessImpact.revenueAtRisk} />/hr</div>
              <div className="text-[8px] text-slate-600 mt-0.5">$288K/month worst case incident cost</div>
              <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-red-500" />
              </div>
            </div>
            <div className="rounded-lg border border-orange-500/10 bg-orange-500/[0.03] p-3">
              <div className="text-[9px] text-slate-500 mb-0.5">Customer Impact</div>
              <div className="text-sm font-bold text-orange-400">{data.businessImpact.customerImpact}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">~12,000 transactions/day affected</div>
              <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-orange-500" />
              </div>
            </div>
            <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/[0.03] p-3">
              <div className="text-[9px] text-slate-500 mb-0.5">SLA Violation</div>
              <div className="text-sm font-bold text-yellow-400">{data.businessImpact.slaViolation}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">45 min exceeds 15 min SLA threshold</div>
              <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-yellow-500" />
              </div>
            </div>
            <div className="rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] p-3">
              <div className="text-[9px] text-slate-500 mb-0.5">Regulatory</div>
              <div className="text-sm font-bold text-cyan-400">{data.businessImpact.regulatory}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Level 1 compliance requirement</div>
              <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-cyan-500" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <AnimatedScoreBar value={data.businessImpact.businessScore} label="Business Score" sublabel={`${data.businessImpact.businessScore}%`} color="bg-gradient-to-r from-amber-500 to-orange-500" delay={0} />
            <AnimatedScoreBar value={92} label="Revenue Exposure" sublabel="$12K/hr" color="bg-gradient-to-r from-red-500 to-red-600" delay={100} />
            <AnimatedScoreBar value={78} label="Customer Reach" sublabel="All payment flows" color="bg-gradient-to-r from-orange-500 to-red-500" delay={200} />
            <AnimatedScoreBar value={65} label="Compliance Risk" sublabel="PCI DSS v4.0" color="bg-gradient-to-r from-cyan-500 to-brand" delay={300} />
          </div>
        </motion.div>

        {/* 4. Engineering Cost Breakdown */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand/20">
              <svg className="h-3.5 w-3.5 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Engineering Cost Breakdown</h2>
            <StatusBadge status="info" label={`Total: $${data.engineeringCost.costUSD.toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
              <div className="text-lg font-bold text-white">{data.engineeringCost.hours}</div>
              <div className="text-[9px] text-slate-600">Total Hours</div>
              <div className="text-[8px] text-slate-700">136 hrs across 3 sprints</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-brand" />
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
              <div className="text-lg font-bold text-white">{data.engineeringCost.engineers}</div>
              <div className="text-[9px] text-slate-600">Engineers</div>
              <div className="text-[8px] text-slate-700">3 teams involved</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '57%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-amber-500" />
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
              <div className="text-lg font-bold text-white">{data.engineeringCost.sprints}</div>
              <div className="text-[9px] text-slate-600">Sprints</div>
              <div className="text-[8px] text-slate-700">2-week iterations</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '43%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-violet-500" />
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
              <div className="text-lg font-bold text-amber-300">{data.engineeringCost.storyPoints}</div>
              <div className="text-[9px] text-slate-600">Story Points</div>
              <div className="text-[8px] text-slate-700">Avg 8.5 SP/engineer</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '49%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-amber-500" />
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
              <div className="text-lg font-bold text-emerald-400">$103</div>
              <div className="text-[9px] text-slate-600">$/hr Blended</div>
              <div className="text-[8px] text-slate-700">Including overhead</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-2">
            {data.costBreakdown.map((p, i) => (
              <div key={p.phase}>
                <div className="flex items-center justify-between mb-0.5">
                  <div>
                    <span className="text-[10px] text-slate-400">{p.phase}</span>
                    <span className="text-[8px] text-slate-600 ml-1">— {p.deliverables}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{p.hours}h (${p.cost.toLocaleString()})</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${i === 1 ? 'bg-brand' : i === 2 ? 'bg-amber-500' : i === 3 ? 'bg-red-500' : i === 4 ? 'bg-violet-500' : 'bg-slate-500'}`} />
                </div>
              </div>
            ))}
          </div>
          <AnimatedScoreBar value={data.engineeringCost.costScore} label="Cost Efficiency Score" sublabel={`${data.engineeringCost.costScore}%`} color="bg-gradient-to-r from-brand to-violet-500" delay={0} />
        </motion.div>

        {/* 5. Resource Allocation & Dependencies */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20">
              <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Resource Allocation & Dependencies</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] text-slate-500 mb-1.5">Staffing Needs</div>
              {data.resourceAllocation.map((r, i) => (
                <div key={r.resource} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] text-slate-400 w-36 shrink-0">{r.resource}</span>
                  <div className="flex items-center gap-1 flex-1">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(r.allocated / r.needed) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                        className={`h-full rounded-full ${r.gap > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    </div>
                    <span className="text-[9px] text-slate-500 w-10 text-right">{r.allocated}/{r.needed}</span>
                    {r.gap > 0 && <span className="text-[8px] text-red-400 font-bold">-{r.gap}</span>}
                    {r.gap === 0 && <span className="text-[8px] text-emerald-400">OK</span>}
                  </div>
                  <span className="text-[7px] text-slate-600 w-20 text-right truncate">{r.recruiting}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[9px] text-slate-500 mb-1.5">External Dependencies</div>
              {data.dependencyGraph.map((d, i) => (
                <div key={d.dependency} className="flex items-center gap-2 mb-1.5">
                  <StatusDot status={d.status} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-slate-300 truncate">{d.dependency}</div>
                    <div className="text-[8px] text-slate-500">{d.owner} · Resolution: {d.resolution}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {d.criticalPath && <span className="text-[7px] text-red-400 font-bold">CP</span>}
                    <StatusBadge status={d.risk === 'High' ? 'critical' : d.risk === 'Medium' ? 'warning' : 'info'} label={d.risk} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 6. Risk Assessment Matrix */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/20">
              <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Risk Assessment Matrix</h2>
            <StatusBadge status="warning" label={`Score: ${data.riskLevel.score}/100 - ${data.riskLevel.level}`} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
            <div className="rounded-lg border border-red-500/10 bg-red-500/[0.03] p-3 text-center">
              <div className="text-lg font-bold text-red-400">{data.riskLevel.criticalRisks}</div>
              <div className="text-[9px] text-slate-500">Critical Risks</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Requires immediate action</div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(data.riskLevel.criticalRisks / 10) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-red-500" />
              </div>
            </div>
            <div className="rounded-lg border border-orange-500/10 bg-orange-500/[0.03] p-3 text-center">
              <div className="text-lg font-bold text-orange-400">{data.riskLevel.highRisks}</div>
              <div className="text-[9px] text-slate-500">High Risks</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Mitigation in progress</div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(data.riskLevel.highRisks / 10) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-orange-500" />
              </div>
            </div>
            <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/[0.03] p-3 text-center">
              <div className="text-lg font-bold text-yellow-400">{data.riskLevel.mediumRisks}</div>
              <div className="text-[9px] text-slate-500">Medium Risks</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Scheduled for mitigation</div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(data.riskLevel.mediumRisks / 10) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-yellow-500" />
              </div>
            </div>
            <div className="rounded-lg border border-green-500/10 bg-green-500/[0.03] p-3 text-center">
              <div className="text-lg font-bold text-green-400">{8 - data.riskLevel.criticalRisks - data.riskLevel.highRisks - data.riskLevel.mediumRisks}</div>
              <div className="text-[9px] text-slate-500">Low Risks</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Resolved or accepted</div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${((10 - data.riskLevel.criticalRisks - data.riskLevel.highRisks - data.riskLevel.mediumRisks) / 10) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-green-500" />
              </div>
            </div>
          </div>
          <div className="space-y-1.5 mb-2">
            {data.riskByService.map((r, i) => (
              <div key={r.service} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-24 shrink-0">{r.service}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.score}%` }} transition={{ duration: 0.8, delay: i * 0.06 }}
                    className={`h-full rounded-full ${r.color === 'red' ? 'bg-red-500' : r.color === 'orange' ? 'bg-orange-500' : r.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                </div>
                <span className="text-[10px] font-medium text-white w-8 text-right">{r.score}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {data.riskCategories.map((rc, i) => (
              <div key={rc.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-white truncate">{rc.name}</span>
                  <StatusBadge status={rc.mitigation === 'Active' ? 'success' : rc.mitigation === 'In Progress' ? 'info' : rc.mitigation === 'Planned' ? 'warning' : 'default'} label={rc.mitigation === 'Resolved' ? 'Done' : rc.mitigation} />
                </div>
                <div className="flex items-center justify-between text-[8px] text-slate-500">
                  <span>{rc.service}</span>
                  <span className={`font-semibold ${rc.severity === 'Critical' ? 'text-red-400' : rc.severity === 'High' ? 'text-orange-400' : rc.severity === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{rc.score} · {rc.severity}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[7px] text-slate-600">
                  <span>Detection: {rc.detectionTime}</span>
                  <span>·</span>
                  <span>RTO: {rc.rto}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 7. Security & Compliance */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20">
              <svg className="h-3.5 w-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Security & Compliance Review</h2>
            <StatusBadge status="warning" label="2 findings open" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] text-slate-500 mb-1.5">Security Findings</div>
              <div className="space-y-1">
                {data.securityFindings.map((sf, i) => (
                  <div key={sf.finding} className="flex items-center gap-2">
                    <StatusDot status={sf.status} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-slate-300 truncate">{sf.finding}</div>
                      <div className="text-[8px] text-slate-500">Fix: {sf.fixEffort} · {sf.owner} · Due: {sf.dueDate}</div>
                    </div>
                    <StatusBadge status={sf.severity === 'Critical' ? 'critical' : sf.severity === 'High' ? 'warning' : sf.severity === 'Medium' ? 'info' : 'default'} label={sf.severity} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-slate-500 mb-1.5">Compliance Status</div>
              <div className="space-y-1">
                {data.complianceChecks.map((c, i) => (
                  <div key={c.standard} className="flex items-center gap-2">
                    <StatusDot status={c.status} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-slate-300 truncate">{c.standard}</div>
                      <div className="text-[8px] text-slate-500">{c.owner} · {c.required ? 'Required' : 'Optional'}{c.deadline !== 'N/A' ? ` · Deadline: ${c.deadline}` : ''}</div>
                    </div>
                    <StatusBadge status={c.status === 'Compliant' ? 'success' : c.status === 'In Progress' ? 'info' : 'default'} label={c.status === 'Not Applicable' ? 'N/A' : c.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 8. ROI Projection Engine */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20">
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">ROI Projection Engine</h2>
            <StatusBadge status="success" label={`${data.roi.percentage}% ROI`} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] p-3 text-center">
              <div className="text-lg font-bold text-emerald-400"><AnimatedCounter value={data.roi.percentage} suffix="%" /></div>
              <div className="text-[9px] text-slate-500">Projected ROI</div>
              <div className="text-[8px] text-slate-600 mt-0.5">12-month horizon</div>
            </div>
            <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] p-3 text-center">
              <div className="text-lg font-bold text-emerald-400"><AnimatedCounter value={data.roi.breakevenHours} decimals={1} suffix="h" /></div>
              <div className="text-[9px] text-slate-500">Breakeven Time</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Post-deployment</div>
            </div>
            <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] p-3 text-center">
              <div className="text-lg font-bold text-emerald-400">$<AnimatedCounter value={Math.round(data.roi.monthlySavings / 1000)} suffix="K" /></div>
              <div className="text-[9px] text-slate-500">Monthly Savings</div>
              <div className="text-[8px] text-slate-600 mt-0.5">At steady state</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
              <div className="text-lg font-bold text-white">$<AnimatedCounter value={Math.round(data.roi.investment / 1000)} suffix="K" /></div>
              <div className="text-[9px] text-slate-500">Investment</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Upfront cost</div>
            </div>
          </div>
          <div className="relative mb-3">
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(data.roi.percentage, 100)}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 relative">
                <div className="absolute right-1 top-0.5 text-[7px] font-bold text-white drop-shadow-lg"><AnimatedCounter value={data.roi.percentage} suffix="%" /></div>
              </motion.div>
            </div>
            <div className="absolute -top-3 left-[100%] ml-1 hidden sm:block">
              <div className="text-[7px] text-slate-600 whitespace-nowrap">Target: 100% ROI = Breakeven</div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
            {data.monthlyProjection.map((m, i) => (
              <div key={m.month} className="rounded border border-white/[0.06] bg-white/[0.02] p-1.5 text-center">
                <div className="text-[8px] text-slate-500 mb-0.5">{m.month}</div>
                <div className="text-[10px] font-semibold text-white">${(m.savings / 1000).toFixed(0)}K</div>
                <div className="h-1 rounded-full bg-slate-800 mt-1 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(m.cumulative / 2800000) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.02 }}
                    className={`h-full rounded-full ${m.cumulative >= 14000 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
                <div className="text-[7px] text-slate-600 mt-0.5">${(m.cumulative / 1000).toFixed(0)}K total</div>
                <div className="text-[7px] text-slate-700">{m.events} events prevented</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 9. Monitoring & Alerting */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/20">
              <svg className="h-3.5 w-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 00-8.5 1.5m0 0l-1.25 1.5m1.25-1.5h.008v.008H5.5v-.008zm12 10.5a4.5 4.5 0 008.5-1.5m0 0l1.25-1.5m-1.25 1.5h-.008v-.008h.008v.008zM10.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm10.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM3 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Monitoring & Alerting</h2>
            <StatusBadge status="info" label="5 alert rules" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {data.monitoringAlerts.map((ma, i) => (
              <div key={ma.metric} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] font-medium text-white mb-0.5">{ma.metric}</div>
                <div className="text-[8px] text-slate-400 mb-1">Threshold: {ma.threshold}</div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={ma.severity === 'Critical' ? 'critical' : 'warning'} label={ma.severity} />
                  <span className="text-[7px] text-slate-600 ml-auto">{ma.response}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[8px] text-slate-600">
            <span className="font-medium text-slate-500">Observability:</span>
            <span>{data.deploymentConfig.observability}</span>
            <span className="mx-1">|</span>
            <span className="font-medium text-slate-500">Window:</span>
            <span>{data.deploymentConfig.metricsWindow}</span>
          </div>
        </motion.div>

        {/* 10. Deployment Planning */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20">
              <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Deployment Planning</h2>
            <StatusBadge status="success" label={`${data.deploymentWindow.confidence} Confidence`} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 mb-3">
            <div className="text-center">
              <div className="text-[9px] text-slate-600">Earliest</div>
              <div className="text-sm font-bold text-white">{data.deploymentWindow.earliest}</div>
              <div className="text-[8px] text-slate-700">Aggressive timeline</div>
            </div>
            <div className="text-slate-700 text-lg">→</div>
            <div className="text-center">
              <div className="text-[9px] text-slate-600">Recommended</div>
              <div className="text-sm font-bold text-emerald-400">{data.deploymentWindow.recommended}</div>
              <div className="text-[8px] text-emerald-500/50">Target launch date</div>
            </div>
            <div className="text-slate-700 text-lg">→</div>
            <div className="text-center">
              <div className="text-[9px] text-slate-600">Latest</div>
              <div className="text-sm font-bold text-white">{data.deploymentWindow.latest}</div>
              <div className="text-[8px] text-slate-700">Hard deadline</div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-500 mb-0.5">Strategy</div>
              <div className="text-[10px] font-medium text-white truncate">{data.deploymentConfig.strategy}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Progressive roll-out pattern</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-500 mb-0.5">Rollback Plan</div>
              <div className="text-[10px] font-medium text-white leading-tight truncate">{data.deploymentConfig.rollbackPlan}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Automated trigger conditions</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-500 mb-0.5">Canary Steps</div>
              <div className="text-[10px] font-medium text-white truncate">{data.deploymentConfig.canarySteps}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">{data.deploymentConfig.canaryDuration}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-500 mb-0.5">Blast Radius</div>
              <div className="text-[10px] font-medium text-white truncate">{data.deploymentConfig.blastRadius}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Isolated canary cluster</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {data.environmentMatrix.map((e, i) => (
              <div key={e.env} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={e.status} />
                    <span className="text-[10px] font-medium text-white">{e.env}</span>
                  </div>
                  <div className="text-[8px] text-slate-500 mt-0.5">Config: {e.config} · Data: {e.dataVolume}</div>
                  <div className="text-[7px] text-slate-600">Access: {e.access} · Refresh: {e.refreshRate}</div>
                </div>
                <StatusBadge status={e.status === 'Ready' || e.status === 'Live' ? 'success' : e.status === 'Provisioning' ? 'info' : 'default'} label={e.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* 11. Team Readiness Center */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20">
              <svg className="h-3.5 w-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Team Readiness Center</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {data.teamReadiness.map((t, i) => (
              <div key={t.team} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${t.confidence === 'Ready' ? 'bg-green-500' : t.confidence === 'On Track' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-medium text-white">{t.team}</span>
                  </div>
                  <StatusBadge status={t.confidence === 'Ready' ? 'success' : t.confidence === 'On Track' ? 'info' : 'warning'} label={t.confidence} />
                </div>
                <div className="space-y-1.5">
                  <AnimatedScoreBar value={t.readiness} label="Readiness" sublabel={`${t.readiness}%`} color={t.readiness >= 80 ? 'bg-green-500' : t.readiness >= 60 ? 'bg-yellow-500' : 'bg-red-500'} delay={i * 100} />
                  <AnimatedScoreBar value={t.load} label="Current Load" sublabel={`${t.load}%`} color={t.load >= 80 ? 'bg-red-500' : t.load >= 60 ? 'bg-yellow-500' : 'bg-green-500'} delay={i * 150} />
                  <AnimatedScoreBar value={t.capacityRemaining} label="Capacity Remaining" sublabel={`${t.capacityRemaining}%`} color={t.capacityRemaining >= 50 ? 'bg-green-500' : t.capacityRemaining >= 25 ? 'bg-yellow-500' : 'bg-red-500'} delay={i * 200} />
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                  <span className="text-[8px] text-slate-600">{t.members} members · {t.sprintVelocity} SP/sprint</span>
                </div>
                <div className="text-[8px] text-slate-500 mt-0.5">Focus: {t.focusArea}</div>
                <div className="mt-1.5">
                  <span className={`text-[8px] font-medium ${t.load >= 80 ? 'text-red-400' : t.load >= 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {t.load >= 80 ? 'ACTION: Add 1 contractor for Sprint 2 workload' : t.load >= 60 ? 'MONITOR: Capacity adequate, watch for scope creep' : 'READY: Available for additional work'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 12. Cost-Benefit Analysis */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20">
              <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Cost-Benefit Analysis</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-lg border border-red-500/10 bg-red-500/[0.03] p-3">
              <div className="text-[9px] text-slate-500 mb-0.5">Investment (Cost)</div>
              <div className="text-lg font-bold text-red-400">$<AnimatedCounter value={data.engineeringCost.costUSD} /></div>
              <div className="text-[8px] text-slate-600 mt-0.5">One-time engineering cost</div>
              <div className="mt-2 space-y-1">
                {data.costBreakdown.map((c, i) => (
                  <div key={c.phase} className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-slate-600 shrink-0" />
                    <span className="text-[8px] text-slate-500 flex-1 truncate">{c.phase}</span>
                    <span className="text-[8px] text-slate-400">${c.cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-red-500/10 flex items-center justify-between">
                <span className="text-[8px] text-slate-500">Total</span>
                <span className="text-[10px] font-bold text-red-400">$14,000</span>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] p-3">
              <div className="text-[9px] text-slate-500 mb-0.5">Projected Savings (Benefit)</div>
              <div className="text-lg font-bold text-emerald-400">$<AnimatedCounter value={data.roi.monthlySavings} />/mo</div>
              <div className="text-[8px] text-slate-600 mt-0.5">$2.8M+ over 12 months</div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[8px] text-slate-500 flex-1">Revenue protected (incident prevention)</span>
                  <span className="text-[8px] text-emerald-400">$288K/mo</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[8px] text-slate-500 flex-1">SLA penalty avoidance</span>
                  <span className="text-[8px] text-emerald-400">$12K/mo</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[8px] text-slate-500 flex-1">Operational efficiency (reduced toil)</span>
                  <span className="text-[8px] text-emerald-400">$18K/mo</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-emerald-500/10 flex items-center justify-between">
                <span className="text-[8px] text-slate-500">Monthly total</span>
                <span className="text-[10px] font-bold text-emerald-400">$318K/mo</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="text-[9px] text-slate-500 mb-2">Breakeven Timeline — Cumulative Savings vs $14K Investment</div>
            <div className="space-y-1">
              {data.monthlyProjection.map((m, i) => (
                <div key={m.month} className="flex items-center gap-2">
                  <span className="text-[8px] text-slate-600 w-5">{m.month}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden relative">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((m.cumulative / data.engineeringCost.costUSD) * 15, 100)}%` }} transition={{ duration: 0.5, delay: i * 0.02 }}
                      className={`h-full rounded-full ${m.cumulative >= data.engineeringCost.costUSD ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                  <span className="text-[8px] text-slate-400 w-14 text-right">${(m.cumulative / 1000).toFixed(0)}K</span>
                  {m.cumulative >= data.engineeringCost.costUSD && <span className="text-[7px] text-emerald-400 font-bold">BREAKEVEN</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 13. Timeline & Milestones */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20">
              <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Timeline & Milestones</h2>
            <StatusBadge status="info" label="5 milestones across 4 phases" />
          </div>
          <div className="space-y-2">
            {data.milestones.map((m, i) => (
              <div key={m.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${m.status === 'Complete' ? 'bg-emerald-500' : m.status === 'In Progress' ? 'bg-amber-500' : m.status === 'At Risk' ? 'bg-red-500' : 'bg-slate-600'}`} />
                    <span className="text-xs font-medium text-white">{m.name}</span>
                    <StatusBadge status={m.status === 'Complete' ? 'success' : m.status === 'In Progress' ? 'info' : m.status === 'At Risk' ? 'critical' : 'default'} label={m.status} />
                    <span className="text-[8px] text-slate-600">({m.phase})</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{m.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex-1">
                    <MilestoneBar progress={m.progress} status={m.status} />
                  </div>
                  <span className="text-[9px] text-slate-500 w-8 text-right">{m.progress}%</span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-slate-500">
                  <span>Owner: {m.owner}</span>
                  <span className="truncate max-w-[240px]">{m.blockers}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 14. AI Recommendations */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20">
              <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">AI Recommendations</h2>
            <StatusBadge status="critical" label="2 P0 · 3 P1 · 2 P2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {data.aiRecommendations.map((r, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <StatusBadge status={r.priority === 'P0' ? 'critical' : r.priority === 'P1' ? 'warning' : 'default'} label={r.priority} />
                  <span className="text-[9px] text-slate-500">{r.owner} · {r.effort}</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed mb-1">{r.action}</p>
                <p className="text-[8px] text-slate-500 mb-1">Impact: {r.impact}</p>
                <p className="text-[7px] text-slate-600 mb-1.5">Why: {r.rationale}</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${r.confidence}%` }} transition={{ duration: 1, delay: i * 0.08 }}
                      className={`h-full rounded-full ${r.confidence >= 90 ? 'bg-emerald-500' : r.confidence >= 80 ? 'bg-amber-500' : 'bg-orange-500'}`} />
                  </div>
                  <span className="text-[8px] text-slate-500">{r.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 15. Risk Mitigation Plan */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20">
              <svg className="h-3.5 w-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Risk Mitigation Plan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.mitigationPlans.map((mp, i) => (
              <div key={mp.risk} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-medium text-white">{mp.risk}</span>
                  <StatusBadge status={mp.severity === 'Critical' ? 'critical' : mp.severity === 'High' ? 'warning' : 'info'} label={mp.severity} />
                </div>
                <p className="text-[9px] text-slate-400 mb-1.5 leading-relaxed">{mp.strategy}</p>
                <div className="flex items-center justify-between text-[8px] text-slate-500 mb-1.5">
                  <span>Owner: {mp.owner}</span>
                  <span>Timeline: {mp.timeline}</span>
                  <span>Cost: ${mp.costImpact.toLocaleString()}</span>
                </div>
                <p className="text-[8px] text-slate-600 mb-1.5">Success metric: {mp.successMetric}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-slate-500 w-16">Reduction</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${mp.reduction}%` }} transition={{ duration: 1, delay: i * 0.15 }}
                      className={`h-full rounded-full ${mp.reduction >= 85 ? 'bg-emerald-500' : mp.reduction >= 70 ? 'bg-amber-500' : 'bg-orange-500'}`} />
                  </div>
                  <span className="text-[8px] font-medium text-white w-8 text-right">{mp.reduction}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 16. What-If Scenario Analysis */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20">
              <svg className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">What-If Scenario Analysis</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {data.scenarios.map((s, i) => (
              <div key={s.name} className={`rounded-lg border p-3 ${i === 1 ? 'border-amber-500/20 bg-amber-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{s.name}</span>
                  <span className="text-[8px] text-slate-500">{s.probability}% probability</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">Risk Reduction</span>
                    <span className="text-[10px] font-medium text-white">{s.riskReduction}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.riskReduction}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full rounded-full ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-amber-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">ROI</span>
                    <span className={`text-[10px] font-medium ${i === 0 ? 'text-emerald-400' : i === 1 ? 'text-amber-400' : 'text-red-400'}`}>{s.roi}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">Upfront Cost</span>
                    <span className="text-[10px] font-medium text-white">${(s.cost / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">Timeline</span>
                    <span className="text-[10px] font-medium text-white">{s.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">Year 1 Savings</span>
                    <span className="text-[10px] font-medium text-white">$<AnimatedCounter value={Math.round(s.savingsYear1 / 1000000)} decimals={1} suffix="M" delay={i * 200} /></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">Residual Risk</span>
                    <span className="text-[10px] font-medium text-white">{s.riskScore}/100</span>
                  </div>
                </div>
                {i === 1 && <div className="mt-2 pt-2 border-t border-amber-500/10 text-center">
                  <span className="text-[8px] text-amber-400 font-medium">Most Likely Scenario</span>
                </div>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 17. Communication Plan */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-500/20">
              <svg className="h-3.5 w-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Communication Plan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
            {data.communicationPlan.map((cp, i) => (
              <div key={cp.stakeholder} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] font-medium text-white mb-0.5">{cp.stakeholder}</div>
                <div className="text-[8px] text-slate-400">{cp.channel}</div>
                <div className="text-[8px] text-slate-500 mt-0.5">Frequency: {cp.frequency}</div>
                <div className="text-[8px] text-slate-500">Owner: {cp.owner}</div>
                <div className="text-[7px] text-slate-600 mt-0.5">Format: {cp.format}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 18. Technical Debt Impact */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-500/20">
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Technical Debt Impact</h2>
            <StatusBadge status="info" label="23 days total" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
              <div className="text-lg font-bold text-white">{data.technicalDebt.currentDebtDays}</div>
              <div className="text-[9px] text-slate-500">Current Debt (days)</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Across 5 categories</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-amber-500" />
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
              <div className="text-lg font-bold text-emerald-400">{data.technicalDebt.projectedDebtDays}</div>
              <div className="text-[9px] text-slate-500">Projected Debt</div>
              <div className="text-[8px] text-slate-600 mt-0.5">After this project's cleanup</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(data.technicalDebt.projectedDebtDays / data.technicalDebt.currentDebtDays) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
              <div className="text-lg font-bold text-amber-400">{data.technicalDebt.debtReductionPct}%</div>
              <div className="text-[9px] text-slate-500">Debt Reduction</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Effective cleanup impact</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${data.technicalDebt.debtReductionPct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-amber-500" />
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
              <div className="text-lg font-bold text-white">{Math.round((data.technicalDebt.codeQuality + data.technicalDebt.testCoverage + data.technicalDebt.docScore) / 3)}</div>
              <div className="text-[9px] text-slate-500">Quality Index</div>
              <div className="text-[8px] text-slate-600 mt-0.5">Average of 3 dimensions</div>
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((data.technicalDebt.codeQuality + data.technicalDebt.testCoverage + data.technicalDebt.docScore) / 3)}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-violet-500" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <AnimatedScoreBar value={data.technicalDebt.codeQuality} label="Code Quality Score" sublabel={`${data.technicalDebt.codeQuality}%`} color="bg-gradient-to-r from-amber-500 to-orange-500" delay={0} />
            <AnimatedScoreBar value={data.technicalDebt.testCoverage} label="Test Coverage" sublabel={`${data.technicalDebt.testCoverage}%`} color="bg-gradient-to-r from-red-500 to-red-600" delay={100} />
            <AnimatedScoreBar value={data.technicalDebt.docScore} label="Documentation Score" sublabel={`${data.technicalDebt.docScore}%`} color="bg-gradient-to-r from-cyan-500 to-brand" delay={200} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1.5">
            {data.technicalDebt.categories.map((d, i) => (
              <div key={d.area} className="rounded border border-white/[0.06] bg-white/[0.02] p-2 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-medium text-white truncate">{d.area}</div>
                  <div className="flex items-center gap-1.5 text-[8px] text-slate-500">
                    <span>{d.days} days effort</span>
                    <span>·</span>
                    <StatusBadge status={d.priority === 'P1' ? 'warning' : d.priority === 'P2' ? 'info' : 'default'} label={d.priority} />
                  </div>
                  <div className="text-[7px] text-slate-600 mt-0.5 truncate">{d.resolution}</div>
                </div>
                <StatusBadge status={d.severity === 'High' ? 'warning' : d.severity === 'Medium' ? 'info' : 'default'} label={d.severity} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* 19. Final Executive Decision */}
        <motion.div variants={item} className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20">
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-sm font-bold text-white">Final Executive Decision</h2>
            <StatusBadge status="success" label={data.recommendation.decision} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-2">
            <div className="lg:col-span-2">
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{data.recommendation.reasoning}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-brand/10 bg-brand/[0.03] p-2.5">
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="h-3 w-3 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <span className="text-[9px] font-semibold text-brand-light">Team Readiness Note</span>
                  </div>
                  <p className="text-[9px] text-slate-400">{data.recommendation.teamReadiness}</p>
                </div>
                <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/[0.03] p-2.5">
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="h-3 w-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    <span className="text-[9px] font-semibold text-yellow-400">Alternative Considered</span>
                  </div>
                  <p className="text-[9px] text-slate-400">{data.recommendation.alternative}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                <div className="text-[9px] text-slate-500 mb-1">Decision Confidence</div>
                <RingGauge value={data.verdict.confidence} size={60} stroke={4} color="#22c55e" />
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                <div className="text-[9px] text-slate-500 mb-1">Risk/Reward Ratio</div>
                <div className="text-lg font-bold text-amber-400">1:{Math.round(data.roi.percentage / data.riskLevel.score * 100) / 100}</div>
                <div className="text-[8px] text-slate-500">Reward per risk point</div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-[8px] text-slate-500">
                  <span>Verdict:</span>
                  <StatusBadge status="success" label={data.verdict.shouldBuild ? 'BUILD' : 'REJECT'} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
            <span className="text-[9px] text-slate-500">Decision confidence</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden max-w-md">
              <motion.div initial={{ width: 0 }} animate={{ width: `${data.verdict.confidence}%` }} transition={{ duration: 1.2 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400"><AnimatedCounter value={data.verdict.confidence} suffix="%" /></span>
          </div>
        </motion.div>

        <NarrativeCTA currentPage="/cto-report" confidence={87} impact="$288K monthly savings" />
      </motion.div>
    </Layout>
  )
}
