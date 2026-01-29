// Enhanced Deliverable Definitions for ZTA Assessments
// Provides clear guidance on what to create, how to create it, and examples

export interface DeliverableDetail {
  id: string;
  name: string;
  description: string;
  purpose: string;
  format: string;
  estimatedTime: string;
  template?: string; // Path to template or template content
  exampleContent?: string[];
  tips: string[];
  acceptanceCriteria: string[];
}

export const deliverableDetails: Record<string, DeliverableDetail> = {
  // Phase 0: Preparation
  'exec-sponsor-doc': {
    id: 'exec-sponsor-doc',
    name: 'Executive Sponsor Documentation',
    description: 'Document identifying the executive sponsor and their commitment to the ZTA assessment',
    purpose: 'Establish executive buy-in and authority for the assessment',
    format: 'Document (Word/PDF) or Email confirmation',
    estimatedTime: '30 minutes',
    template: '/ZTA-Suite/templates/Executive_Sponsor_Template.md',
    exampleContent: [
      'Sponsor Name: John Smith, Chief Information Officer',
      'Commitment: Full support for 24-week assessment',
      'Authority: Approve budget and resource allocation',
      'Availability: Weekly steering committee meetings'
    ],
    tips: [
      'Get written confirmation via email or signed memo',
      'Include sponsor in kickoff meeting',
      'Schedule regular check-ins with sponsor',
      'Document sponsor\'s authority level'
    ],
    acceptanceCriteria: [
      'Sponsor name and title documented',
      'Written commitment obtained',
      'Sponsor authority level clarified',
      'Communication plan with sponsor established'
    ]
  },
  
  'scope-document': {
    id: 'scope-document',
    name: 'Assessment Scope Document',
    description: 'Comprehensive document defining what is in-scope and out-of-scope for the ZTA assessment',
    purpose: 'Establish clear boundaries and prevent scope creep',
    format: 'Document (5-10 pages)',
    estimatedTime: '4-6 hours',
    template: '/ZTA-Suite/templates/Assessment_Scope_Template.md',
    exampleContent: [
      'In-Scope: Corporate network, cloud environments (AWS, Azure), 5,000 employees',
      'Out-of-Scope: Legacy mainframe systems (scheduled for decommission)',
      'Data Types: Customer PII, financial data, intellectual property',
      'Geographic Regions: North America, Europe'
    ],
    tips: [
      'Be specific about systems and applications',
      'Document exclusions with business justification',
      'Get stakeholder sign-off on scope',
      'Include scope change control process'
    ],
    acceptanceCriteria: [
      'All in-scope systems identified',
      'Out-of-scope items documented with justification',
      'Data types classified',
      'Stakeholders have approved scope'
    ]
  },

  'system-inventory': {
    id: 'system-inventory',
    name: 'System & Application Inventory',
    description: 'Detailed list of all systems and applications within assessment scope',
    purpose: 'Create baseline of assets to be assessed',
    format: 'Spreadsheet (Excel) with columns for system name, owner, criticality, environment',
    estimatedTime: '6-8 hours',
    exampleContent: [
      'System: Salesforce CRM | Owner: Sales Ops | Criticality: High | Cloud: SaaS',
      'System: HR Portal | Owner: HR Dept | Criticality: Medium | Cloud: Azure',
      'System: File Server | Owner: IT Ops | Criticality: Low | On-Prem'
    ],
    tips: [
      'Use existing CMDB or asset inventory as starting point',
      'Include cloud and on-premises systems',
      'Identify system owners for each entry',
      'Classify by business criticality'
    ],
    acceptanceCriteria: [
      'All in-scope systems listed',
      'Owners identified for each system',
      'Business criticality assigned',
      'Inventory reviewed by IT leadership'
    ]
  },

  'stakeholder-register': {
    id: 'stakeholder-register',
    name: 'Stakeholder Register & RACI Matrix',
    description: 'List of key stakeholders with roles, responsibilities, and contact information',
    purpose: 'Ensure all necessary parties are engaged in the assessment',
    format: 'Spreadsheet with stakeholder details and RACI matrix',
    estimatedTime: '2-3 hours',
    template: '/ZTA-Suite/templates/RACI_Matrix_Template.md',
    exampleContent: [
      'CISO - Accountable for assessment outcomes',
      'Security Architect - Responsible for technical analysis',
      'Network Manager - Consulted on network segmentation',
      'Application Owners - Informed of findings'
    ],
    tips: [
      'Include executive sponsor, technical leads, and business owners',
      'Define RACI for each assessment activity',
      'Get stakeholder availability commitments',
      'Identify backup contacts'
    ],
    acceptanceCriteria: [
      'All key stakeholders identified',
      'RACI matrix completed',
      'Contact information verified',
      'Stakeholder availability confirmed'
    ]
  },

  'assessment-schedule': {
    id: 'assessment-schedule',
    name: 'Assessment Timeline & Schedule',
    description: 'Detailed schedule showing assessment phases, interviews, milestones, and deliverables',
    purpose: 'Keep assessment on track and manage stakeholder expectations',
    format: 'Gantt chart or calendar (Project file, Excel, or calendar invites)',
    estimatedTime: '3-4 hours',
    exampleContent: [
      'Week 1-2: Preparation & Kickoff',
      'Week 3-6: Discovery interviews (Identity, Network, Applications)',
      'Week 7-12: Technical assessment & capability mapping',
      'Week 13-16: Gap analysis & risk assessment',
      'Week 17-22: Roadmap development',
      'Week 23-24: Final report & executive readout'
    ],
    tips: [
      'Build in buffer time for delays',
      'Coordinate with stakeholder calendars',
      'Schedule critical interviews early',
      'Set clear milestone dates'
    ],
    acceptanceCriteria: [
      'All phases scheduled with dates',
      'Interview slots reserved',
      'Milestones defined',
      'Stakeholders have accepted calendar invites'
    ]
  },

  'kickoff-presentation': {
    id: 'kickoff-presentation',
    name: 'Kickoff Meeting Presentation',
    description: 'Slide deck introducing the assessment, objectives, scope, and schedule',
    purpose: 'Align all stakeholders on assessment approach and expectations',
    format: 'PowerPoint/Google Slides (15-20 slides)',
    estimatedTime: '3-4 hours',
    exampleContent: [
      'Slide 1: Welcome & Introductions',
      'Slide 2: Assessment Objectives',
      'Slide 3: Zero Trust Overview',
      'Slide 4: Scope & Timeline',
      'Slide 5: Stakeholder Roles',
      'Slide 6: Interview Schedule',
      'Slide 7: Next Steps & Q&A'
    ],
    tips: [
      'Keep slides concise and visual',
      'Include CISA ZTMM overview',
      'Highlight stakeholder commitments needed',
      'Record meeting for those who can\'t attend'
    ],
    acceptanceCriteria: [
      'Presentation covers objectives, scope, timeline',
      'Delivered to all stakeholders',
      'Questions answered',
      'Meeting notes documented'
    ]
  },

  // Phase 1: Discovery
  'interview-notes': {
    id: 'interview-notes',
    name: 'SME Interview Notes',
    description: 'Structured notes from interviews with subject matter experts',
    purpose: 'Capture current state capabilities and pain points',
    format: 'Interview notes template per SME',
    estimatedTime: '1-2 hours per interview',
    template: '/ZTA-Suite/templates/Interview_Notes_Template.md',
    exampleContent: [
      'Interviewee: Jane Doe, Identity Manager',
      'Current State: Active Directory with ADFS, MFA for VPN only',
      'Gaps: No MFA for internal apps, no adaptive auth',
      'Pain Points: Password reset requests overwhelming helpdesk',
      'Opportunities: Moving to Azure AD, deploying Conditional Access'
    ],
    tips: [
      'Send questions in advance',
      'Record interview (with permission)',
      'Focus on current state, not desired state',
      'Ask for examples and evidence'
    ],
    acceptanceCriteria: [
      'Notes capture current capabilities',
      'Gaps and challenges identified',
      'Evidence collected or requested',
      'Follow-up actions documented'
    ]
  },

  'architecture-diagrams': {
    id: 'architecture-diagrams',
    name: 'Current State Architecture Diagrams',
    description: 'Visual diagrams showing network topology, identity flow, data flow, and application architecture',
    purpose: 'Document as-is architecture for gap analysis',
    format: 'Visio, Draw.io, or Lucidchart diagrams',
    estimatedTime: '8-12 hours',
    exampleContent: [
      'Network Diagram: Shows perimeter firewall, DMZ, internal zones',
      'Identity Flow: AD → ADFS → SaaS apps',
      'Data Flow: Shows how sensitive data moves between systems',
      'Application Architecture: 3-tier web apps, databases, APIs'
    ],
    tips: [
      'Start with existing diagrams and update them',
      'Focus on key flows, not exhaustive detail',
      'Validate with technical SMEs',
      'Highlight security boundaries and trust zones'
    ],
    acceptanceCriteria: [
      'Network topology documented',
      'Identity flows mapped',
      'Data flows for sensitive data shown',
      'Diagrams validated by technical team'
    ]
  },

  'policy-inventory': {
    id: 'policy-inventory',
    name: 'Security Policy Inventory & Analysis',
    description: 'List of current security policies with gap analysis',
    purpose: 'Identify policy gaps and outdated policies',
    format: 'Spreadsheet with policy name, date, status, gaps',
    estimatedTime: '4-6 hours',
    exampleContent: [
      'Password Policy - Updated 2020 - Outdated (no MFA requirement)',
      'Access Control Policy - Updated 2023 - Current - Needs ZT principles',
      'Data Classification Policy - Missing',
      'Remote Access Policy - Updated 2021 - Needs ZTNA approach'
    ],
    tips: [
      'Review policy effective dates',
      'Check for NIST, ISO, or CISA alignment',
      'Identify missing policies',
      'Note policies that conflict with ZT principles'
    ],
    acceptanceCriteria: [
      'All security policies inventoried',
      'Policy gaps identified',
      'Outdated policies flagged',
      'ZT alignment assessed'
    ]
  },

  // Phase 2: Technical Assessment
  'capability-assessment': {
    id: 'capability-assessment',
    name: 'CISA ZTMM Capability Assessment',
    description: 'Detailed assessment of each ZTMM capability with maturity scores',
    purpose: 'Determine current maturity level for each ZT pillar',
    format: 'Spreadsheet or tool output with scores per capability',
    estimatedTime: '20-30 hours',
    exampleContent: [
      'Identity - Traditional (Level 1): Basic AD, no MFA on internal apps',
      'Devices - Initial (Level 2): Some endpoint management, basic AV',
      'Networks - Traditional (Level 1): Perimeter firewall only',
      'Data - Advanced (Level 3): DLP deployed, classification in progress'
    ],
    tips: [
      'Use evidence from interviews and documentation',
      'Be honest about current state',
      'Provide specific examples for scores',
      'Validate scores with technical teams'
    ],
    acceptanceCriteria: [
      'All capabilities assessed',
      'Maturity scores assigned with justification',
      'Evidence documented',
      'Validated by technical SMEs'
    ]
  },

  'tool-inventory': {
    id: 'tool-inventory',
    name: 'Security Tool Inventory & Capability Mapping',
    description: 'List of current security tools mapped to ZTMM capabilities',
    purpose: 'Identify tool gaps and consolidation opportunities',
    format: 'Spreadsheet with tool name, vendor, capability covered, cost',
    estimatedTime: '6-8 hours',
    exampleContent: [
      'CrowdStrike Falcon - EDR - Devices pillar - $150K/year',
      'Okta - IdP - Identity pillar - $200K/year',
      'Palo Alto - Firewall - Networks pillar - $300K/year',
      'Splunk - SIEM - Visibility pillar - $500K/year'
    ],
    tips: [
      'Include SaaS and on-prem tools',
      'Document licensing costs',
      'Note overlapping capabilities',
      'Identify gaps not covered by any tool'
    ],
    acceptanceCriteria: [
      'All security tools inventoried',
      'ZTMM capabilities mapped',
      'Costs documented',
      'Gaps identified'
    ]
  },

  // Phase 3: Gap Analysis
  'gap-analysis-report': {
    id: 'gap-analysis-report',
    name: 'Gap Analysis Report',
    description: 'Comprehensive report identifying gaps between current state and target ZT maturity',
    purpose: 'Document what needs to be improved to reach ZT goals',
    format: 'Report (15-25 pages)',
    estimatedTime: '12-16 hours',
    exampleContent: [
      'Identity Gaps: No MFA for internal apps, no adaptive authentication',
      'Network Gaps: No micro-segmentation, VPN-based remote access',
      'Data Gaps: Inconsistent data classification',
      'Visibility Gaps: Limited log retention, no UBA'
    ],
    tips: [
      'Organize by ZTMM pillar',
      'Prioritize by risk and impact',
      'Include quick wins and long-term initiatives',
      'Reference specific controls or standards'
    ],
    acceptanceCriteria: [
      'Gaps identified for each pillar',
      'Business impact explained',
      'Risk level assigned to each gap',
      'Validated by technical teams'
    ]
  },

  'risk-assessment': {
    id: 'risk-assessment',
    name: 'Zero Trust Risk Assessment',
    description: 'Risk analysis of identified gaps with likelihood and impact ratings',
    purpose: 'Prioritize gaps based on risk to the organization',
    format: 'Risk register with ratings and treatment plans',
    estimatedTime: '8-10 hours',
    exampleContent: [
      'Risk: No MFA on internal apps - Likelihood: High - Impact: High - Priority: Critical',
      'Risk: Flat network (no segmentation) - Likelihood: Medium - Impact: High - Priority: High',
      'Risk: Manual access reviews - Likelihood: Low - Impact: Medium - Priority: Medium'
    ],
    tips: [
      'Use organization\'s risk framework',
      'Consider both technical and business risk',
      'Include compliance risk',
      'Document risk treatment options (mitigate, accept, transfer)'
    ],
    acceptanceCriteria: [
      'All significant gaps assessed',
      'Likelihood and impact rated',
      'Risks prioritized',
      'Treatment recommendations provided'
    ]
  },

  // Phase 4: Roadmap
  'zt-roadmap': {
    id: 'zt-roadmap',
    name: 'Zero Trust Implementation Roadmap',
    description: '12/24/36-month roadmap with phases, milestones, and dependencies',
    purpose: 'Provide actionable plan to achieve ZT maturity',
    format: 'Gantt chart or phased roadmap document',
    estimatedTime: '16-20 hours',
    exampleContent: [
      'Phase 1 (Months 1-6): Deploy MFA, implement conditional access',
      'Phase 2 (Months 7-12): Network segmentation, ZTNA for remote access',
      'Phase 3 (Months 13-18): Data classification, DLP deployment',
      'Phase 4 (Months 19-24): SIEM enhancement, SOAR implementation'
    ],
    tips: [
      'Start with quick wins',
      'Group related initiatives',
      'Show dependencies between projects',
      'Include cost estimates and resource needs'
    ],
    acceptanceCriteria: [
      'Roadmap covers 12-24 months minimum',
      'Initiatives prioritized',
      'Dependencies mapped',
      'Resource requirements estimated'
    ]
  },

  // Phase 5: Final Report
  'final-report': {
    id: 'final-report',
    name: 'Final Assessment Report',
    description: 'Comprehensive report with findings, recommendations, and roadmap',
    purpose: 'Document assessment results for executive and technical audiences',
    format: 'Report (40-60 pages) with executive summary',
    estimatedTime: '24-32 hours',
    exampleContent: [
      'Executive Summary (2 pages)',
      'Current State Assessment (10 pages)',
      'ZTMM Maturity Scorecard (5 pages)',
      'Gap Analysis (10 pages)',
      'Risk Assessment (8 pages)',
      'Recommendations (10 pages)',
      'Implementation Roadmap (8 pages)',
      'Appendices (evidence, diagrams)'
    ],
    tips: [
      'Write executive summary last',
      'Use visuals (charts, diagrams)',
      'Include evidence in appendices',
      'Tailor language for audience'
    ],
    acceptanceCriteria: [
      'All assessment phases documented',
      'Findings supported by evidence',
      'Recommendations prioritized',
      'Roadmap included',
      'Reviewed by quality assurance'
    ]
  },

  'exec-presentation': {
    id: 'exec-presentation',
    name: 'Executive Readout Presentation',
    description: 'Executive-level presentation summarizing key findings and recommendations',
    purpose: 'Communicate results to leadership and secure buy-in for roadmap',
    format: 'PowerPoint/Google Slides (20-30 slides)',
    estimatedTime: '8-12 hours',
    exampleContent: [
      'Slide 1: Executive Summary',
      'Slide 2: Current Maturity Scorecard',
      'Slide 3: Top 5 Risks',
      'Slide 4: Quick Wins (0-6 months)',
      'Slide 5: Strategic Initiatives (6-24 months)',
      'Slide 6: Budget & Resources Required',
      'Slide 7: Next Steps'
    ],
    tips: [
      'Focus on business impact, not technical details',
      'Use dashboard-style visuals',
      'Highlight ROI and risk reduction',
      'Prepare for Q&A on budget and timeline'
    ],
    acceptanceCriteria: [
      'Presentation covers key findings',
      'Business impact highlighted',
      'Recommendations clear and actionable',
      'Delivered to executive team'
    ]
  },
};

// Helper function to get deliverable details by ID
export function getDeliverableDetails(id: string): DeliverableDetail | undefined {
  return deliverableDetails[id];
}

// Get all deliverables for a specific phase
export function getDeliverablesByPhase(phaseId: string): DeliverableDetail[] {
  // This would be enhanced to match deliverables to phases
  return Object.values(deliverableDetails);
}
