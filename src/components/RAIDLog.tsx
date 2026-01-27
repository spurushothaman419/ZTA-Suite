import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, AlertTriangle, Shield, Bug, Link, Lightbulb, FileDown, BarChart3, Clock, CheckCircle2 } from 'lucide-react';

type RAIDItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  mitigation_plan: string;
  owner?: string;
  due_date?: string;
  created_at: string;
};

type Props = {
  projectId: string;
};

const raidTypes = [
  { value: 'risk', label: 'Risk', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
  { value: 'assumption', label: 'Assumption', icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'issue', label: 'Issue', icon: Bug, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { value: 'dependency', label: 'Dependency', icon: Link, color: 'text-purple-600', bgColor: 'bg-purple-50' },
];

// Pre-defined RAID templates for Zero Trust assessments
const raidTemplates = {
  risk: [
    { title: 'Stakeholder Availability', description: 'Key stakeholders may not be available for interviews during the assessment period', severity: 'medium', mitigation: 'Schedule interviews early and have backup contacts identified' },
    { title: 'Incomplete Documentation', description: 'Security policies and architecture documentation may be outdated or incomplete', severity: 'high', mitigation: 'Request documentation early and validate with SMEs' },
    { title: 'Scope Creep', description: 'Assessment scope may expand beyond original boundaries', severity: 'medium', mitigation: 'Document scope clearly and get sign-off; use change control process' },
    { title: 'Resource Constraints', description: 'Client IT team may have limited bandwidth to support assessment', severity: 'medium', mitigation: 'Agree on time commitments upfront; schedule activities in advance' },
    { title: 'Data Sensitivity', description: 'Access to sensitive systems/data may be restricted', severity: 'high', mitigation: 'Work with security team to establish appropriate access levels' },
    { title: 'Technology Gaps', description: 'Organization may lack tools needed for Zero Trust implementation', severity: 'high', mitigation: 'Include technology assessment in scope; provide vendor-neutral recommendations' },
  ],
  assumption: [
    { title: 'Executive Support', description: 'Executive leadership supports the Zero Trust initiative', severity: 'low', mitigation: 'Validate with sponsor at kickoff' },
    { title: 'Current State Accuracy', description: 'Information provided about current security posture is accurate', severity: 'medium', mitigation: 'Validate through technical verification where possible' },
    { title: 'Budget Availability', description: 'Budget will be available for recommended improvements', severity: 'medium', mitigation: 'Discuss budget constraints early; prioritize recommendations' },
    { title: 'Staff Cooperation', description: 'IT and security staff will cooperate with assessment activities', severity: 'low', mitigation: 'Get management support; communicate benefits clearly' },
    { title: 'Timeline Feasibility', description: 'Assessment can be completed within the planned timeline', severity: 'medium', mitigation: 'Build buffer into schedule; identify critical path items' },
  ],
  issue: [
    { title: 'Access Delays', description: 'Delays in obtaining system access for assessment activities', severity: 'high', mitigation: 'Escalate to project sponsor; adjust timeline if needed' },
    { title: 'Conflicting Information', description: 'Different stakeholders provide conflicting information', severity: 'medium', mitigation: 'Document discrepancies; validate with authoritative sources' },
    { title: 'Missing Documentation', description: 'Required documentation is not available', severity: 'medium', mitigation: 'Interview SMEs to fill gaps; document limitations' },
    { title: 'Schedule Conflicts', description: 'Key meetings or interviews need to be rescheduled', severity: 'low', mitigation: 'Maintain flexible schedule; have backup interview slots' },
  ],
  dependency: [
    { title: 'Stakeholder Interviews', description: 'Assessment depends on completing interviews with key stakeholders', severity: 'high', mitigation: 'Schedule interviews early; have backup contacts' },
    { title: 'Documentation Review', description: 'Assessment depends on receiving security documentation', severity: 'high', mitigation: 'Request documents at project start; follow up regularly' },
    { title: 'Technical Access', description: 'Assessment depends on access to security tools and systems', severity: 'high', mitigation: 'Submit access requests early; have alternative data collection methods' },
    { title: 'Third-Party Input', description: 'Assessment may require input from vendors or partners', severity: 'medium', mitigation: 'Identify third parties early; establish communication channels' },
    { title: 'Compliance Requirements', description: 'Assessment must align with regulatory compliance requirements', severity: 'medium', mitigation: 'Identify applicable regulations; incorporate into assessment criteria' },
  ],
};

export default function RAIDLog({ projectId }: Props) {
  const [items, setItems] = useState<RAIDItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<RAIDItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'dashboard'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [projectId]);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === selectedType));
    }
  }, [selectedType, items]);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('raid_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
      setFilteredItems(data || []);
    } catch (error) {
      console.error('Error loading RAID items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFromTemplate = async (type: string, template: typeof raidTemplates.risk[0]) => {
    try {
      const { data, error } = await supabase
        .from('raid_items')
        .insert({
          project_id: projectId,
          type,
          title: template.title,
          description: template.description,
          severity: template.severity,
          mitigation_plan: template.mitigation,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;
      setItems([data, ...items]);
    } catch (error) {
      console.error('Error adding from template:', error);
    }
  };

  // Dashboard metrics
  const metrics = {
    total: items.length,
    open: items.filter(i => i.status === 'open').length,
    critical: items.filter(i => i.severity === 'critical' && i.status !== 'closed').length,
    high: items.filter(i => i.severity === 'high' && i.status !== 'closed').length,
    byType: raidTypes.map(t => ({
      ...t,
      count: items.filter(i => i.type === t.value).length,
      open: items.filter(i => i.type === t.value && i.status === 'open').length,
    })),
  };

  const deleteItem = async (id: string) => {
    try {
      await supabase.from('raid_items').delete().eq('id', id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await supabase
        .from('raid_items')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      setItems(items.map(item => item.id === id ? { ...item, status } : item));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      case 'mitigated': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = raidTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : AlertTriangle;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = raidTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.color : 'text-slate-600';
  };

  if (loading) {
    return <div className="text-slate-600">Loading RAID log...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">RAID Log</h3>
          <p className="text-sm text-slate-600">Track Risks, Assumptions, Issues, and Dependencies</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'dashboard' ? 'list' : 'dashboard')}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{viewMode === 'dashboard' ? 'List View' : 'Dashboard'}</span>
          </button>
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Templates</span>
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Items</p>
                  <p className="text-2xl font-bold text-slate-900">{metrics.total}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Open Items</p>
                  <p className="text-2xl font-bold text-amber-600">{metrics.open}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.critical}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.high}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Bug className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Type Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.byType.map(type => {
              const Icon = type.icon;
              return (
                <div 
                  key={type.value} 
                  className={`${type.bgColor} border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => { setSelectedType(type.value); setViewMode('list'); }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`w-5 h-5 ${type.color}`} />
                    <span className={`font-semibold ${type.color}`}>{type.label}s</span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-slate-900">{type.count}</span>
                    <span className="text-sm text-slate-500">({type.open} open)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Recent Open Items</h4>
            {items.filter(i => i.status === 'open').slice(0, 5).length === 0 ? (
              <p className="text-slate-500 text-center py-4">No open items</p>
            ) : (
              <div className="space-y-3">
                {items.filter(i => i.status === 'open').slice(0, 5).map(item => {
                  const Icon = getTypeIcon(item.type);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${getTypeColor(item.type)}`} />
                        <div>
                          <p className="font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 capitalize">{item.type}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {items.filter(i => i.status === 'open').length > 5 && (
              <button 
                onClick={() => setViewMode('list')}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
              >
                View all {items.filter(i => i.status === 'open').length} open items →
              </button>
            )}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {/* Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({items.length})
            </button>
            {raidTypes.map(type => {
              const Icon = type.icon;
              const count = items.filter(item => item.type === type.value).length;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 whitespace-nowrap ${
                    selectedType === type.value
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No {selectedType === 'all' ? 'items' : selectedType + 's'} found</p>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Add from templates →
                </button>
              </div>
            ) : (
              filteredItems.map(item => {
                const Icon = getTypeIcon(item.type);
                const typeConfig = raidTypes.find(t => t.value === item.type);
                return (
                  <div key={item.id} className={`bg-white border border-slate-200 rounded-lg p-4 ${item.status === 'closed' ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${typeConfig?.bgColor || 'bg-slate-100'}`}>
                          <Icon className={`w-5 h-5 ${getTypeColor(item.type)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
                            {item.status === 'closed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                          <p className="text-sm text-slate-600">{item.description}</p>
                          {item.mitigation_plan && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-xs font-medium text-green-800 mb-1">Mitigation Plan:</p>
                              <p className="text-sm text-green-700">{item.mitigation_plan}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-slate-400 hover:text-red-600 ml-4"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </span>
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`px-3 py-1 text-xs rounded-full border capitalize cursor-pointer ${getStatusColor(item.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="monitoring">Monitoring</option>
                        <option value="mitigated">Mitigated</option>
                        <option value="closed">Closed</option>
                      </select>
                      <span className="text-xs text-slate-500">
                        Created: {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">RAID Templates</h2>
                <p className="text-sm text-slate-600">Pre-defined items for Zero Trust assessments</p>
              </div>
              <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {raidTypes.map(type => {
                const Icon = type.icon;
                const templates = raidTemplates[type.value as keyof typeof raidTemplates] || [];
                return (
                  <div key={type.value} className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Icon className={`w-5 h-5 ${type.color}`} />
                      <h3 className="font-semibold text-slate-900">{type.label}s</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {templates.map((template, idx) => (
                        <div key={idx} className={`${type.bgColor} border rounded-lg p-4`}>
                          <h4 className="font-medium text-slate-900 mb-1">{template.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(template.severity)}`}>
                              {template.severity}
                            </span>
                            <button
                              onClick={() => addFromTemplate(type.value, template)}
                              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              + Add to Log
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showNewModal && (
        <NewRAIDModal
          projectId={projectId}
          onClose={() => setShowNewModal(false)}
          onItemCreated={(item) => {
            setItems([item, ...items]);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}

function NewRAIDModal({ projectId, onClose, onItemCreated }: {
  projectId: string;
  onClose: () => void;
  onItemCreated: (item: RAIDItem) => void;
}) {
  const [type, setType] = useState('risk');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('raid_items')
        .insert({
          project_id: projectId,
          type,
          title,
          description,
          severity,
          mitigation_plan: mitigationPlan,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;
      onItemCreated(data);
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Add RAID Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {raidTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mitigation Plan</label>
            <textarea
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
