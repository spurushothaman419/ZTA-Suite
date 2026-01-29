// Compliance Framework Mapping Data
// Maps IRS 1075, NIST 800-53 Rev 5, and CISA ZTMM controls

export type ComplianceFramework = 'IRS1075' | 'NIST80053' | 'CISAZTMM' | 'NIST800207' | 'NIST180035' | 'CUSTOM';
export type ControlStatus = 'not-implemented' | 'partial' | 'implemented' | 'not-applicable';

export interface ComplianceControl {
  id: string;
  framework: ComplianceFramework;
  controlId: string;
  title: string;
  description: string;
  category: string;
  ztmmPillars: string[]; // Which ZTMM pillars this relates to
  implementationGuidance?: string;
  mappedControls: {
    framework: ComplianceFramework;
    controlId: string;
  }[];
  isCustom?: boolean; // For organization-specific controls
}

export interface ControlStatusRecord {
  controlId: string;
  status: ControlStatus;
  implementationNotes?: string;
  evidenceIds?: string[]; // Link to evidence documents
  lastUpdated?: string;
  updatedBy?: string;
}

// IRS 1075 Controls (Tax Information Security)
export const irs1075Controls: ComplianceControl[] = [
  {
    id: 'irs1075-1',
    framework: 'IRS1075',
    controlId: '9.3.1',
    title: 'Access Control - User Identification',
    description: 'Unique user identification must be established and maintained for all users with access to FTI systems.',
    category: 'Access Control',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Implement strong identity management with unique user accounts, no shared credentials, and multi-factor authentication.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'IA-2' },
      { framework: 'NIST80053', controlId: 'IA-4' },
      { framework: 'CISAZTMM', controlId: 'Identity-1' }
    ]
  },
  {
    id: 'irs1075-2',
    framework: 'IRS1075',
    controlId: '9.3.2',
    title: 'Access Control - Authentication',
    description: 'Multi-factor authentication is required for remote access to FTI systems and applications.',
    category: 'Access Control',
    ztmmPillars: ['Identity', 'Networks'],
    implementationGuidance: 'Deploy MFA for all remote access, privileged access, and access to FTI. Use phishing-resistant MFA where possible.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'IA-2(1)' },
      { framework: 'NIST80053', controlId: 'IA-2(2)' },
      { framework: 'CISAZTMM', controlId: 'Identity-2' }
    ]
  },
  {
    id: 'irs1075-3',
    framework: 'IRS1075',
    controlId: '9.3.3',
    title: 'Access Control - Least Privilege',
    description: 'Access to FTI must be limited to the minimum necessary for users to perform their duties.',
    category: 'Access Control',
    ztmmPillars: ['Identity', 'Data'],
    implementationGuidance: 'Implement role-based access control (RBAC) with regular access reviews and just-in-time privileged access.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'AC-6' },
      { framework: 'CISAZTMM', controlId: 'Identity-3' }
    ]
  },
  {
    id: 'irs1075-4',
    framework: 'IRS1075',
    controlId: '9.3.4',
    title: 'Encryption - Data at Rest',
    description: 'FTI must be encrypted when stored on servers, workstations, portable devices, and removable media.',
    category: 'Encryption',
    ztmmPillars: ['Data', 'Devices'],
    implementationGuidance: 'Deploy full-disk encryption, database encryption, and file-level encryption for FTI. Use FIPS 140-2 validated cryptographic modules.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SC-28' },
      { framework: 'NIST80053', controlId: 'SC-28(1)' },
      { framework: 'CISAZTMM', controlId: 'Data-1' }
    ]
  },
  {
    id: 'irs1075-5',
    framework: 'IRS1075',
    controlId: '9.3.5',
    title: 'Encryption - Data in Transit',
    description: 'FTI must be encrypted during transmission over public or untrusted networks.',
    category: 'Encryption',
    ztmmPillars: ['Data', 'Networks'],
    implementationGuidance: 'Use TLS 1.2+ for all FTI transmissions. Implement VPN or secure tunnels for remote access. Disable weak protocols.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SC-8' },
      { framework: 'NIST80053', controlId: 'SC-8(1)' },
      { framework: 'CISAZTMM', controlId: 'Networks-2' }
    ]
  },
  {
    id: 'irs1075-6',
    framework: 'IRS1075',
    controlId: '9.3.6',
    title: 'Audit Logging - Security Events',
    description: 'Security-relevant events must be logged, monitored, and retained for systems processing FTI.',
    category: 'Audit & Accountability',
    ztmmPillars: ['Visibility & Analytics'],
    implementationGuidance: 'Implement centralized logging (SIEM) with real-time alerting for security events. Retain logs per IRS requirements (6 years minimum).',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'AU-2' },
      { framework: 'NIST80053', controlId: 'AU-3' },
      { framework: 'NIST80053', controlId: 'AU-6' },
      { framework: 'CISAZTMM', controlId: 'Visibility-1' }
    ]
  },
  {
    id: 'irs1075-7',
    framework: 'IRS1075',
    controlId: '9.3.7',
    title: 'Network Security - Segmentation',
    description: 'FTI environments must be logically or physically separated from other networks.',
    category: 'Network Security',
    ztmmPillars: ['Networks'],
    implementationGuidance: 'Implement network segmentation with firewalls, VLANs, or micro-segmentation. Restrict east-west traffic and implement zero-trust network access.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SC-7' },
      { framework: 'NIST80053', controlId: 'SC-7(5)' },
      { framework: 'CISAZTMM', controlId: 'Networks-1' }
    ]
  },
  {
    id: 'irs1075-8',
    framework: 'IRS1075',
    controlId: '9.3.8',
    title: 'Endpoint Security - Malware Protection',
    description: 'Anti-malware protection must be deployed on all devices that access or store FTI.',
    category: 'Endpoint Security',
    ztmmPillars: ['Devices'],
    implementationGuidance: 'Deploy EDR/XDR solutions with real-time threat detection, automated response, and behavioral analytics.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SI-3' },
      { framework: 'CISAZTMM', controlId: 'Devices-2' }
    ]
  },
  {
    id: 'irs1075-9',
    framework: 'IRS1075',
    controlId: '9.3.9',
    title: 'Incident Response - Detection & Response',
    description: 'Security incidents involving FTI must be detected, reported, and responded to in accordance with IRS requirements.',
    category: 'Incident Response',
    ztmmPillars: ['Visibility & Analytics', 'Automation & Orchestration'],
    implementationGuidance: 'Establish 24/7 monitoring, incident response procedures, and notification protocols. Report breaches to IRS within 24 hours.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'IR-4' },
      { framework: 'NIST80053', controlId: 'IR-5' },
      { framework: 'NIST80053', controlId: 'IR-6' },
      { framework: 'CISAZTMM', controlId: 'Visibility-2' }
    ]
  },
  {
    id: 'irs1075-10',
    framework: 'IRS1075',
    controlId: '9.3.10',
    title: 'Background Investigations',
    description: 'Personnel with access to FTI must undergo background investigations appropriate to their risk level.',
    category: 'Personnel Security',
    ztmmPillars: ['Governance'],
    implementationGuidance: 'Conduct background checks before granting FTI access. Implement continuous monitoring for privileged users.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'PS-3' },
      { framework: 'CISAZTMM', controlId: 'Governance-1' }
    ]
  }
];

