import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, User, Users, Mail, Phone, Building2, Lightbulb, Grid3X3, List, CheckCircle2, Circle } from 'lucide-react';

type Stakeholder = {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone: string;
  notes: string;
  category?: string;
  raci_responsible?: boolean;
  raci_accountable?: boolean;
  raci_consulted?: boolean;
  raci_informed?: boolean;
};

type Props = {
  projectId: string;
};

// Pre-defined stakeholder roles for ZT assessments
const stakeholderTemplates = [
  { role: 'Executive Sponsor', category: 'Leadership', description: 'C-level executive championing the Zero Trust initiative', raci: { r: false, a: true, c: true, i: true } },
  { role: 'Project Manager', category: 'Project Team', description: 'Manages assessment timeline, resources, and deliverables', raci: { r: true, a: true, c: true, i: true } },
  { role: 'CISO / Security Director', category: 'Security', description: 'Oversees security strategy and Zero Trust implementation', raci: { r: true, a: true, c: true, i: true } },
  { role: 'IT Director', category: 'IT', description: 'Manages IT infrastructure and operations', raci: { r: true, a: false, c: true, i: true } },
  { role: 'Identity & Access Manager', category: 'Security', description: 'SME for identity pillar assessment', raci: { r: true, a: false, c: true, i: true } },
  { role: 'Network Security Engineer', category: 'Security', description: 'SME for network pillar assessment', raci: { r: true, a: false, c: true, i: true } },
  { role: 'Endpoint Security Lead', category: 'Security', description: 'SME for devices pillar assessment', raci: { r: true, a: false, c: true, i: true } },
  { role: 'Application Security Lead', category: 'Security', description: 'SME for applications pillar assessment', raci: { r: true, a: false, c: true, i: true } },
  { role: 'Data Security Officer', category: 'Security', description: 'SME for data pillar assessment', raci: { r: true, a: false, c: true, i: true } },
  { role: 'SOC Manager', category: 'Security', description: 'SME for visibility and automation pillars', raci: { r: true, a: false, c: true, i: true } },
  { role: 'Compliance Officer', category: 'Compliance', description: 'Ensures alignment with regulatory requirements', raci: { r: false, a: false, c: true, i: true } },
  { role: 'Enterprise Architect', category: 'IT', description: 'Provides architecture guidance and integration planning', raci: { r: false, a: false, c: true, i: true } },
  { role: 'Business Unit Representative', category: 'Business', description: 'Represents business requirements and impact', raci: { r: false, a: false, c: true, i: true } },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Leadership: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Project Team': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Security: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  IT: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Compliance: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Business: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export default function StakeholdersView({ projectId }: Props) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'raci'>('cards');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStakeholders();
  }, [projectId]);

  const loadStakeholders = async () => {
    try {
      const { data, error } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at');

      if (error) throw error;
      setStakeholders(data || []);
    } catch (error) {
      console.error('Error loading stakeholders:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStakeholder = async (id: string) => {
    try {
      await supabase.from('stakeholders').delete().eq('id', id);
      setStakeholders(stakeholders.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
    }
  };

  const addFromTemplate = async (template: typeof stakeholderTemplates[0]) => {
    try {
      // Try with all fields first, fall back to basic fields if RACI columns don't exist
      const insertData: any = {
        project_id: projectId,
        name: '',
        role: template.role,
        organization: '',
        email: '',
        phone: '',
        notes: template.description,
      };

      // Try to add RACI fields (may not exist in older schemas)
      try {
        const { data, error } = await supabase
          .from('stakeholders')
          .insert({
            ...insertData,
            category: template.category,
            raci_responsible: template.raci.r,
            raci_accountable: template.raci.a,
            raci_consulted: template.raci.c,
            raci_informed: template.raci.i,
          })
          .select()
          .single();

        if (error) throw error;
        setStakeholders([...stakeholders, data]);
        return;
      } catch (raciError) {
        // Fall back to basic insert without RACI fields
        console.log('RACI columns not available, using basic insert');
      }

      // Basic insert without RACI
      const { data, error } = await supabase
        .from('stakeholders')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      // Add RACI fields locally for display
      const stakeholderWithRaci = {
        ...data,
        category: template.category,
        raci_responsible: template.raci.r,
        raci_accountable: template.raci.a,
        raci_consulted: template.raci.c,
        raci_informed: template.raci.i,
      };
      setStakeholders([...stakeholders, stakeholderWithRaci]);
    } catch (error) {
      console.error('Error adding from template:', error);
      alert('Error adding stakeholder. Please try again.');
    }
  };

  const updateRaci = async (id: string, field: string, value: boolean) => {
    try {
      await supabase
        .from('stakeholders')
        .update({ [field]: value })
        .eq('id', id);

      setStakeholders(stakeholders.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      ));
    } catch (error) {
      console.error('Error updating RACI:', error);
    }
  };

  const getCategoryStyle = (category?: string) => {
    return categoryColors[category || 'Business'] || categoryColors.Business;
  };

  // Group stakeholders by category
  const groupedStakeholders = stakeholders.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {} as Record<string, Stakeholder[]>);

  if (loading) {
    return <div className="text-slate-600">Loading stakeholders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Stakeholder Management</h3>
          <p className="text-sm text-slate-600">Track stakeholders and RACI responsibilities</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'raci' : 'cards')}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            {viewMode === 'cards' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
            <span>{viewMode === 'cards' ? 'RACI Matrix' : 'Card View'}</span>
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
            <span>Add Stakeholder</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stakeholders.length}</p>
              <p className="text-sm text-slate-500">Total Stakeholders</p>
            </div>
          </div>
        </div>
        {Object.entries(groupedStakeholders).slice(0, 3).map(([category, list]) => {
          const style = getCategoryStyle(category);
          return (
            <div key={category} className={`${style.bg} border ${style.border} rounded-xl p-4`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${style.bg} rounded-lg`}>
                  <User className={`w-5 h-5 ${style.text}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${style.text}`}>{list.length}</p>
                  <p className="text-sm text-slate-500">{category}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {Object.keys(groupedStakeholders).length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No stakeholders added yet</p>
              <button
                onClick={() => setShowTemplates(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Add from templates →
              </button>
            </div>
          ) : (
            Object.entries(groupedStakeholders).map(([category, list]) => {
              const style = getCategoryStyle(category);
              return (
                <div key={category}>
                  <h4 className={`font-semibold ${style.text} mb-3 flex items-center`}>
                    <span className={`w-3 h-3 rounded-full ${style.bg} border ${style.border} mr-2`}></span>
                    {category} ({list.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map(stakeholder => (
                      <div key={stakeholder.id} className={`bg-white border ${style.border} rounded-lg p-4`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className={`${style.bg} p-2 rounded-full`}>
                              <User className={`w-5 h-5 ${style.text}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {stakeholder.name || <span className="text-slate-400 italic">Name TBD</span>}
                              </h4>
                              <p className="text-sm text-slate-600">{stakeholder.role}</p>
                              {stakeholder.organization && (
                                <p className="text-xs text-slate-500 flex items-center mt-1">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {stakeholder.organization}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteStakeholder(stakeholder.id)}
                            className="text-slate-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="space-y-1 text-sm mb-3">
                          {stakeholder.email && (
                            <a href={`mailto:${stakeholder.email}`} className="text-slate-600 hover:text-indigo-600 flex items-center">
                              <Mail className="w-3 h-3 mr-2" />
                              {stakeholder.email}
                            </a>
                          )}
                          {stakeholder.phone && (
                            <a href={`tel:${stakeholder.phone}`} className="text-slate-600 hover:text-indigo-600 flex items-center">
                              <Phone className="w-3 h-3 mr-2" />
                              {stakeholder.phone}
                            </a>
                          )}
                        </div>

                        {/* RACI Badges */}
                        <div className="flex flex-wrap gap-1">
                          {stakeholder.raci_responsible && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">R</span>
                          )}
                          {stakeholder.raci_accountable && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">A</span>
                          )}
                          {stakeholder.raci_consulted && (
                            <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">C</span>
                          )}
                          {stakeholder.raci_informed && (
                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">I</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* RACI Matrix View */}
      {viewMode === 'raci' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h4 className="font-semibold text-slate-900">RACI Matrix</h4>
            <p className="text-sm text-slate-600">R=Responsible, A=Accountable, C=Consulted, I=Informed</p>
          </div>
          {stakeholders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No stakeholders to display</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Stakeholder</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Role</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-blue-700 bg-blue-50">R</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-red-700 bg-red-50">A</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-amber-700 bg-amber-50">C</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-green-700 bg-green-50">I</th>
                  </tr>
                </thead>
                <tbody>
                  {stakeholders.map((s, idx) => (
                    <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900">{s.name || <span className="text-slate-400 italic">TBD</span>}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{s.role}</td>
                      <td className="text-center py-3 px-4">
                        <button onClick={() => updateRaci(s.id, 'raci_responsible', !s.raci_responsible)}>
                          {s.raci_responsible ? (
                            <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 mx-auto" />
                          )}
                        </button>
                      </td>
                      <td className="text-center py-3 px-4">
                        <button onClick={() => updateRaci(s.id, 'raci_accountable', !s.raci_accountable)}>
                          {s.raci_accountable ? (
                            <CheckCircle2 className="w-5 h-5 text-red-600 mx-auto" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 mx-auto" />
                          )}
                        </button>
                      </td>
                      <td className="text-center py-3 px-4">
                        <button onClick={() => updateRaci(s.id, 'raci_consulted', !s.raci_consulted)}>
                          {s.raci_consulted ? (
                            <CheckCircle2 className="w-5 h-5 text-amber-600 mx-auto" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 mx-auto" />
                          )}
                        </button>
                      </td>
                      <td className="text-center py-3 px-4">
                        <button onClick={() => updateRaci(s.id, 'raci_informed', !s.raci_informed)}>
                          {s.raci_informed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 mx-auto" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Stakeholder Templates</h2>
                <p className="text-sm text-slate-600">Common roles for Zero Trust assessments</p>
              </div>
              <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stakeholderTemplates.map((template, idx) => {
                  const style = getCategoryStyle(template.category);
                  return (
                    <div key={idx} className={`${style.bg} border ${style.border} rounded-lg p-4`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-xs ${style.text} font-medium`}>{template.category}</span>
                          <h4 className="font-semibold text-slate-900">{template.role}</h4>
                          <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                          <div className="flex gap-1 mt-2">
                            {template.raci.r && <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">R</span>}
                            {template.raci.a && <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded">A</span>}
                            {template.raci.c && <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">C</span>}
                            {template.raci.i && <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">I</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => addFromTemplate(template)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewModal && (
        <NewStakeholderModal
          projectId={projectId}
          onClose={() => setShowNewModal(false)}
          onStakeholderCreated={(stakeholder) => {
            setStakeholders([...stakeholders, stakeholder]);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}

function NewStakeholderModal({ projectId, onClose, onStakeholderCreated }: {
  projectId: string;
  onClose: () => void;
  onStakeholderCreated: (stakeholder: Stakeholder) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('stakeholders')
        .insert({
          project_id: projectId,
          name,
          role,
          organization,
          email,
          phone,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      onStakeholderCreated(data);
    } catch (error) {
      console.error('Error creating stakeholder:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Add Stakeholder</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              {loading ? 'Adding...' : 'Add Stakeholder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
