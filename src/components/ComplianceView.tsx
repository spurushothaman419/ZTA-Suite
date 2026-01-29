import { useState } from 'react';
import {
  allControls,
  getControlsByFramework,
  getControlsByPillar,
  searchControls,
  getMappedControls,
  type ComplianceControl,
  type ComplianceFramework
} from '../lib/complianceData';
import { Search, Filter, ChevronDown, ChevronRight, Shield, FileText, Download, ExternalLink } from 'lucide-react';

type Props = {
  projectId: string;
};

export default function ComplianceView({ projectId }: Props) {
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | 'all'>('all');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedControl, setExpandedControl] = useState<string | null>(null);
  const [showMappings, setShowMappings] = useState(true);

  const frameworks: { id: ComplianceFramework | 'all'; name: string; description: string }[] = [
    { id: 'all', name: 'All Frameworks', description: 'View all controls across frameworks' },
    { id: 'IRS1075', name: 'IRS 1075', description: 'Tax Information Security Guidelines' },
    { id: 'NIST80053', name: 'NIST 800-53 Rev 5', description: 'Security & Privacy Controls' },
    { id: 'CISAZTMM', name: 'CISA ZTMM', description: 'Zero Trust Maturity Model' }
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

  const getFilteredControls = (): ComplianceControl[] => {
    let filtered = allControls;

    if (selectedFramework !== 'all') {
      filtered = getControlsByFramework(selectedFramework);
    }

    if (selectedPillar !== 'all') {
      filtered = filtered.filter(c => c.ztmmPillars.includes(selectedPillar));
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
      case 'CISAZTMM': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getFrameworkBadge = (framework: ComplianceFramework): JSX.Element => {
    const colorClass = getFrameworkColor(framework);
    const label = framework === 'IRS1075' ? 'IRS 1075' : 
                  framework === 'NIST80053' ? 'NIST 800-53' :
                  'CISA ZTMM';
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
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Compliance & Control Mapping</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Explore how Zero Trust controls map to IRS 1075, NIST 800-53 Rev 5, and CISA ZTMM requirements.
              Use this mapping to demonstrate compliance coverage and identify control gaps.
            </p>
            <div className="flex flex-wrap gap-2">
              {frameworks.filter(f => f.id !== 'all').map(f => (
                <div key={f.id} className="flex items-center space-x-2">
                  {getFrameworkBadge(f.id as ComplianceFramework)}
                  <span className="text-xs text-slate-600">{f.description}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={exportComplianceReport}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          {getFrameworkBadge(control.framework)}
                          <span className="text-sm font-mono text-slate-600">{control.controlId}</span>
                          {control.ztmmPillars.map(pillar => (
                            <span key={pillar} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded">
                              {pillar}
                            </span>
                          ))}
                        </div>
                        <h4 className="font-medium text-slate-900 mb-1">{control.title}</h4>
                        <p className="text-sm text-slate-600">{control.description}</p>

                        {isExpanded && (
                          <div className="mt-4 space-y-3">
                            {control.implementationGuidance && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h5 className="text-sm font-medium text-blue-900 mb-1">💡 Implementation Guidance</h5>
                                <p className="text-sm text-blue-800">{control.implementationGuidance}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href="https://www.irs.gov/pub/irs-pdf/p1075.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>IRS Publication 1075</span>
          </a>
          <a
            href="https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>NIST 800-53 Rev 5</span>
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
    </div>
  );
}