// NIST 800-53 Rev 5 Key Controls (subset focused on Zero Trust)
export const nist80053Controls: ComplianceControl[] = [
  {
    id: 'nist-1',
    framework: 'NIST80053',
    controlId: 'AC-2',
    title: 'Account Management',
    description: 'Manage system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts.',
    category: 'Access Control',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Automate account lifecycle management with identity governance tools. Implement automated provisioning/deprovisioning.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.1' },
      { framework: 'CISAZTMM', controlId: 'Identity-1' }
    ]
  },
  {
    id: 'nist-2',
    framework: 'NIST80053',
    controlId: 'AC-3',
    title: 'Access Enforcement',
    description: 'Enforce approved authorizations for logical access to information and system resources.',
    category: 'Access Control',
    ztmmPillars: ['Identity', 'Data'],
    implementationGuidance: 'Implement policy-based access control with dynamic authorization decisions based on user, device, and context.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Identity-2' }
    ]
  },
  {
    id: 'nist-3',
    framework: 'NIST80053',
    controlId: 'AC-6',
    title: 'Least Privilege',
    description: 'Employ the principle of least privilege, allowing only authorized accesses for users which are necessary to accomplish assigned tasks.',
    category: 'Access Control',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Implement just-in-time and just-enough-access (JIT/JEA) for privileged operations. Use privileged access management (PAM) solutions.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.3' },
      { framework: 'CISAZTMM', controlId: 'Identity-3' }
    ]
  },
  {
    id: 'nist-4',
    framework: 'NIST80053',
    controlId: 'IA-2',
    title: 'Identification and Authentication',
    description: 'Uniquely identify and authenticate organizational users and associate that identity with processes acting on behalf of those users.',
    category: 'Identification & Authentication',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Deploy modern authentication protocols (SAML, OAuth 2.0, OpenID Connect) with strong cryptographic authentication.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.1' },
      { framework: 'CISAZTMM', controlId: 'Identity-1' }
    ]
  },
  {
    id: 'nist-5',
    framework: 'NIST80053',
    controlId: 'IA-2(1)',
    title: 'Multi-Factor Authentication to Privileged Accounts',
    description: 'Implement multi-factor authentication for access to privileged accounts.',
    category: 'Identification & Authentication',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Require MFA for all privileged access. Use phishing-resistant MFA (FIDO2, smart cards, or biometrics with PKI).',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.2' },
      { framework: 'CISAZTMM', controlId: 'Identity-2' }
    ]
  },
  {
    id: 'nist-6',
    framework: 'NIST80053',
    controlId: 'SC-7',
    title: 'Boundary Protection',
    description: 'Monitor and control communications at the external managed interfaces to the system and at key internal managed interfaces.',
    category: 'System & Communications Protection',
    ztmmPillars: ['Networks'],
    implementationGuidance: 'Deploy next-gen firewalls, web application firewalls, and API gateways. Implement micro-segmentation for internal boundaries.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.7' },
      { framework: 'CISAZTMM', controlId: 'Networks-1' }
    ]
  },
  {
    id: 'nist-7',
    framework: 'NIST80053',
    controlId: 'SC-8',
    title: 'Transmission Confidentiality and Integrity',
    description: 'Protect the confidentiality and integrity of transmitted information.',
    category: 'System & Communications Protection',
    ztmmPillars: ['Networks', 'Data'],
    implementationGuidance: 'Encrypt all network traffic using TLS 1.3, IPsec, or other approved protocols. Implement certificate management.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.5' },
      { framework: 'CISAZTMM', controlId: 'Networks-2' }
    ]
  },
  {
    id: 'nist-8',
    framework: 'NIST80053',
    controlId: 'SC-28',
    title: 'Protection of Information at Rest',
    description: 'Protect the confidentiality and integrity of information at rest.',
    category: 'System & Communications Protection',
    ztmmPillars: ['Data'],
    implementationGuidance: 'Implement encryption for data at rest using FIPS 140-2 validated modules. Use key management services for encryption keys.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.4' },
      { framework: 'CISAZTMM', controlId: 'Data-1' }
    ]
  },
  {
    id: 'nist-9',
    framework: 'NIST80053',
    controlId: 'AU-2',
    title: 'Event Logging',
    description: 'Identify the types of events that the system is capable of logging and that are needed to support audit and monitoring.',
    category: 'Audit & Accountability',
    ztmmPillars: ['Visibility & Analytics'],
    implementationGuidance: 'Log authentication events, access to sensitive data, configuration changes, and security events. Centralize logs in SIEM.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.6' },
      { framework: 'CISAZTMM', controlId: 'Visibility-1' }
    ]
  },
  {
    id: 'nist-10',
    framework: 'NIST80053',
    controlId: 'AU-6',
    title: 'Audit Record Review, Analysis, and Reporting',
    description: 'Review and analyze system audit records for indications of inappropriate or unusual activity and report findings.',
    category: 'Audit & Accountability',
    ztmmPillars: ['Visibility & Analytics'],
    implementationGuidance: 'Deploy SIEM with correlation rules, threat intelligence, and automated alerting. Implement SOAR for automated response.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.6' },
      { framework: 'CISAZTMM', controlId: 'Visibility-2' }
    ]
  },
  {
    id: 'nist-11',
    framework: 'NIST80053',
    controlId: 'SI-3',
    title: 'Malicious Code Protection',
    description: 'Implement malicious code protection mechanisms at system entry and exit points.',
    category: 'System & Information Integrity',
    ztmmPillars: ['Devices'],
    implementationGuidance: 'Deploy endpoint detection and response (EDR) with behavioral analysis, sandboxing, and automated remediation.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.8' },
      { framework: 'CISAZTMM', controlId: 'Devices-2' }
    ]
  },
  {
    id: 'nist-12',
    framework: 'NIST80053',
    controlId: 'SI-4',
    title: 'System Monitoring',
    description: 'Monitor the system to detect attacks, indicators of potential attacks, and unauthorized connections and activities.',
    category: 'System & Information Integrity',
    ztmmPillars: ['Visibility & Analytics', 'Networks'],
    implementationGuidance: 'Deploy network detection and response (NDR), user behavior analytics (UBA), and threat hunting capabilities.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Visibility-1' }
    ]
  },
  {
    id: 'nist-13',
    framework: 'NIST80053',
    controlId: 'IR-4',
    title: 'Incident Handling',
    description: 'Implement incident handling capability for security incidents that is consistent with the incident response plan.',
    category: 'Incident Response',
    ztmmPillars: ['Automation & Orchestration', 'Visibility & Analytics'],
    implementationGuidance: 'Establish incident response procedures, playbooks, and SOAR platform for automated orchestration and remediation.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.9' },
      { framework: 'CISAZTMM', controlId: 'Visibility-2' }
    ]
  },
  {
    id: 'nist-14',
    framework: 'NIST80053',
    controlId: 'CM-7',
    title: 'Least Functionality',
    description: 'Configure the system to provide only mission-essential capabilities.',
    category: 'Configuration Management',
    ztmmPillars: ['Devices', 'Applications & Workloads'],
    implementationGuidance: 'Disable unnecessary services, remove unused software, and harden configurations using CIS benchmarks or DISA STIGs.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Devices-1' }
    ]
  },
  {
    id: 'nist-15',
    framework: 'NIST80053',
    controlId: 'PS-3',
    title: 'Personnel Screening',
    description: 'Screen individuals prior to authorizing access to the system.',
    category: 'Personnel Security',
    ztmmPillars: ['Governance'],
    implementationGuidance: 'Conduct background checks appropriate to risk level. Implement continuous monitoring for high-privilege users.',
    mappedControls: [
      { framework: 'IRS1075', controlId: '9.3.10' },
      { framework: 'CISAZTMM', controlId: 'Governance-1' }
    ]
  }
];

