import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X } from 'lucide-react';

type RoadmapItem = {
  id: string;
  workstream: string;
  initiative_name: string;
  objective: string;
  tasks: string;
  owner_type: string;
  dependencies: string;
  timeline: string;
  success_metrics: string;
  priority: string;
};

type Props = {
  projectId: string;
};

const workstreams = ['Identity', 'Device', 'Network', 'Apps/Workloads', 'Data', 'Visibility/Analytics', 'Governance'];
const timelines = ['12-month', '24-month', '36-month'];
const priorities = ['quick-win', 'foundational', 'maturity-expansion', 'optimization'];

export default function RoadmapView({ projectId }: Props) {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<RoadmapItem[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [projectId]);

  useEffect(() => {
    if (selectedTimeline === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.timeline === selectedTimeline));
    }
  }, [selectedTimeline, items]);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .eq('project_id', projectId)
        .order('timeline')
        .order('workstream');

      if (error) throw error;
      setItems(data || []);
      setFilteredItems(data || []);
    } catch (error) {
      console.error('Error loading roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await supabase.from('roadmap_items').delete().eq('id', id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'quick-win': return 'bg-green-100 text-green-800 border-green-200';
      case 'foundational': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'maturity-expansion': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'optimization': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading roadmap...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedTimeline('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedTimeline === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Items
          </button>
          {timelines.map(timeline => (
            <button
              key={timeline}
              onClick={() => setSelectedTimeline(timeline)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedTimeline === timeline
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {timeline}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Initiative</span>
        </button>
      </div>

      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No roadmap items found
          </div>
        ) : (
          workstreams.map(workstream => {
            const workstreamItems = filteredItems.filter(item => item.workstream === workstream);
            if (workstreamItems.length === 0) return null;

            return (
              <div key={workstream} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-900">{workstream}</h4>
                </div>
                <div className="p-4 space-y-3">
                  {workstreamItems.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-slate-900 mb-1">{item.initiative_name}</h5>
                          <p className="text-sm text-slate-600">{item.objective}</p>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-400 hover:text-red-600 ml-4"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        {item.tasks && (
                          <div>
                            <p className="text-xs font-medium text-slate-700 mb-1">Tasks</p>
                            <p className="text-sm text-slate-600">{item.tasks}</p>
                          </div>
                        )}
                        {item.dependencies && (
                          <div>
                            <p className="text-xs font-medium text-slate-700 mb-1">Dependencies</p>
                            <p className="text-sm text-slate-600">{item.dependencies}</p>
                          </div>
                        )}
                        {item.success_metrics && (
                          <div>
                            <p className="text-xs font-medium text-slate-700 mb-1">Success Metrics</p>
                            <p className="text-sm text-slate-600">{item.success_metrics}</p>
                          </div>
                        )}
                        {item.owner_type && (
                          <div>
                            <p className="text-xs font-medium text-slate-700 mb-1">Owner Type</p>
                            <p className="text-sm text-slate-600">{item.owner_type}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                          {item.timeline}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showNewModal && (
        <NewRoadmapModal
          projectId={projectId}
          onClose={() => setShowNewModal(false)}
          onItemCreated={(item) => {
            setItems([...items, item]);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}

function NewRoadmapModal({ projectId, onClose, onItemCreated }: {
  projectId: string;
  onClose: () => void;
  onItemCreated: (item: RoadmapItem) => void;
}) {
  const [workstream, setWorkstream] = useState('Identity');
  const [initiativeName, setInitiativeName] = useState('');
  const [objective, setObjective] = useState('');
  const [tasks, setTasks] = useState('');
  const [ownerType, setOwnerType] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [timeline, setTimeline] = useState('12-month');
  const [successMetrics, setSuccessMetrics] = useState('');
  const [priority, setPriority] = useState('foundational');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .insert({
          project_id: projectId,
          workstream,
          initiative_name: initiativeName,
          objective,
          tasks,
          owner_type: ownerType,
          dependencies,
          timeline,
          success_metrics: successMetrics,
          priority,
        })
        .select()
        .single();

      if (error) throw error;
      onItemCreated(data);
    } catch (error) {
      console.error('Error creating roadmap item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-slate-900">Add Roadmap Initiative</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Workstream</label>
              <select
                value={workstream}
                onChange={(e) => setWorkstream(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {workstreams.map(ws => (
                  <option key={ws} value={ws}>{ws}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {timelines.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Initiative Name</label>
            <input
              type="text"
              value={initiativeName}
              onChange={(e) => setInitiativeName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Objective</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tasks</label>
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Owner Type</label>
              <input
                type="text"
                value={ownerType}
                onChange={(e) => setOwnerType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="e.g., Security Architect"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dependencies</label>
            <textarea
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Success Metrics</label>
            <textarea
              value={successMetrics}
              onChange={(e) => setSuccessMetrics(e.target.value)}
              rows={2}
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
              {loading ? 'Adding...' : 'Add Initiative'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
