import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, AlertTriangle, Shield, Bug, Link } from 'lucide-react';

type RAIDItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  mitigation_plan: string;
  created_at: string;
};

type Props = {
  projectId: string;
};

const raidTypes = [
  { value: 'risk', label: 'Risk', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'assumption', label: 'Assumption', icon: Shield, color: 'text-slate-600' },
  { value: 'issue', label: 'Issue', icon: Bug, color: 'text-orange-600' },
  { value: 'dependency', label: 'Dependency', icon: Link, color: 'text-slate-600' },
];

export default function RAIDLog({ projectId }: Props) {
  const [items, setItems] = useState<RAIDItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<RAIDItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
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
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
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
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No {selectedType === 'all' ? 'items' : selectedType + 's'} found
          </div>
        ) : (
          filteredItems.map(item => {
            const Icon = getTypeIcon(item.type);
            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className={`w-5 h-5 mt-0.5 ${getTypeColor(item.type)}`} />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                      {item.mitigation_plan && (
                        <div className="mt-2 p-3 bg-slate-50 rounded border border-slate-200">
                          <p className="text-xs font-medium text-slate-700 mb-1">Mitigation Plan:</p>
                          <p className="text-sm text-slate-600">{item.mitigation_plan}</p>
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
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(item.status)}`}
                  >
                    <option value="open">Open</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="mitigated">Mitigated</option>
                    <option value="closed">Closed</option>
                  </select>
                  <span className="text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

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