// CISA Zero Trust Maturity Model Controls (simplified mapping)
export const cisaZTMMControls: ComplianceControl[] = [
  {
    id: 'ztmm-1',
    framework: 'CISAZTMM',
    controlId: 'Identity-1',
    title: 'Identity Stores & Attributes',
    description: 'Centralized identity management with comprehensive user and device attributes for access decisions.',
    category: 'Identity',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Implement centralized identity provider (IdP) with attribute-based access control (ABAC). Integrate all systems with SSO.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'AC-2' },
      { framework: 'NIST80053', controlId: 'IA-2' },
      { framework: 'IRS1075', controlId: '9.3.1' }
    ]
  },
  {
    id: 'ztmm-2',
    framework: 'CISAZTMM',
    controlId: 'Identity-2',
    title: 'Authentication & Access Control',
    description: 'Strong authentication with MFA and risk-based adaptive access control.',
    category: 'Identity',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Deploy phishing-resistant MFA, continuous authentication, and risk-based access policies that adapt to user/device context.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'IA-2(1)' },
      { framework: 'IRS1075', controlId: '9.3.2' }
    ]
  },
  {
    id: 'ztmm-3',
    framework: 'CISAZTMM',
    controlId: 'Identity-3',
    title: 'Access Policies & Enforcement',
    description: 'Dynamic, risk-based access policies enforced consistently across all resources.',
    category: 'Identity',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Implement policy decision points (PDP) and policy enforcement points (PEP) with dynamic authorization based on context.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'AC-3' },
      { framework: 'NIST80053', controlId: 'AC-6' },
      { framework: 'IRS1075', controlId: '9.3.3' }
    ]
  },
  {
    id: 'ztmm-4',
    framework: 'CISAZTMM',
    controlId: 'Devices-1',
    title: 'Device Inventory & Compliance',
    description: 'Comprehensive device inventory with real-time compliance enforcement.',
    category: 'Devices',
    ztmmPillars: ['Devices'],
    implementationGuidance: 'Deploy unified endpoint management (UEM) with automated device discovery, compliance checks, and quarantine capabilities.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'CM-7' }
    ]
  },
  {
    id: 'ztmm-5',
    framework: 'CISAZTMM',
    controlId: 'Devices-2',
    title: 'Endpoint Security & Threat Protection',
    description: 'Advanced endpoint protection with EDR/XDR and behavioral analysis.',
    category: 'Devices',
    ztmmPillars: ['Devices'],
    implementationGuidance: 'Deploy EDR/XDR with threat intelligence, behavioral analytics, and automated response. Integrate with SIEM/SOAR.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SI-3' },
      { framework: 'IRS1075', controlId: '9.3.8' }
    ]
  },
  {
    id: 'ztmm-6',
    framework: 'CISAZTMM',
    controlId: 'Networks-1',
    title: 'Network Segmentation & Isolation',
    description: 'Micro-segmentation with software-defined perimeter and least-privilege network access.',
    category: 'Networks',
    ztmmPillars: ['Networks'],
    implementationGuidance: 'Implement software-defined networking (SDN) with micro-segmentation. Use zero trust network access (ZTNA) for remote access.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SC-7' },
      { framework: 'IRS1075', controlId: '9.3.7' }
    ]
  },
  {
    id: 'ztmm-7',
    framework: 'CISAZTMM',
    controlId: 'Networks-2',
    title: 'Encrypted Communications',
    description: 'End-to-end encryption for all network communications with certificate-based trust.',
    category: 'Networks',
    ztmmPillars: ['Networks'],
    implementationGuidance: 'Deploy mTLS for service-to-service communication. Use TLS 1.3 for all external connections. Implement certificate lifecycle management.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SC-8' },
      { framework: 'IRS1075', controlId: '9.3.5' }
    ]
  },
  {
    id: 'ztmm-8',
    framework: 'CISAZTMM',
    controlId: 'Data-1',
    title: 'Data Classification & Protection',
    description: 'Data classification with encryption, DLP, and context-aware access controls.',
    category: 'Data',
    ztmmPillars: ['Data'],
    implementationGuidance: 'Implement data classification, labeling, and automated protection policies. Deploy DLP with content inspection and encryption.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SC-28' },
      { framework: 'IRS1075', controlId: '9.3.4' }
    ]
  },
  {
    id: 'ztmm-9',
    framework: 'CISAZTMM',
    controlId: 'Visibility-1',
    title: 'Comprehensive Logging & Monitoring',
    description: 'Centralized logging with real-time analytics and correlation across all assets.',
    category: 'Visibility & Analytics',
    ztmmPillars: ['Visibility & Analytics'],
    implementationGuidance: 'Deploy SIEM with integration to all systems, applications, and infrastructure. Implement real-time correlation and alerting.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'AU-2' },
      { framework: 'NIST80053', controlId: 'SI-4' },
      { framework: 'IRS1075', controlId: '9.3.6' }
    ]
  },
  {
    id: 'ztmm-10',
    framework: 'CISAZTMM',
    controlId: 'Visibility-2',
    title: 'Threat Detection & Response',
    description: 'Advanced threat detection with automated response and continuous improvement.',
    category: 'Visibility & Analytics',
    ztmmPillars: ['Visibility & Analytics', 'Automation & Orchestration'],
    implementationGuidance: 'Deploy threat intelligence platform, UBA/UEBA, and SOAR for automated incident response and threat hunting.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'AU-6' },
      { framework: 'NIST80053', controlId: 'IR-4' },
      { framework: 'IRS1075', controlId: '9.3.9' }
    ]
  },
  {
    id: 'ztmm-11',
    framework: 'CISAZTMM',
    controlId: 'Governance-1',
    title: 'Policies, Procedures & Governance',
    description: 'Comprehensive zero trust governance with continuous policy enforcement and compliance validation.',
    category: 'Governance',
    ztmmPillars: ['Governance'],
    implementationGuidance: 'Establish ZT governance board, policy framework, and continuous compliance monitoring with automated remediation.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'PS-3' },
      { framework: 'IRS1075', controlId: '9.3.10' }
    ]
  }
];

