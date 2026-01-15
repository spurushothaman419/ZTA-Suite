import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

type Phase = {
  id: string;
  phase_number: number;
  name: string;
  objective: string;
  start_week: number;
  end_week: number;
  status: string;
};

type Task = {
  id: string;
  phase_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
};

type Deliverable = {
  id: string;
  phase_id: string;
  name: string;
  description: string;
  status: string;
  due_date: string;
};

type Props = {
  projectId: string;
};

export default function PhasesView({ projectId }: Props) {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [deliverables, setDeliverables] = useState<Record<string, Deliverable[]>>({});
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const { data: phasesData } = await supabase
        .from('phases')
        .select('*')
        .eq('project_id', projectId)
        .order('phase_number');

      if (phasesData) {
        setPhases(phasesData);

        const tasksMap: Record<string, Task[]> = {};
        const deliverablesMap: Record<string, Deliverable[]> = {};

        for (const phase of phasesData) {
          const { data: tasksData } = await supabase
            .from('tasks')
            .select('*')
            .eq('phase_id', phase.id)
            .order('created_at');

          const { data: deliverablesData } = await supabase
            .from('deliverables')
            .select('*')
            .eq('phase_id', phase.id)
            .order('created_at');

          tasksMap[phase.id] = tasksData || [];
          deliverablesMap[phase.id] = deliverablesData || [];
        }

        setTasks(tasksMap);
        setDeliverables(deliverablesMap);
      }
    } catch (error) {
      console.error('Error loading phases:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const updatePhaseStatus = async (phaseId: string, status: string) => {
    try {
      await supabase
        .from('phases')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', phaseId);

      setPhases(phases.map(p => p.id === phaseId ? { ...p, status } : p));
    } catch (error) {
      console.error('Error updating phase:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, phaseId: string, status: string) => {
    try {
      await supabase
        .from('tasks')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      setTasks({
        ...tasks,
        [phaseId]: tasks[phaseId].map(t =>
          t.id === taskId ? { ...t, status } : t
        ),
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-slate-600 bg-slate-50 border-slate-200';
      case 'blocked': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-slate-500';
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading phases...</div>;
  }

  return (
    <div className="space-y-4">
      {phases.map(phase => (
        <div key={phase.id} className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="mt-1 text-slate-600 hover:text-slate-900"
                >
                  {expandedPhases.has(phase.id) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Phase {phase.phase_number}: {phase.name}
                    </h3>
                    <span className="text-sm text-slate-600">
                      Weeks {phase.start_week}-{phase.end_week}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{phase.objective}</p>
                </div>
              </div>
              <select
                value={phase.status}
                onChange={(e) => updatePhaseStatus(phase.id, e.target.value)}
                className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(phase.status)}`}
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {expandedPhases.has(phase.id) && (
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Tasks</h4>
                {tasks[phase.id]?.length > 0 ? (
                  <div className="space-y-2">
                    {tasks[phase.id].map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-3 flex-1">
                          <button
                            onClick={() => {
                              const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                              updateTaskStatus(task.id, phase.id, newStatus);
                            }}
                          >
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                            )}
                          </div>
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No tasks yet</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Deliverables</h4>
                {deliverables[phase.id]?.length > 0 ? (
                  <div className="space-y-2">
                    {deliverables[phase.id].map(deliverable => (
                      <div key={deliverable.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-900">{deliverable.name}</p>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(deliverable.status)}`}>
                            {deliverable.status}
                          </span>
                        </div>
                        {deliverable.description && (
                          <p className="text-xs text-slate-600">{deliverable.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No deliverables yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
