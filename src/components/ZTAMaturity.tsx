import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';

type Pillar = {
  id: string;
  pillar_name: string;
  description: string;
};

type Capability = {
  id: string;
  pillar_id: string;
  capability_name: string;
  current_control: string;
  evidence: string;
  maturity_level: string;
  gap_description: string;
  risk_level: string;
  recommendation: string;
};

type Props = {
  projectId: string;
};

const maturityLevels = ['Traditional', 'Initial', 'Advanced', 'Optimal'];
const riskLevels = ['low', 'medium', 'high', 'critical'];

export default function ZTAMaturity({ projectId }: Props) {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [capabilities, setCapabilities] = useState<Record<string, Capability[]>>({});
  const [expandedPillars, setExpandedPillars] = useState<Set<string>>(new Set());
  const [editingCapability, setEditingCapability] = useState<Capability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const { data: pillarsData } = await supabase
        .from('zta_pillars')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at');

      if (pillarsData) {
        setPillars(pillarsData);

        const capabilitiesMap: Record<string, Capability[]> = {};

        for (const pillar of pillarsData) {
          const { data: capsData } = await supabase
            .from('zta_capabilities')
            .select('*')
            .eq('pillar_id', pillar.id)
            .order('created_at');

          capabilitiesMap[pillar.id] = capsData || [];
        }

        setCapabilities(capabilitiesMap);
      }
    } catch (error) {
      console.error('Error loading ZTA data:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePillar = (pillarId: string) => {
    const newExpanded = new Set(expandedPillars);
    if (newExpanded.has(pillarId)) {
      newExpanded.delete(pillarId);
    } else {
      newExpanded.add(pillarId);
    }
    setExpandedPillars(newExpanded);
  };

  const addCapability = async (pillarId: string) => {
    try {
      const { data, error } = await supabase
        .from('zta_capabilities')
        .insert({
          pillar_id: pillarId,
          capability_name: 'New Capability',
          maturity_level: 'Traditional',
          risk_level: 'medium',
        })
        .select()
        .single();

      if (error) throw error;

      setCapabilities({
        ...capabilities,
        [pillarId]: [...(capabilities[pillarId] || []), data],
      });

      setEditingCapability(data);
    } catch (error) {
      console.error('Error adding capability:', error);
    }
  };

  const updateCapability = async (capability: Capability) => {
    try {
      await supabase
        .from('zta_capabilities')
        .update({
          capability_name: capability.capability_name,
          current_control: capability.current_control,
          evidence: capability.evidence,
          maturity_level: capability.maturity_level,
          gap_description: capability.gap_description,
          risk_level: capability.risk_level,
          recommendation: capability.recommendation,
          updated_at: new Date().toISOString(),
        })
        .eq('id', capability.id);

      setCapabilities({
        ...capabilities,
        [capability.pillar_id]: capabilities[capability.pillar_id].map(c =>
          c.id === capability.id ? capability : c
        ),
      });

      setEditingCapability(null);
    } catch (error) {
      console.error('Error updating capability:', error);
    }
  };

  const getMaturityColor = (level: string) => {
    switch (level) {
      case 'Optimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Advanced': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Initial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading ZTA maturity data...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">CISA Zero Trust Maturity Model</h3>
        <p className="text-sm text-slate-600">Assessment of current capabilities mapped to CISA ZTA pillars</p>
      </div>

      {pillars.map(pillar => (
        <div key={pillar.id} className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={() => togglePillar(pillar.id)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  {expandedPillars.has(pillar.id) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{pillar.pillar_name}</h4>
                  <p className="text-sm text-slate-600">{pillar.description}</p>
                </div>
              </div>
              <button
                onClick={() => addCapability(pillar.id)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Capability</span>
              </button>
            </div>
          </div>

          {expandedPillars.has(pillar.id) && (
            <div className="p-4">
              {capabilities[pillar.id]?.length > 0 ? (
                <div className="space-y-3">
                  {capabilities[pillar.id].map(capability => (
                    <div key={capability.id} className="bg-white border border-slate-200 rounded-lg p-4">
                      {editingCapability?.id === capability.id ? (
                        <CapabilityEditor
                          capability={editingCapability}
                          onChange={setEditingCapability}
                          onSave={() => updateCapability(editingCapability)}
                          onCancel={() => setEditingCapability(null)}
                        />
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-semibold text-slate-900">{capability.capability_name}</h5>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full border ${getMaturityColor(capability.maturity_level)}`}>
                                {capability.maturity_level}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full border ${getRiskColor(capability.risk_level)}`}>
                                {capability.risk_level} risk
                              </span>
                              <button
                                onClick={() => setEditingCapability(capability)}
                                className="text-sm text-slate-600 hover:text-slate-900"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                          {capability.current_control && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-slate-700">Current Control:</p>
                              <p className="text-sm text-slate-600">{capability.current_control}</p>
                            </div>
                          )}
                          {capability.gap_description && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-slate-700">Gap:</p>
                              <p className="text-sm text-slate-600">{capability.gap_description}</p>
                            </div>
                          )}
                          {capability.recommendation && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-slate-700">Recommendation:</p>
                              <p className="text-sm text-slate-600">{capability.recommendation}</p>
                            </div>
                          )}
                          {capability.evidence && (
                            <div>
                              <p className="text-xs font-medium text-slate-700">Evidence:</p>
                              <p className="text-sm text-slate-600">{capability.evidence}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">
                  No capabilities defined yet. Click &quot;Add Capability&quot; to get started.
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CapabilityEditor({ capability, onChange, onSave, onCancel }: {
  capability: Capability;
  onChange: (capability: Capability) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Capability Name</label>
        <input
          type="text"
          value={capability.capability_name}
          onChange={(e) => onChange({ ...capability, capability_name: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Maturity Level</label>
          <select
            value={capability.maturity_level}
            onChange={(e) => onChange({ ...capability, maturity_level: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            {maturityLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Risk Level</label>
          <select
            value={capability.risk_level}
            onChange={(e) => onChange({ ...capability, risk_level: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            {riskLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Current Control</label>
        <textarea
          value={capability.current_control || ''}
          onChange={(e) => onChange({ ...capability, current_control: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Gap Description</label>
        <textarea
          value={capability.gap_description || ''}
          onChange={(e) => onChange({ ...capability, gap_description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Recommendation</label>
        <textarea
          value={capability.recommendation || ''}
          onChange={(e) => onChange({ ...capability, recommendation: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Evidence</label>
        <textarea
          value={capability.evidence || ''}
          onChange={(e) => onChange({ ...capability, evidence: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      <div className="flex space-x-2 pt-2">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