// NIST 800-207 Zero Trust Architecture Principles
export const nist800207Controls: ComplianceControl[] = [
  {
    id: 'nist207-1',
    framework: 'NIST800207',
    controlId: 'ZTA-1',
    title: 'All Data Sources and Computing Services are Resources',
    description: 'A network may be composed of multiple classes of devices, including IoT, mobile, and cloud services. All are considered resources.',
    category: 'Core Principles',
    ztmmPillars: ['Devices', 'Applications & Workloads', 'Data'],
    implementationGuidance: 'Inventory and classify all data sources and computing services. Treat all resources equally regardless of network location.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Devices-1' }
    ]
  },
  {
    id: 'nist207-2',
    framework: 'NIST800207',
    controlId: 'ZTA-2',
    title: 'All Communication is Secured',
    description: 'The network location alone does not imply trust. All communication must be secured regardless of network location.',
    category: 'Core Principles',
    ztmmPillars: ['Networks', 'Data'],
    implementationGuidance: 'Encrypt all communications using TLS 1.3, mTLS, or IPsec. Implement end-to-end encryption for all data flows.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SC-8' },
      { framework: 'CISAZTMM', controlId: 'Networks-2' },
      { framework: 'IRS1075', controlId: '9.3.5' }
    ]
  },
  {
    id: 'nist207-3',
    framework: 'NIST800207',
    controlId: 'ZTA-3',
    title: 'Access to Resources is Granted Per-Session',
    description: 'Trust in the requester is evaluated before granting access, and access is granted on a per-session basis.',
    category: 'Core Principles',
    ztmmPillars: ['Identity', 'Networks'],
    implementationGuidance: 'Implement policy decision points (PDP) that evaluate trust per session. Use short-lived certificates or tokens.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Identity-3' },
      { framework: 'NIST80053', controlId: 'AC-3' }
    ]
  },
  {
    id: 'nist207-4',
    framework: 'NIST800207',
    controlId: 'ZTA-4',
    title: 'Access Determined by Dynamic Policy',
    description: 'Access to resources is determined by dynamic policy including observable state of user identity, application, and device.',
    category: 'Core Principles',
    ztmmPillars: ['Identity', 'Devices'],
    implementationGuidance: 'Deploy policy engines that evaluate user, device, and environmental attributes. Implement risk-based adaptive access.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Identity-2' },
      { framework: 'CISAZTMM', controlId: 'Devices-2' }
    ]
  },
  {
    id: 'nist207-5',
    framework: 'NIST800207',
    controlId: 'ZTA-5',
    title: 'Monitor and Measure Asset Security Posture',
    description: 'The enterprise monitors and measures the integrity and security posture of all owned and associated assets.',
    category: 'Core Principles',
    ztmmPillars: ['Devices', 'Visibility & Analytics'],
    implementationGuidance: 'Deploy continuous monitoring tools for device compliance, vulnerability management, and security posture assessment.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'SI-4' },
      { framework: 'CISAZTMM', controlId: 'Visibility-1' }
    ]
  },
  {
    id: 'nist207-6',
    framework: 'NIST800207',
    controlId: 'ZTA-6',
    title: 'Dynamic Authentication and Authorization',
    description: 'All resource authentication and authorization are dynamic and strictly enforced before access is allowed.',
    category: 'Core Principles',
    ztmmPillars: ['Identity'],
    implementationGuidance: 'Implement continuous authentication, step-up authentication for sensitive operations, and just-in-time access.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'IA-2' },
      { framework: 'CISAZTMM', controlId: 'Identity-1' },
      { framework: 'IRS1075', controlId: '9.3.2' }
    ]
  },
  {
    id: 'nist207-7',
    framework: 'NIST800207',
    controlId: 'ZTA-7',
    title: 'Collect Information for Security Posture',
    description: 'The enterprise collects as much information as possible about the current state of assets, network, and communications.',
    category: 'Core Principles',
    ztmmPillars: ['Visibility & Analytics'],
    implementationGuidance: 'Deploy comprehensive logging, SIEM, and analytics platforms. Collect telemetry from all assets and data flows.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'AU-2' },
      { framework: 'CISAZTMM', controlId: 'Visibility-1' },
      { framework: 'IRS1075', controlId: '9.3.6' }
    ]
  }
];

