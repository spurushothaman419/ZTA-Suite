// CISA Zero Trust Maturity Model (ZTMM) Data
// Based on CISA Zero Trust Maturity Model v2.0

export type MaturityLevel = 'Traditional' | 'Initial' | 'Advanced' | 'Optimal';

export type AssessmentQuestion = {
  id: string;
  question: string;
  guidance: string;
  traditionalIndicator: string;
  initialIndicator: string;
  advancedIndicator: string;
  optimalIndicator: string;
};

export type ZTMMFunction = {
  id: string;
  name: string;
  description: string;
  questions: AssessmentQuestion[];
};

export type ZTMMPillar = {
  id: string;
  name: string;
  description: string;
  icon: string;
  functions: ZTMMFunction[];
};

export const maturityLevelDescriptions: Record<MaturityLevel, string> = {
  Traditional: 'Manual processes, static security policies, limited visibility, and siloed operations',
  Initial: 'Starting automation, some dynamic policies, increased visibility, and initial integration',
  Advanced: 'Automated processes, dynamic policies based on context, comprehensive visibility, and cross-pillar integration',
  Optimal: 'Fully automated, continuous optimization, real-time analytics, and organization-wide integration',
};

export const ztmmPillars: ZTMMPillar[] = [
  {
    id: 'identity',
    name: 'Identity',
    description: 'Agency continuously validates identity and determines access based on risk',
    icon: 'User',
    functions: [
      {
        id: 'identity-authentication',
        name: 'Authentication',
        description: 'Methods used to verify user and entity identities',
        questions: [
          {
            id: 'auth-1',
            question: 'How does your organization authenticate users accessing enterprise resources?',
            guidance: 'Consider all authentication methods including passwords, MFA, certificates, and biometrics',
            traditionalIndicator: 'Password-only authentication with limited MFA for privileged users',
            initialIndicator: 'MFA required for cloud and remote access; phishing-resistant MFA for privileged users',
            advancedIndicator: 'Phishing-resistant MFA required for all users; passwordless options available',
            optimalIndicator: 'Continuous authentication with adaptive, risk-based policies; fully passwordless',
          },
          {
            id: 'auth-2',
            question: 'How is multi-factor authentication (MFA) implemented across your organization?',
            guidance: 'Evaluate MFA coverage, types of factors used, and enforcement policies',
            traditionalIndicator: 'MFA optional or only for specific high-risk applications',
            initialIndicator: 'MFA required for remote access and cloud applications',
            advancedIndicator: 'MFA required for all enterprise resources with phishing-resistant methods',
            optimalIndicator: 'Adaptive MFA with continuous verification based on risk signals',
          },
          {
            id: 'auth-3',
            question: 'How does your organization handle service account and non-person entity (NPE) authentication?',
            guidance: 'Consider machine identities, API keys, certificates, and automated processes',
            traditionalIndicator: 'Static credentials with manual rotation; limited visibility into NPE access',
            initialIndicator: 'Centralized NPE credential management; automated rotation for some accounts',
            advancedIndicator: 'Short-lived credentials; automated rotation; certificate-based authentication',
            optimalIndicator: 'Just-in-time credentials; continuous verification; full NPE lifecycle management',
          },
        ],
      },
      {
        id: 'identity-stores',
        name: 'Identity Stores',
        description: 'Systems that store and manage identity information',
        questions: [
          {
            id: 'store-1',
            question: 'How are identity stores managed and integrated across your organization?',
            guidance: 'Consider directory services, identity providers, and federation',
            traditionalIndicator: 'Multiple disconnected identity stores; manual synchronization',
            initialIndicator: 'Consolidated identity stores with some automation; cloud identity integration',
            advancedIndicator: 'Unified identity platform; automated provisioning; real-time synchronization',
            optimalIndicator: 'Single source of truth; fully automated lifecycle; cross-organization federation',
          },
          {
            id: 'store-2',
            question: 'How does your organization manage identity lifecycle (joiner, mover, leaver)?',
            guidance: 'Evaluate provisioning, role changes, and deprovisioning processes',
            traditionalIndicator: 'Manual processes; delayed deprovisioning; limited audit trails',
            initialIndicator: 'Partially automated provisioning; HR system integration for some processes',
            advancedIndicator: 'Automated lifecycle management; real-time role updates; comprehensive auditing',
            optimalIndicator: 'Fully automated with AI-driven recommendations; continuous access reviews',
          },
        ],
      },
      {
        id: 'identity-risk-assessment',
        name: 'Risk Assessment',
        description: 'Evaluation of identity-related risks for access decisions',
        questions: [
          {
            id: 'risk-1',
            question: 'How does your organization assess risk when making access decisions?',
            guidance: 'Consider user behavior, device posture, location, and threat intelligence',
            traditionalIndicator: 'Static risk assessment; no real-time evaluation',
            initialIndicator: 'Basic risk signals (location, device) considered for some access decisions',
            advancedIndicator: 'Multiple risk signals evaluated in real-time; adaptive access policies',
            optimalIndicator: 'Continuous risk assessment with ML-driven analytics; predictive risk scoring',
          },
          {
            id: 'risk-2',
            question: 'How is user behavior analytics (UBA) used in your organization?',
            guidance: 'Evaluate monitoring, anomaly detection, and response capabilities',
            traditionalIndicator: 'No user behavior analytics; reactive security monitoring',
            initialIndicator: 'Basic UBA for privileged users; manual review of anomalies',
            advancedIndicator: 'UBA across all users; automated anomaly detection; integrated response',
            optimalIndicator: 'Advanced ML-based UBA; predictive analytics; automated remediation',
          },
        ],
      },
      {
        id: 'identity-access-management',
        name: 'Access Management',
        description: 'Controls for managing and enforcing access to resources',
        questions: [
          {
            id: 'access-1',
            question: 'How does your organization implement least privilege access?',
            guidance: 'Consider role-based access, just-in-time access, and access reviews',
            traditionalIndicator: 'Broad access permissions; infrequent access reviews; static roles',
            initialIndicator: 'Role-based access control; periodic access reviews; some just-in-time access',
            advancedIndicator: 'Fine-grained access control; regular automated reviews; JIT for privileged access',
            optimalIndicator: 'Dynamic access based on context; continuous access evaluation; zero standing privileges',
          },
          {
            id: 'access-2',
            question: 'How is privileged access managed in your organization?',
            guidance: 'Evaluate PAM solutions, session monitoring, and credential vaulting',
            traditionalIndicator: 'Shared privileged accounts; limited monitoring; manual credential management',
            initialIndicator: 'PAM solution for some systems; session recording; credential vaulting',
            advancedIndicator: 'Comprehensive PAM; just-in-time privileged access; full session monitoring',
            optimalIndicator: 'Zero standing privileges; automated approval workflows; AI-driven anomaly detection',
          },
        ],
      },
      {
        id: 'identity-federation',
        name: 'Identity Federation',
        description: 'Trust relationships and identity sharing across organizations',
        questions: [
          {
            id: 'fed-1',
            question: 'How does your organization handle identity federation with external partners?',
            guidance: 'Consider SSO, SAML, OIDC, and trust relationships',
            traditionalIndicator: 'Separate accounts for external users; no federation',
            initialIndicator: 'Basic federation with key partners; SSO for some applications',
            advancedIndicator: 'Comprehensive federation; standardized protocols; automated trust management',
            optimalIndicator: 'Dynamic federation; real-time trust evaluation; cross-organization identity governance',
          },
        ],
      },
    ],
  },
  {
    id: 'devices',
    name: 'Devices',
    description: 'Agency continuously validates device security posture and enforces compliance',
    icon: 'Monitor',
    functions: [
      {
        id: 'device-inventory',
        name: 'Asset Inventory & Visibility',
        description: 'Comprehensive visibility into all devices accessing enterprise resources',
        questions: [
          {
            id: 'inv-1',
            question: 'How does your organization maintain visibility into all devices accessing enterprise resources?',
            guidance: 'Consider managed devices, BYOD, IoT, and shadow IT',
            traditionalIndicator: 'Manual inventory; limited visibility into unmanaged devices',
            initialIndicator: 'Automated discovery for managed devices; some BYOD visibility',
            advancedIndicator: 'Real-time inventory of all device types; comprehensive asset database',
            optimalIndicator: 'Continuous discovery; AI-driven classification; full IoT/OT visibility',
          },
          {
            id: 'inv-2',
            question: 'How are device attributes and metadata maintained?',
            guidance: 'Consider ownership, configuration, software inventory, and compliance status',
            traditionalIndicator: 'Basic device records; manual updates; limited metadata',
            initialIndicator: 'Automated collection of device attributes; periodic updates',
            advancedIndicator: 'Real-time attribute collection; comprehensive metadata; integration with CMDB',
            optimalIndicator: 'Continuous attribute monitoring; predictive maintenance; full lifecycle tracking',
          },
        ],
      },
      {
        id: 'device-compliance',
        name: 'Device Compliance',
        description: 'Enforcement of security policies and compliance requirements on devices',
        questions: [
          {
            id: 'comp-1',
            question: 'How does your organization enforce device compliance before granting access?',
            guidance: 'Consider patch levels, encryption, security software, and configuration standards',
            traditionalIndicator: 'Compliance checked periodically; access not dependent on compliance',
            initialIndicator: 'Compliance required for some resources; basic health checks',
            advancedIndicator: 'Real-time compliance verification; access blocked for non-compliant devices',
            optimalIndicator: 'Continuous compliance monitoring; automated remediation; risk-based access',
          },
          {
            id: 'comp-2',
            question: 'How are device security configurations managed and enforced?',
            guidance: 'Evaluate configuration management, hardening standards, and drift detection',
            traditionalIndicator: 'Manual configuration; inconsistent standards; no drift detection',
            initialIndicator: 'Standardized configurations; periodic compliance scans',
            advancedIndicator: 'Automated configuration management; continuous drift detection; auto-remediation',
            optimalIndicator: 'Immutable configurations; real-time enforcement; AI-driven optimization',
          },
        ],
      },
      {
        id: 'device-threat-protection',
        name: 'Device Threat Protection',
        description: 'Protection against threats targeting endpoint devices',
        questions: [
          {
            id: 'threat-1',
            question: 'What endpoint protection capabilities are deployed across your device fleet?',
            guidance: 'Consider EDR, antimalware, application control, and threat intelligence',
            traditionalIndicator: 'Traditional antivirus; signature-based detection only',
            initialIndicator: 'EDR on managed devices; basic threat intelligence integration',
            advancedIndicator: 'Advanced EDR across all devices; behavioral analysis; automated response',
            optimalIndicator: 'XDR with full telemetry; AI-driven threat hunting; predictive protection',
          },
          {
            id: 'threat-2',
            question: 'How does your organization handle device-based threat detection and response?',
            guidance: 'Evaluate detection capabilities, response automation, and forensics',
            traditionalIndicator: 'Manual threat investigation; limited forensic capabilities',
            initialIndicator: 'Automated alerting; manual investigation and response',
            advancedIndicator: 'Automated detection and containment; integrated forensics',
            optimalIndicator: 'Autonomous response; predictive threat prevention; full attack chain visibility',
          },
        ],
      },
      {
        id: 'device-policy-enforcement',
        name: 'Policy Enforcement',
        description: 'Enforcement of security policies at the device level',
        questions: [
          {
            id: 'policy-1',
            question: 'How are device security policies enforced across different device types?',
            guidance: 'Consider MDM, UEM, and policy enforcement for various device categories',
            traditionalIndicator: 'Policies for managed devices only; manual enforcement',
            initialIndicator: 'MDM for mobile devices; some policy automation',
            advancedIndicator: 'UEM across all device types; automated policy enforcement',
            optimalIndicator: 'Dynamic policies based on context; real-time enforcement; self-healing devices',
          },
        ],
      },
    ],
  },
  {
    id: 'networks',
    name: 'Networks',
    description: 'Agency segments networks and controls traffic flows with encryption',
    icon: 'Network',
    functions: [
      {
        id: 'network-segmentation',
        name: 'Network Segmentation',
        description: 'Division of networks into isolated segments to limit lateral movement',
        questions: [
          {
            id: 'seg-1',
            question: 'How does your organization implement network segmentation?',
            guidance: 'Consider VLANs, micro-segmentation, software-defined networking',
            traditionalIndicator: 'Flat network; perimeter-based security only',
            initialIndicator: 'Basic VLANs; some network zones; limited micro-segmentation',
            advancedIndicator: 'Comprehensive micro-segmentation; software-defined perimeters',
            optimalIndicator: 'Dynamic micro-segmentation; identity-aware networking; zero trust network access',
          },
          {
            id: 'seg-2',
            question: 'How is east-west traffic controlled within your network?',
            guidance: 'Evaluate internal traffic monitoring, filtering, and policy enforcement',
            traditionalIndicator: 'No east-west traffic controls; trust within network perimeter',
            initialIndicator: 'Some internal firewalls; basic traffic monitoring',
            advancedIndicator: 'Comprehensive internal traffic control; application-aware policies',
            optimalIndicator: 'Full traffic inspection; AI-driven anomaly detection; automated response',
          },
        ],
      },
      {
        id: 'network-encryption',
        name: 'Traffic Encryption',
        description: 'Encryption of network traffic to protect data in transit',
        questions: [
          {
            id: 'enc-1',
            question: 'How does your organization encrypt network traffic?',
            guidance: 'Consider TLS, IPsec, encryption for internal and external traffic',
            traditionalIndicator: 'Encryption for external traffic only; some legacy protocols',
            initialIndicator: 'TLS for most external traffic; encryption for sensitive internal traffic',
            advancedIndicator: 'Encryption for all traffic; modern protocols; certificate management',
            optimalIndicator: 'End-to-end encryption everywhere; automated certificate lifecycle; quantum-ready',
          },
          {
            id: 'enc-2',
            question: 'How is encrypted traffic inspected for threats?',
            guidance: 'Evaluate TLS inspection capabilities and privacy considerations',
            traditionalIndicator: 'No encrypted traffic inspection; blind spots in security monitoring',
            initialIndicator: 'TLS inspection for some traffic; basic decryption capabilities',
            advancedIndicator: 'Comprehensive TLS inspection; privacy-preserving techniques',
            optimalIndicator: 'Full visibility with privacy controls; AI-driven threat detection in encrypted traffic',
          },
        ],
      },
      {
        id: 'network-visibility',
        name: 'Network Visibility',
        description: 'Comprehensive visibility into network traffic and activities',
        questions: [
          {
            id: 'vis-1',
            question: 'What level of visibility does your organization have into network traffic?',
            guidance: 'Consider flow data, packet capture, and network analytics',
            traditionalIndicator: 'Limited visibility; perimeter logging only',
            initialIndicator: 'Flow data collection; basic network monitoring',
            advancedIndicator: 'Full traffic visibility; deep packet inspection; network analytics',
            optimalIndicator: 'Real-time traffic analysis; AI-driven insights; predictive network intelligence',
          },
        ],
      },
      {
        id: 'network-resilience',
        name: 'Network Resilience',
        description: 'Ability to maintain network operations during attacks or failures',
        questions: [
          {
            id: 'res-1',
            question: 'How does your organization ensure network resilience?',
            guidance: 'Consider redundancy, DDoS protection, and failover capabilities',
            traditionalIndicator: 'Basic redundancy; manual failover; limited DDoS protection',
            initialIndicator: 'Automated failover for critical systems; cloud-based DDoS protection',
            advancedIndicator: 'Comprehensive redundancy; automated response to attacks; multi-path routing',
            optimalIndicator: 'Self-healing network; AI-driven traffic optimization; predictive failure prevention',
          },
        ],
      },
    ],
  },
  {
    id: 'applications',
    name: 'Applications & Workloads',
    description: 'Agency secures applications and workloads with integrated threat protection',
    icon: 'AppWindow',
    functions: [
      {
        id: 'app-access',
        name: 'Application Access',
        description: 'Controls for accessing applications and workloads',
        questions: [
          {
            id: 'app-1',
            question: 'How does your organization control access to applications?',
            guidance: 'Consider application-level authentication, authorization, and access policies',
            traditionalIndicator: 'Network-based access control; VPN for remote access',
            initialIndicator: 'Application-aware access policies; some zero trust network access',
            advancedIndicator: 'Identity-aware proxy; continuous access evaluation; ZTNA for all apps',
            optimalIndicator: 'Dynamic access based on risk; seamless user experience; full application visibility',
          },
          {
            id: 'app-2',
            question: 'How are application permissions and entitlements managed?',
            guidance: 'Evaluate application-level RBAC, entitlement management, and access reviews',
            traditionalIndicator: 'Broad application permissions; infrequent reviews',
            initialIndicator: 'Role-based access within applications; periodic entitlement reviews',
            advancedIndicator: 'Fine-grained permissions; automated access reviews; just-in-time access',
            optimalIndicator: 'Dynamic entitlements; continuous access optimization; AI-driven recommendations',
          },
        ],
      },
      {
        id: 'app-security',
        name: 'Application Security',
        description: 'Security measures integrated into application development and deployment',
        questions: [
          {
            id: 'sec-1',
            question: 'How is security integrated into your application development lifecycle?',
            guidance: 'Consider DevSecOps, SAST, DAST, and security testing',
            traditionalIndicator: 'Security testing at end of development; manual code reviews',
            initialIndicator: 'Some automated security testing; security requirements in design',
            advancedIndicator: 'Full DevSecOps integration; automated security gates; continuous testing',
            optimalIndicator: 'Security as code; AI-driven vulnerability detection; predictive security',
          },
          {
            id: 'sec-2',
            question: 'How does your organization manage application vulnerabilities?',
            guidance: 'Evaluate vulnerability scanning, prioritization, and remediation',
            traditionalIndicator: 'Periodic vulnerability scans; manual prioritization and remediation',
            initialIndicator: 'Regular scanning; risk-based prioritization; SLAs for remediation',
            advancedIndicator: 'Continuous scanning; automated prioritization; integrated remediation',
            optimalIndicator: 'Real-time vulnerability detection; predictive risk scoring; auto-remediation',
          },
        ],
      },
      {
        id: 'app-threat-protection',
        name: 'Application Threat Protection',
        description: 'Protection against threats targeting applications',
        questions: [
          {
            id: 'threat-app-1',
            question: 'What application-layer threat protection is deployed?',
            guidance: 'Consider WAF, API security, bot protection, and runtime protection',
            traditionalIndicator: 'Basic WAF; limited API security',
            initialIndicator: 'WAF with custom rules; API gateway with basic security',
            advancedIndicator: 'Advanced WAF; comprehensive API security; runtime application protection',
            optimalIndicator: 'AI-driven threat protection; behavioral analysis; autonomous response',
          },
        ],
      },
      {
        id: 'app-workload-security',
        name: 'Workload Security',
        description: 'Security for cloud workloads, containers, and serverless',
        questions: [
          {
            id: 'work-1',
            question: 'How does your organization secure cloud workloads and containers?',
            guidance: 'Consider CWPP, container security, and serverless security',
            traditionalIndicator: 'Traditional security tools; limited cloud-native security',
            initialIndicator: 'Basic CWPP; container scanning; some runtime protection',
            advancedIndicator: 'Comprehensive CWPP; full container lifecycle security; serverless protection',
            optimalIndicator: 'Unified workload protection; AI-driven threat detection; immutable infrastructure',
          },
        ],
      },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    description: 'Agency categorizes data and implements protection based on sensitivity',
    icon: 'Database',
    functions: [
      {
        id: 'data-inventory',
        name: 'Data Inventory & Classification',
        description: 'Discovery and classification of data assets',
        questions: [
          {
            id: 'data-1',
            question: 'How does your organization discover and inventory data assets?',
            guidance: 'Consider data discovery tools, data catalogs, and data mapping',
            traditionalIndicator: 'Manual data inventory; limited visibility into data locations',
            initialIndicator: 'Automated discovery for structured data; basic data catalog',
            advancedIndicator: 'Comprehensive data discovery; automated classification; full data lineage',
            optimalIndicator: 'Continuous data discovery; AI-driven classification; real-time data mapping',
          },
          {
            id: 'data-2',
            question: 'How is data classified and labeled in your organization?',
            guidance: 'Evaluate classification schemes, labeling tools, and enforcement',
            traditionalIndicator: 'Manual classification; inconsistent labeling',
            initialIndicator: 'Standardized classification scheme; some automated labeling',
            advancedIndicator: 'Automated classification; persistent labels; policy enforcement',
            optimalIndicator: 'AI-driven classification; dynamic labeling; cross-platform enforcement',
          },
        ],
      },
      {
        id: 'data-protection',
        name: 'Data Protection',
        description: 'Controls to protect data at rest, in transit, and in use',
        questions: [
          {
            id: 'prot-1',
            question: 'How does your organization protect data at rest?',
            guidance: 'Consider encryption, key management, and access controls',
            traditionalIndicator: 'Encryption for some sensitive data; manual key management',
            initialIndicator: 'Encryption for most data at rest; centralized key management',
            advancedIndicator: 'Encryption everywhere; automated key rotation; HSM integration',
            optimalIndicator: 'Transparent encryption; customer-managed keys; quantum-resistant algorithms',
          },
          {
            id: 'prot-2',
            question: 'How is data loss prevention (DLP) implemented?',
            guidance: 'Evaluate DLP coverage, policies, and response capabilities',
            traditionalIndicator: 'Limited DLP; email-focused; manual response',
            initialIndicator: 'DLP for key channels; policy-based detection; alerting',
            advancedIndicator: 'Comprehensive DLP; content-aware policies; automated response',
            optimalIndicator: 'AI-driven DLP; predictive data protection; seamless user experience',
          },
        ],
      },
      {
        id: 'data-access',
        name: 'Data Access Control',
        description: 'Controls for accessing and sharing data',
        questions: [
          {
            id: 'acc-1',
            question: 'How does your organization control access to sensitive data?',
            guidance: 'Consider data-level access controls, ABAC, and data governance',
            traditionalIndicator: 'Coarse-grained access control; folder-level permissions',
            initialIndicator: 'Role-based data access; some attribute-based controls',
            advancedIndicator: 'Fine-grained ABAC; data-centric security; access governance',
            optimalIndicator: 'Dynamic data access; context-aware policies; continuous authorization',
          },
        ],
      },
      {
        id: 'data-availability',
        name: 'Data Availability & Integrity',
        description: 'Ensuring data is available and maintains integrity',
        questions: [
          {
            id: 'avail-1',
            question: 'How does your organization ensure data availability and integrity?',
            guidance: 'Consider backup, recovery, and integrity verification',
            traditionalIndicator: 'Periodic backups; manual recovery; limited integrity checks',
            initialIndicator: 'Automated backups; tested recovery procedures; basic integrity monitoring',
            advancedIndicator: 'Continuous backup; rapid recovery; comprehensive integrity verification',
            optimalIndicator: 'Real-time replication; instant recovery; blockchain-based integrity',
          },
        ],
      },
    ],
  },
  {
    id: 'visibility',
    name: 'Visibility & Analytics',
    description: 'Cross-cutting capability for monitoring, logging, and analytics',
    icon: 'Eye',
    functions: [
      {
        id: 'vis-logging',
        name: 'Logging & Monitoring',
        description: 'Collection and analysis of security logs and events',
        questions: [
          {
            id: 'log-1',
            question: 'How comprehensive is your security logging and monitoring?',
            guidance: 'Consider log sources, coverage, and retention',
            traditionalIndicator: 'Limited log collection; siloed monitoring; short retention',
            initialIndicator: 'Centralized logging; SIEM deployment; compliance-driven retention',
            advancedIndicator: 'Comprehensive logging; real-time monitoring; long-term analytics',
            optimalIndicator: 'Full telemetry; AI-driven analysis; predictive monitoring',
          },
          {
            id: 'log-2',
            question: 'How does your organization correlate and analyze security events?',
            guidance: 'Evaluate SIEM capabilities, correlation rules, and analytics',
            traditionalIndicator: 'Manual log review; basic alerting; limited correlation',
            initialIndicator: 'SIEM with correlation rules; automated alerting; basic analytics',
            advancedIndicator: 'Advanced correlation; behavioral analytics; threat intelligence integration',
            optimalIndicator: 'AI-driven correlation; predictive analytics; autonomous threat detection',
          },
        ],
      },
      {
        id: 'vis-threat-intel',
        name: 'Threat Intelligence',
        description: 'Integration and use of threat intelligence',
        questions: [
          {
            id: 'intel-1',
            question: 'How does your organization leverage threat intelligence?',
            guidance: 'Consider threat feeds, integration, and operationalization',
            traditionalIndicator: 'Limited threat intelligence; manual integration',
            initialIndicator: 'Commercial threat feeds; basic integration with security tools',
            advancedIndicator: 'Multiple intelligence sources; automated integration; threat hunting',
            optimalIndicator: 'Real-time intelligence; predictive threat analysis; intelligence sharing',
          },
        ],
      },
      {
        id: 'vis-analytics',
        name: 'Security Analytics',
        description: 'Advanced analytics for security insights',
        questions: [
          {
            id: 'anal-1',
            question: 'What security analytics capabilities does your organization have?',
            guidance: 'Consider UEBA, network analytics, and ML-based detection',
            traditionalIndicator: 'Basic reporting; manual analysis',
            initialIndicator: 'Security dashboards; some behavioral analytics',
            advancedIndicator: 'Advanced UEBA; ML-based detection; comprehensive analytics',
            optimalIndicator: 'AI-driven insights; predictive analytics; autonomous response',
          },
        ],
      },
    ],
  },
  {
    id: 'automation',
    name: 'Automation & Orchestration',
    description: 'Cross-cutting capability for automated security operations',
    icon: 'Cog',
    functions: [
      {
        id: 'auto-response',
        name: 'Automated Response',
        description: 'Automation of security response actions',
        questions: [
          {
            id: 'resp-1',
            question: 'How automated is your security incident response?',
            guidance: 'Consider SOAR, playbooks, and automated remediation',
            traditionalIndicator: 'Manual incident response; limited automation',
            initialIndicator: 'Some automated alerting; basic playbooks',
            advancedIndicator: 'SOAR platform; automated playbooks; integrated response',
            optimalIndicator: 'Autonomous response; AI-driven orchestration; self-healing systems',
          },
        ],
      },
      {
        id: 'auto-policy',
        name: 'Policy Automation',
        description: 'Automation of security policy management',
        questions: [
          {
            id: 'pol-1',
            question: 'How does your organization automate security policy management?',
            guidance: 'Consider policy as code, automated deployment, and compliance',
            traditionalIndicator: 'Manual policy management; inconsistent enforcement',
            initialIndicator: 'Some policy automation; version control for policies',
            advancedIndicator: 'Policy as code; automated deployment; continuous compliance',
            optimalIndicator: 'Dynamic policies; AI-driven optimization; real-time adaptation',
          },
        ],
      },
      {
        id: 'auto-integration',
        name: 'Security Integration',
        description: 'Integration of security tools and processes',
        questions: [
          {
            id: 'int-1',
            question: 'How well integrated are your security tools and processes?',
            guidance: 'Consider API integration, data sharing, and unified workflows',
            traditionalIndicator: 'Siloed tools; manual data transfer; disconnected processes',
            initialIndicator: 'Some tool integration; basic API usage',
            advancedIndicator: 'Comprehensive integration; unified security platform; automated workflows',
            optimalIndicator: 'Fully integrated ecosystem; real-time data sharing; AI-driven orchestration',
          },
        ],
      },
    ],
  },
];

export const getMaturityScore = (level: MaturityLevel): number => {
  switch (level) {
    case 'Traditional': return 1;
    case 'Initial': return 2;
    case 'Advanced': return 3;
    case 'Optimal': return 4;
    default: return 0;
  }
};

export const getMaturityFromScore = (score: number): MaturityLevel => {
  if (score >= 3.5) return 'Optimal';
  if (score >= 2.5) return 'Advanced';
  if (score >= 1.5) return 'Initial';
  return 'Traditional';
};
