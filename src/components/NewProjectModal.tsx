import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';

type Props = {
  onClose: () => void;
  onProjectCreated: (project: any) => void;
};

export default function NewProjectModal({ onClose, onProjectCreated }: Props) {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          client_name: clientName,
          start_date: startDate,
          end_date: endDate,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      const phases = [
        { phase_number: 0, name: 'Mobilization & Governance', objective: 'Stand up governance, lock scope, confirm access paths, finalize methodology, and establish acceptance criteria', start_week: 1, end_week: 2 },
        { phase_number: 1, name: 'Discovery & Current State Capture', objective: 'Establish factual baseline: org structure, policies, tools, architecture, and operational realities', start_week: 3, end_week: 6 },
        { phase_number: 2, name: 'Technical Assessment & CISA ZTMM Mapping', objective: 'Convert discovery into measurable capability mapping and technical validation', start_week: 7, end_week: 12 },
        { phase_number: 3, name: 'Risk & Gap Analysis', objective: 'Translate findings into business risk and compliance exposure; prioritize what matters', start_week: 13, end_week: 16 },
        { phase_number: 4, name: 'Target State Architecture & Roadmap', objective: 'Define target state, sequencing, dependencies, and achievable milestones', start_week: 17, end_week: 22 },
        { phase_number: 5, name: 'Finalization, Acceptance, and Executive Readout', objective: 'Produce acceptance-ready final deliverables with clear traceability, and secure formal signoff', start_week: 23, end_week: 24 },
      ];

      await supabase.from('phases').insert(
        phases.map(phase => ({
          ...phase,
          project_id: data.id,
          status: 'not-started',
        }))
      );

      const ztaPillars = [
        { pillar_name: 'Identity', description: 'User and non-person entity identity management and access control' },
        { pillar_name: 'Device', description: 'Device identification, security posture, and lifecycle management' },
        { pillar_name: 'Network', description: 'Network segmentation, micro-segmentation, and policy enforcement' },
        { pillar_name: 'Application/Workload', description: 'Application and workload security and access control' },
        { pillar_name: 'Data', description: 'Data classification, encryption, and protection controls' },
        { pillar_name: 'Visibility & Analytics', description: 'Logging, monitoring, threat detection, and security analytics' },
        { pillar_name: 'Automation & Orchestration', description: 'Automated policy enforcement and security orchestration' },
      ];

      await supabase.from('zta_pillars').insert(
        ztaPillars.map(pillar => ({
          ...pillar,
          project_id: data.id,
        }))
      );

      onProjectCreated(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">New ZTA Assessment Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="CDSS ZTA Assessment"
            />
          </div>

          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-slate-700 mb-1">
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="CDSS"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