// NIST 1800-35 Implementing Zero Trust Architecture (Practice Guide)
export const nist180035Controls: ComplianceControl[] = [
  {
    id: 'nist1035-1',
    framework: 'NIST180035',
    controlId: 'IMP-1',
    title: 'Identify Actors and Assets',
    description: 'Identify all actors (users, devices, services) and assets (data, applications, services) in the environment.',
    category: 'Implementation',
    ztmmPillars: ['Identity', 'Devices', 'Data'],
    implementationGuidance: 'Conduct comprehensive inventory of users, devices, applications, and data. Classify assets by sensitivity and criticality.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Devices-1' },
      { framework: 'NIST80053', controlId: 'AC-2' }
    ]
  },
  {
    id: 'nist1035-2',
    framework: 'NIST180035',
    controlId: 'IMP-2',
    title: 'Identify Business Processes and Data Flows',
    description: 'Map business processes and understand how data flows through the organization.',
    category: 'Implementation',
    ztmmPillars: ['Data', 'Applications & Workloads'],
    implementationGuidance: 'Document business workflows, data flows, and application dependencies. Identify critical paths and sensitive data flows.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Data-1' }
    ]
  },
  {
    id: 'nist1035-3',
    framework: 'NIST180035',
    controlId: 'IMP-3',
    title: 'Define Policy and Access Requirements',
    description: 'Create comprehensive access policies based on least privilege and need-to-know principles.',
    category: 'Implementation',
    ztmmPillars: ['Identity', 'Governance'],
    implementationGuidance: 'Define RBAC/ABAC policies, document access requirements, and establish approval workflows.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'AC-6' },
      { framework: 'CISAZTMM', controlId: 'Identity-3' },
      { framework: 'IRS1075', controlId: '9.3.3' }
    ]
  },
  {
    id: 'nist1035-4',
    framework: 'NIST180035',
    controlId: 'IMP-4',
    title: 'Deploy Policy Decision and Enforcement Points',
    description: 'Implement PDP and PEP components to enforce zero trust policies.',
    category: 'Implementation',
    ztmmPillars: ['Identity', 'Networks'],
    implementationGuidance: 'Deploy policy engines, identity brokers, and enforcement gateways. Integrate with existing identity and access systems.',
    mappedControls: [
      { framework: 'NIST800207', controlId: 'ZTA-3' },
      { framework: 'CISAZTMM', controlId: 'Identity-3' }
    ]
  },
  {
    id: 'nist1035-5',
    framework: 'NIST180035',
    controlId: 'IMP-5',
    title: 'Implement Continuous Monitoring and Analytics',
    description: 'Deploy continuous monitoring, logging, and analytics capabilities across the environment.',
    category: 'Implementation',
    ztmmPillars: ['Visibility & Analytics'],
    implementationGuidance: 'Implement SIEM, UBA/UEBA, and threat intelligence platforms. Establish baseline behavior and anomaly detection.',
    mappedControls: [
      { framework: 'NIST800207', controlId: 'ZTA-5' },
      { framework: 'NIST80053', controlId: 'SI-4' },
      { framework: 'CISAZTMM', controlId: 'Visibility-1' }
    ]
  },
  {
    id: 'nist1035-6',
    framework: 'NIST180035',
    controlId: 'IMP-6',
    title: 'Automate Response to Security Events',
    description: 'Implement automated response capabilities for security events and policy violations.',
    category: 'Implementation',
    ztmmPillars: ['Automation & Orchestration', 'Visibility & Analytics'],
    implementationGuidance: 'Deploy SOAR platform with automated playbooks for common security events. Integrate with all security tools.',
    mappedControls: [
      { framework: 'NIST80053', controlId: 'IR-4' },
      { framework: 'CISAZTMM', controlId: 'Visibility-2' }
    ]
  },
  {
    id: 'nist1035-7',
    framework: 'NIST180035',
    controlId: 'IMP-7',
    title: 'Micro-Segmentation and Network Isolation',
    description: 'Implement network micro-segmentation to limit lateral movement and contain breaches.',
    category: 'Implementation',
    ztmmPillars: ['Networks'],
    implementationGuidance: 'Deploy software-defined networking (SDN) with micro-segmentation. Implement least-privilege network access controls.',
    mappedControls: [
      { framework: 'NIST800207', controlId: 'ZTA-2' },
      { framework: 'NIST80053', controlId: 'SC-7' },
      { framework: 'CISAZTMM', controlId: 'Networks-1' },
      { framework: 'IRS1075', controlId: '9.3.7' }
    ]
  },
  {
    id: 'nist1035-8',
    framework: 'NIST180035',
    controlId: 'IMP-8',
    title: 'Secure Remote Access with ZTNA',
    description: 'Replace VPN with Zero Trust Network Access (ZTNA) for remote access.',
    category: 'Implementation',
    ztmmPillars: ['Networks', 'Identity'],
    implementationGuidance: 'Deploy ZTNA solution with application-level access, device posture checking, and continuous authentication.',
    mappedControls: [
      { framework: 'CISAZTMM', controlId: 'Networks-1' },
      { framework: 'CISAZTMM', controlId: 'Identity-2' }
    ]
  }
];

// Combined dataset for easy searching
export const allControls = [...irs1075Controls, ...nist80053Controls, ...cisaZTMMControls, ...nist800207Controls, ...nist180035Controls];

// Helper functions
export const getControlsByFramework = (framework: ComplianceFramework): ComplianceControl[] => {
  return allControls.filter(c => c.framework === framework);
};

export const getControlsByPillar = (pillar: string): ComplianceControl[] => {
  return allControls.filter(c => c.ztmmPillars.includes(pillar));
};

export const getControlsByCategory = (category: string): ComplianceControl[] => {
  return allControls.filter(c => c.category === category);
};

export const searchControls = (query: string): ComplianceControl[] => {
  const lowerQuery = query.toLowerCase();
  return allControls.filter(c => 
    c.title.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.controlId.toLowerCase().includes(lowerQuery) ||
    c.category.toLowerCase().includes(lowerQuery)
  );
};

export const getMappedControls = (control: ComplianceControl): ComplianceControl[] => {
  return control.mappedControls
    .map(mc => allControls.find(c => c.framework === mc.framework && c.controlId === mc.controlId))
    .filter(Boolean) as ComplianceControl[];
};
