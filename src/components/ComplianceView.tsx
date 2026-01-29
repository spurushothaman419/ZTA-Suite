import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  allControls,
  getControlsByFramework,
  getControlsByPillar,
  searchControls,
  getMappedControls,
  type ComplianceControl,
  type ComplianceFramework,
  type ControlStatus,
  type ControlStatusRecord
} from '../lib/complianceData';
import { Search, Filter, ChevronDown, ChevronRight, Shield, FileText, Download, ExternalLink, Plus, CheckCircle, Circle, AlertTriangle, XCircle, Link as LinkIcon } from 'lucide-react';

type Props = {
  projectId: string;
};

export default function ComplianceView({ projectId }: Props) {
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | 'all'>('all');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedControl, setExpandedControl] = useState<string | null>(null);
  const [showMappings, setShowMappings] = useState(true);
  const [controlStatuses, setControlStatuses] = useState<Record<string, ControlStatusRecord>>({});
  const [customControls, setCustomControls] = useState<ComplianceControl[]>([]);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [showCustomControlModal, setShowCustomControlModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedControl, setSelectedControl] = useState<ComplianceControl | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ControlStatus | 'all'>('all');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    // Load control statuses from localStorage (or could be Supabase)
    const savedStatuses = localStorage.getItem(`compliance-status-${projectId}`);
    if (savedStatuses) {
      setControlStatuses(JSON.parse(savedStatuses));
    }

    // Load custom controls
    const savedCustom = localStorage.getItem(`compliance-custom-${projectId}`);
    if (savedCustom) {
      setCustomControls(JSON.parse(savedCustom));
    }

    // Load evidence list
    try {
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .eq('project_id', projectId);
      
      if (!error && data) {
        setEvidenceList(data);
      }
    } catch (err) {
      console.error('Error loading evidence:', err);
    }
  };

  const saveControlStatus = (controlId: string, status: ControlStatus, notes?: string, evidenceIds?: string[]) => {
    const updated = {
      ...controlStatuses,
      [controlId]: {
        controlId,
        status,
        implementationNotes: notes,
        evidenceIds,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'Current User'
      }
    };
    setControlStatuses(updated);
    localStorage.setItem(`compliance-status-${projectId}`, JSON.stringify(updated));
  };

  const addCustomControl = (control: ComplianceControl) => {
    const updated = [...customControls, control];
    setCustomControls(updated);
    localStorage.setItem(`compliance-custom-${projectId}`, JSON.stringify(updated));
  };

  const deleteCustomControl = (controlId: string) => {
    const updated = customControls.filter(c => c.id !== controlId);
    setCustomControls(updated);
    localStorage.setItem(`compliance-custom-${projectId}`, JSON.stringify(updated));
  };

  const frameworks: { id: ComplianceFramework | 'all'; name: string; description: string }[] = [
    { id: 'all', name: 'All Frameworks', description: 'View all controls across frameworks' },
    { id: 'IRS1075', name: 'IRS 1075', description: 'Tax Information Security Guidelines' },
    { id: 'NIST80053', name: 'NIST 800-53 Rev 5', description: 'Security & Privacy Controls' },
    { id: 'NIST800207', name: 'NIST 800-207', description: 'Zero Trust Architecture' },
    { id: 'NIST180035', name: 'NIST 1800-35', description: 'Implementing Zero Trust' },
    { id: 'CISAZTMM', name: 'CISA ZTMM', description: 'Zero Trust Maturity Model' },
    { id: 'CUSTOM', name: 'Custom Controls', description: 'Organization-specific controls' }
  ];

  const ztmmPillars = [
    'Identity',
    'Devices',
    'Networks',
    'Applications & Workloads',
    'Data',
    'Visibility & Analytics',
    'Automation & Orchestration',
    'Governance'
  ];

  const getStatusIcon = (status?: ControlStatus) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'not-implemented':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'not-applicable':
        return <Circle className="w-5 h-5 text-slate-400" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusBadge = (status?: ControlStatus) => {
    const statusInfo = {
      'implemented': { label: 'Implemented', class: 'bg-green-100 text-green-800 border-green-300' },
      'partial': { label: 'Partial', class: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      'not-implemented': { label: 'Not Implemented', class: 'bg-red-100 text-red-800 border-red-300' },
      'not-applicable': { label: 'N/A', class: 'bg-slate-100 text-slate-600 border-slate-300' }
    };
    const info = status ? statusInfo[status] : { label: 'Not Assessed', class: 'bg-slate-100 text-slate-500 border-slate-200' };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded border ${info.class}`}>{info.label}</span>;
  };

  const getMaturityScore = (framework: ComplianceFramework): { score: number; total: number; percentage: number } => {
    const frameworkControls = [...allControls, ...customControls].filter(c => c.framework === framework);
    const total = frameworkControls.length;
    let score = 0;
    
    frameworkControls.forEach(control => {
      const status = controlStatuses[control.id]?.status;
      if (status === 'implemented') score += 1;
      else if (status === 'partial') score += 0.5;
    });

    return {
      score,
      total,
      percentage: total > 0 ? Math.round((score / total) * 100) : 0
    };
  };

  const getFilteredControls = (): ComplianceControl[] => {
    let filtered = [...allControls, ...customControls];

    if (selectedFramework !== 'all') {
      filtered = filtered.filter(c => c.framework === selectedFramework);
    }

    if (selectedPillar !== 'all') {
      filtered = filtered.filter(c => c.ztmmPillars.includes(selectedPillar));
    }

    if (selectedStatusFilter !== 'all') {
      filtered = filtered.filter(c => {
        const status = controlStatuses[c.id]?.status;
        return status === selectedStatusFilter;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.controlId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getFrameworkColor = (framework: ComplianceFramework): string => {
    switch (framework) {
      case 'IRS1075': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'NIST80053': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'NIST800207': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'NIST180035': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'CISAZTMM': return 'bg-green-100 text-green-800 border-green-300';
      case 'CUSTOM': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getFrameworkBadge = (framework: ComplianceFramework): JSX.Element => {
    const colorClass = getFrameworkColor(framework);
    const label = framework === 'IRS1075' ? 'IRS 1075' : 
                  framework === 'NIST80053' ? 'NIST 800-53' :
                  framework === 'NIST800207' ? 'NIST 800-207' :
                  framework === 'NIST180035' ? 'NIST 1800-35' :
                  framework === 'CISAZTMM' ? 'CISA ZTMM' :
                  framework === 'CUSTOM' ? 'Custom' :
                  framework;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${colorClass}`}>
        {label}
      </span>
    );
  };

  const filteredControls = getFilteredControls();
  const controlsByCategory = filteredControls.reduce((acc, control) => {
    if (!acc[control.category]) acc[control.category] = [];
    acc[control.category].push(control);
    return acc;
  }, {} as Record<string, ComplianceControl[]>);

  const exportComplianceReport = () => {
    // Simple CSV export for now
    const csv = [
      ['Framework', 'Control ID', 'Title', 'Category', 'ZTMM Pillars', 'Description'].join(','),
      ...filteredControls.map(c => [
        c.framework,
        c.controlId,
        `"${c.title}"`,
        c.category,
        `"${c.ztmmPillars.join('; ')}"`,
        `"${c.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Compliance_Mapping_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header with Maturity Scores */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Compliance & Control Mapping</h2>
            </div>
            <p className="text-sm text-slate-600">
              Track compliance across multiple frameworks with control status tracking, evidence linking, and maturity scoring.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCustomControlModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Control</span>
            </button>
            <button
              onClick={exportComplianceReport}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Maturity Scores */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {frameworks.filter(f => f.id !== 'all' && f.id !== 'CUSTOM').map(f => {
            const maturity = getMaturityScore(f.id as ComplianceFramework);
            return (
              <div key={f.id} className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  {getFrameworkBadge(f.id as ComplianceFramework)}
                  <span className="text-lg font-bold text-slate-900">{maturity.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${maturity.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600">{maturity.score}/{maturity.total} controls</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Search Controls</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, ID, or description..."
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Framework Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Framework</label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value as ComplianceFramework | 'all')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {frameworks.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Pillar Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ZTMM Pillar</label>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="all">All Pillars</option>
              {ztmmPillars.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Implementation Status</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as ControlStatus | 'all')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="implemented">Implemented</option>
              <option value="partial">Partial</option>
              <option value="not-implemented">Not Implemented</option>
              <option value="not-applicable">Not Applicable</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              Showing <span className="font-medium">{filteredControls.length}</span> controls
            </span>
            <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showMappings}
                onChange={(e) => setShowMappings(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span>Show control mappings</span>
            </label>
          </div>
        </div>
      </div>

      {/* Controls by Category */}
      <div className="space-y-4">
        {Object.entries(controlsByCategory).map(([category, controls]) => (
          <div key={category} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{category}</h3>
                <span className="text-xs text-slate-500">{controls.length} controls</span>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {controls.map(control => {
                const isExpanded = expandedControl === control.id;
                const mappedControls = showMappings ? getMappedControls(control) : [];

                return (
                  <div key={control.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(controlStatuses[control.id]?.status)}
                          {getFrameworkBadge(control.framework)}
                          <span className="text-sm font-mono text-slate-600">{control.controlId}</span>
                          {control.ztmmPillars.map(pillar => (
                            <span key={pillar} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded">
                              {pillar}
                            </span>
                          ))}
                          {getStatusBadge(controlStatuses[control.id]?.status)}
                          {control.isCustom && (
                            <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">Custom</span>
                          )}
                        </div>
                        <h4 className="font-medium text-slate-900 mb-1">{control.title}</h4>
                        <p className="text-sm text-slate-600">{control.description}</p>
                        
                        {/* Evidence Links */}
                        {controlStatuses[control.id]?.evidenceIds && controlStatuses[control.id].evidenceIds!.length > 0 && (
                          <div className="mt-2 flex items-center space-x-2">
                            <LinkIcon className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs text-indigo-600">
                              {controlStatuses[control.id].evidenceIds!.length} evidence item(s) linked
                            </span>
                          </div>
                        )}

                        {isExpanded && (
                          <div className="mt-4 space-y-3">
                            {/* Update Status Button */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedControl(control);
                                  setShowStatusModal(true);
                                }}
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                Update Status & Link Evidence
                              </button>
                              {control.isCustom && (
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this custom control?')) {
                                      deleteCustomControl(control.id);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Delete Custom Control
                                </button>
                              )}
                            </div>

                            {control.implementationGuidance && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h5 className="text-sm font-medium text-blue-900 mb-1">💡 Implementation Guidance</h5>
                                <p className="text-sm text-blue-800">{control.implementationGuidance}</p>
                              </div>
                            )}

                            {controlStatuses[control.id]?.implementationNotes && (
                              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                <h5 className="text-sm font-medium text-slate-900 mb-1">📝 Implementation Notes</h5>
                                <p className="text-sm text-slate-700">{controlStatuses[control.id].implementationNotes}</p>
                              </div>
                            )}

                            {showMappings && mappedControls.length > 0 && (
                              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                <h5 className="text-sm font-medium text-slate-900 mb-2">🔗 Mapped Controls ({mappedControls.length})</h5>
                                <div className="space-y-2">
                                  {mappedControls.map(mc => (
                                    <div key={mc.id} className="flex items-start space-x-2 text-sm">
                                      {getFrameworkBadge(mc.framework)}
                                      <span className="font-mono text-slate-600">{mc.controlId}</span>
                                      <span className="text-slate-700">{mc.title}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setExpandedControl(isExpanded ? null : control.id)}
                        className="ml-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredControls.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No controls found</h3>
            <p className="text-sm text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Reference Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <a
            href="https://www.irs.gov/pub/irs-pdf/p1075.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>IRS Pub 1075</span>
          </a>
          <a
            href="https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>NIST 800-53 R5</span>
          </a>
          <a
            href="https://csrc.nist.gov/publications/detail/sp/800-207/final"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>NIST 800-207</span>
          </a>
          <a
            href="https://www.nccoe.nist.gov/publications/implementing-zero-trust-architecture"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>NIST 1800-35</span>
          </a>
          <a
            href="https://www.cisa.gov/zero-trust-maturity-model"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>CISA ZTMM</span>
          </a>
        </div>
      </div>

      {/* Modals placeholder - Add custom control and status update modals here */}
      {showCustomControlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCustomControlModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Custom Control</h3>
            <p className="text-sm text-slate-600 mb-4">Feature coming soon! You'll be able to add organization-specific controls here.</p>
            <button
              onClick={() => setShowCustomControlModal(false)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showStatusModal && selectedControl && (
        <StatusUpdateModal
          control={selectedControl}
          currentStatus={controlStatuses[selectedControl.id]}
          evidenceList={evidenceList}
          onSave={(status, notes, evidenceIds) => {
            saveControlStatus(selectedControl.id, status, notes, evidenceIds);
            setShowStatusModal(false);
            setSelectedControl(null);
          }}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedControl(null);
          }}
        />
      )}
    </div>
  );
}

// Status Update Modal Component
function StatusUpdateModal({
  control,
  currentStatus,
  evidenceList,
  onSave,
  onClose
}: {
  control: ComplianceControl;
  currentStatus?: ControlStatusRecord;
  evidenceList: any[];
  onSave: (status: ControlStatus, notes?: string, evidenceIds?: string[]) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<ControlStatus>(currentStatus?.status || 'not-implemented');
  const [notes, setNotes] = useState(currentStatus?.implementationNotes || '');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>(currentStatus?.evidenceIds || []);

  const toggleEvidence = (id: string) => {
    if (selectedEvidence.includes(id)) {
      setSelectedEvidence(selectedEvidence.filter(e => e !== id));
    } else {
      setSelectedEvidence([...selectedEvidence, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Update Control Status</h3>
        
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700">{control.title}</p>
          <p className="text-xs text-slate-500">{control.controlId}</p>
        </div>

        <div className="space-y-4">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Implementation Status</label>
            <div className="grid grid-cols-2 gap-2">
              {(['implemented', 'partial', 'not-implemented', 'not-applicable'] as ControlStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 text-sm rounded-lg border-2 transition-colors ${
                    status === s
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {s === 'implemented' ? '✓ Implemented' :
                   s === 'partial' ? '◐ Partial' :
                   s === 'not-implemented' ? '✗ Not Implemented' :
                   '— Not Applicable'}
                </button>
              ))}
            </div>
          </div>

          {/* Implementation Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Implementation Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe how this control is implemented, or note any exceptions..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
              rows={4}
            />
          </div>

          {/* Evidence Linking */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Link Evidence ({selectedEvidence.length} selected)</label>
            <div className="border border-slate-300 rounded-lg max-h-48 overflow-y-auto">
              {evidenceList.length > 0 ? (
                evidenceList.map(evidence => (
                  <label
                    key={evidence.id}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-200 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvidence.includes(evidence.id)}
                      onChange={() => toggleEvidence(evidence.id)}
                      className="rounded border-slate-300"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{evidence.title}</p>
                      <p className="text-xs text-slate-500">{evidence.type} · {new Date(evidence.created_at).toLocaleDateString()}</p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-sm text-slate-500 p-3">No evidence available. Upload evidence in the Evidence tab first.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(status, notes, selectedEvidence)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Status
          </button>
        </div>
      </div>
    </div>
  );
}
