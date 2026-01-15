import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';

type Project = {
  id: string;
  name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  status: string;
};

type Props = {
  project: Project;
};

type Stats = {
  totalPhases: number;
  completedPhases: number;
  totalTasks: number;
  completedTasks: number;
  openRisks: number;
  openIssues: number;
  totalDeliverables: number;
  approvedDeliverables: number;
};

export default function ProjectOverview({ project }: Props) {
  const [stats, setStats] = useState<Stats>({
    totalPhases: 0,
    completedPhases: 0,
    totalTasks: 0,
    completedTasks: 0,
    openRisks: 0,
    openIssues: 0,
    totalDeliverables: 0,
    approvedDeliverables: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [project.id]);

  const loadStats = async () => {
    try {
      const [phasesResult, tasksResult, raidResult, deliverablesResult] = await Promise.all([
        supabase.from('phases').select('status').eq('project_id', project.id),
        supabase.from('tasks').select('status, phase_id').eq('phase_id', await getPhaseIds()),
        supabase.from('raid_items').select('type, status').eq('project_id', project.id),
        supabase.from('deliverables').select('status, phase_id').eq('phase_id', await getPhaseIds()),
      ]);

      const phases = phasesResult.data || [];
      const tasks = tasksResult.data || [];
      const raid = raidResult.data || [];
      const deliverables = deliverablesResult.data || [];

      setStats({
        totalPhases: phases.length,
        completedPhases: phases.filter(p => p.status === 'completed').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        openRisks: raid.filter(r => r.type === 'risk' && r.status === 'open').length,
        openIssues: raid.filter(r => r.type === 'issue' && r.status === 'open').length,
        totalDeliverables: deliverables.length,
        approvedDeliverables: deliverables.filter(d => d.status === 'approved').length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseIds = async () => {
    const { data } = await supabase
      .from('phases')
      .select('id')
      .eq('project_id', project.id);
    return data?.map(p => p.id) || [];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getWeekNumber = () => {
    const start = new Date(project.start_date);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const weeks = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, weeks);
  };

  if (loading) {
    return <div className="text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{project.name}</h2>
        <p className="text-slate-600">{project.client_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center space-x-2 text-slate-700 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Start Date</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">{formatDate(project.start_date)}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center space-x-2 text-slate-700 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">End Date</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">{formatDate(project.end_date)}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center space-x-2 text-slate-700 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Current Week</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">Week {getWeekNumber()} of 24</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center space-x-2 text-slate-700 mb-1">
            <Circle className="w-4 h-4" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <p className="text-lg font-semibold text-slate-900 capitalize">{project.status}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Phases</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.completedPhases} / {stats.totalPhases}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {stats.totalPhases > 0
                ? Math.round((stats.completedPhases / stats.totalPhases) * 100)
                : 0}% Complete
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Tasks</span>
              <CheckCircle2 className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.completedTasks} / {stats.totalTasks}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {stats.totalTasks > 0
                ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                : 0}% Complete
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Open Risks</span>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.openRisks}</p>
            <p className="text-xs text-slate-500 mt-1">Requires attention</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Deliverables</span>
              <CheckCircle2 className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.approvedDeliverables} / {stats.totalDeliverables}
            </p>
            <p className="text-xs text-slate-500 mt-1">Approved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
