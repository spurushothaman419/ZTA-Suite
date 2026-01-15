import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X } from 'lucide-react';

type Status = {
  id: string;
  week_number: number;
  week_ending: string;
  progress_summary: string;
  blockers: string;
  risks: string;
  next_week_plan: string;
  created_at: string;
};

type Props = {
  projectId: string;
};

export default function WeeklyStatus({ projectId }: Props) {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatuses();
  }, [projectId]);

  const loadStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_status')
        .select('*')
        .eq('project_id', projectId)
        .order('week_number', { ascending: false });

      if (error) throw error;
      setStatuses(data || []);
    } catch (error) {
      console.error('Error loading statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStatus = async (id: string) => {
    try {
      await supabase.from('weekly_status').delete().eq('id', id);
      setStatuses(statuses.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading weekly status reports...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Weekly Status Reports</h3>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Status Report</span>
        </button>
      </div>

      <div className="space-y-4">
        {statuses.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No weekly status reports yet
          </div>
        ) : (
          statuses.map(status => (
            <div key={status.id} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">Week {status.week_number}</h4>
                  <p className="text-sm text-slate-600">
                    Ending {new Date(status.week_ending).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteStatus(status.id)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {status.progress_summary && (
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Progress Summary</h5>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{status.progress_summary}</p>
                  </div>
                )}

                {status.blockers && (
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Blockers</h5>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{status.blockers}</p>
                  </div>
                )}

                {status.risks && (
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Risks</h5>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{status.risks}</p>
                  </div>
                )}

                {status.next_week_plan && (
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Next Week Plan</h5>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{status.next_week_plan}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showNewModal && (
        <NewStatusModal
          projectId={projectId}
          onClose={() => setShowNewModal(false)}
          onStatusCreated={(status) => {
            setStatuses([status, ...statuses]);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}

function NewStatusModal({ projectId, onClose, onStatusCreated }: {
  projectId: string;
  onClose: () => void;
  onStatusCreated: (status: Status) => void;
}) {
  const [weekNumber, setWeekNumber] = useState('');
  const [weekEnding, setWeekEnding] = useState('');
  const [progressSummary, setProgressSummary] = useState('');
  const [blockers, setBlockers] = useState('');
  const [risks, setRisks] = useState('');
  const [nextWeekPlan, setNextWeekPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('weekly_status')
        .insert({
          project_id: projectId,
          week_number: parseInt(weekNumber),
          week_ending: weekEnding,
          progress_summary: progressSummary,
          blockers,
          risks,
          next_week_plan: nextWeekPlan,
        })
        .select()
        .single();

      if (error) throw error;
      onStatusCreated(data);
    } catch (error) {
      console.error('Error creating status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-slate-900">New Weekly Status Report</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Week Number</label>
              <input
                type="number"
                value={weekNumber}
                onChange={(e) => setWeekNumber(e.target.value)}
                required
                min="1"
                max="24"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Week Ending</label>
              <input
                type="date"
                value={weekEnding}
                onChange={(e) => setWeekEnding(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Progress Summary</label>
            <textarea
              value={progressSummary}
              onChange={(e) => setProgressSummary(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Summarize progress made this week..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Blockers</label>
            <textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="List any blockers or impediments..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Risks</label>
            <textarea
              value={risks}
              onChange={(e) => setRisks(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Highlight new or emerging risks..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Next Week Plan</label>
            <textarea
              value={nextWeekPlan}
              onChange={(e) => setNextWeekPlan(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Outline plans for next week..."
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
              {loading ? 'Creating...' : 'Create Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
