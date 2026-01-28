import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, Calendar, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, Clock, FileDown, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

type Status = {
  id: string;
  week_number: number;
  week_ending: string;
  progress_summary: string;
  blockers: string;
  risks: string;
  next_week_plan: string;
  overall_status?: 'on_track' | 'at_risk' | 'delayed';
  completion_percentage?: number;
  created_at: string;
};

type Props = {
  projectId: string;
};

// Pre-defined status templates for ZT assessments
const statusTemplates = {
  week1: {
    progress: `• Project kickoff meeting completed
• Stakeholder identification and initial outreach
• Assessment scope and timeline confirmed
• Documentation request sent to client
• Assessment tools and templates prepared`,
    blockers: `• Awaiting access credentials for security tools
• Pending NDA signature from legal`,
    risks: `• Key stakeholder availability during holiday period
• Potential scope expansion based on initial discussions`,
    nextWeek: `• Begin stakeholder interviews (Identity, Devices pillars)
• Review security documentation
• Complete initial environment assessment
• Schedule remaining interviews`,
  },
  week2: {
    progress: `• Completed interviews for Identity and Devices pillars
• Reviewed IAM policies and procedures
• Assessed endpoint security controls
• Documented current state findings`,
    blockers: `• Network team availability limited
• Some documentation still pending`,
    risks: `• Gap in MFA coverage larger than expected
• Legacy systems may require additional assessment time`,
    nextWeek: `• Complete Networks and Applications pillar interviews
• Begin technical validation of controls
• Draft preliminary findings for Identity pillar`,
  },
  week3: {
    progress: `• Completed Networks and Applications pillar assessments
• Technical validation of security controls
• Identified key gaps and quick wins
• Stakeholder alignment on preliminary findings`,
    blockers: `• Access to cloud environment pending approval
• Data classification documentation incomplete`,
    risks: `• Network segmentation gaps may impact timeline
• Resource constraints for remediation planning`,
    nextWeek: `• Complete Data and Visibility pillar assessments
• Begin gap analysis and recommendations
• Prepare executive summary draft`,
  },
  week4: {
    progress: `• Completed all 8 pillar assessments
• Gap analysis and prioritization complete
• Roadmap recommendations drafted
• Executive presentation prepared`,
    blockers: `• Final review pending from security leadership`,
    risks: `• Budget constraints may impact roadmap timeline
• Resource availability for implementation`,
    nextWeek: `• Executive presentation and findings review
• Finalize assessment report
• Handoff and next steps discussion
• Project closeout activities`,
  },
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'on_track': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle2 };
    case 'at_risk': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle };
    case 'delayed': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: Clock };
    default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: Clock };
  }
};

export default function WeeklyStatus({ projectId }: Props) {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

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
      // Auto-expand the latest week
      if (data && data.length > 0) {
        setExpandedWeeks(new Set([data[0].id]));
      }
    } catch (error) {
      console.error('Error loading statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStatus = async (id: string) => {
    if (!confirm('Are you sure you want to delete this status report?')) return;
    try {
      await supabase.from('weekly_status').delete().eq('id', id);
      setStatuses(statuses.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedWeeks(newExpanded);
  };

  // Calculate metrics
  const latestStatus = statuses[0];
  const totalWeeks = statuses.length;
  const onTrackCount = statuses.filter(s => s.overall_status === 'on_track').length;

  if (loading) {
    return <div className="text-slate-600">Loading weekly status reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Weekly Status Reports</h3>
          <p className="text-sm text-slate-600">Track assessment progress and communicate status</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
          <span>New Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalWeeks}</p>
              <p className="text-sm text-slate-500">Total Weeks</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{onTrackCount}</p>
              <p className="text-sm text-slate-500">On Track</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {latestStatus?.completion_percentage || 0}%
              </p>
              <p className="text-sm text-slate-500">Completion</p>
            </div>
          </div>
        </div>
        <div className={`rounded-xl p-4 ${latestStatus ? getStatusColor(latestStatus.overall_status).bg : 'bg-slate-100'} border ${latestStatus ? getStatusColor(latestStatus.overall_status).border : 'border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${latestStatus ? getStatusColor(latestStatus.overall_status).bg : 'bg-slate-200'}`}>
              {latestStatus ? (
                (() => {
                  const StatusIcon = getStatusColor(latestStatus.overall_status).icon;
                  return <StatusIcon className={`w-5 h-5 ${getStatusColor(latestStatus.overall_status).text}`} />;
                })()
              ) : (
                <Clock className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div>
              <p className={`text-lg font-bold capitalize ${latestStatus ? getStatusColor(latestStatus.overall_status).text : 'text-slate-700'}`}>
                {latestStatus?.overall_status?.replace('_', ' ') || 'No Status'}
              </p>
              <p className="text-sm text-slate-500">Current Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {statuses.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No weekly status reports yet</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Create your first report →
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
            
            {statuses.map((status, index) => {
              const statusStyle = getStatusColor(status.overall_status);
              const StatusIcon = statusStyle.icon;
              const isExpanded = expandedWeeks.has(status.id);
              
              return (
                <div key={status.id} className="relative pl-14 pb-6">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full ${statusStyle.bg} border-2 ${statusStyle.border} flex items-center justify-center`}>
                    <div className={`w-2 h-2 rounded-full ${status.overall_status === 'on_track' ? 'bg-green-500' : status.overall_status === 'at_risk' ? 'bg-amber-500' : status.overall_status === 'delayed' ? 'bg-red-500' : 'bg-slate-400'}`} />
                  </div>
                  
                  <div className={`bg-white border rounded-lg overflow-hidden ${index === 0 ? 'border-indigo-200 shadow-md' : 'border-slate-200'}`}>
                    {/* Header - Always visible */}
                    <div 
                      className={`p-4 cursor-pointer hover:bg-slate-50 ${index === 0 ? 'bg-indigo-50' : ''}`}
                      onClick={() => toggleExpand(status.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-semibold text-slate-900">Week {status.week_number}</h4>
                              {index === 0 && (
                                <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">Latest</span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">
                              Ending {new Date(status.week_ending).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs rounded-full ${statusStyle.bg} ${statusStyle.text} capitalize`}>
                            {status.overall_status?.replace('_', ' ') || 'Pending'}
                          </span>
                          {status.completion_percentage !== undefined && (
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-slate-200 rounded-full">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${status.completion_percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-600">{status.completion_percentage}%</span>
                            </div>
                          )}
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {status.progress_summary && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Progress Summary
                              </h5>
                              <p className="text-sm text-green-700 whitespace-pre-wrap">{status.progress_summary}</p>
                            </div>
                          )}

                          {status.next_week_plan && (
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <h5 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Next Week Plan
                              </h5>
                              <p className="text-sm text-blue-700 whitespace-pre-wrap">{status.next_week_plan}</p>
                            </div>
                          )}

                          {status.blockers && (
                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                              <h5 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
                                <X className="w-4 h-4 mr-2" />
                                Blockers
                              </h5>
                              <p className="text-sm text-red-700 whitespace-pre-wrap">{status.blockers}</p>
                            </div>
                          )}

                          {status.risks && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                              <h5 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Risks
                              </h5>
                              <p className="text-sm text-amber-700 whitespace-pre-wrap">{status.risks}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteStatus(status.id); }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete Report
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showNewModal && (
        <NewStatusModal
          projectId={projectId}
          nextWeekNumber={statuses.length > 0 ? Math.max(...statuses.map(s => s.week_number)) + 1 : 1}
          onClose={() => setShowNewModal(false)}
          onStatusCreated={(status) => {
            setStatuses([status, ...statuses]);
            setExpandedWeeks(new Set([status.id]));
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}

function NewStatusModal({ projectId, nextWeekNumber, onClose, onStatusCreated }: {
  projectId: string;
  nextWeekNumber: number;
  onClose: () => void;
  onStatusCreated: (status: Status) => void;
}) {
  const [weekNumber, setWeekNumber] = useState(nextWeekNumber.toString());
  const [weekEnding, setWeekEnding] = useState(() => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() + (5 - day); // Get next Friday
    date.setDate(diff);
    return date.toISOString().split('T')[0];
  });
  const [progressSummary, setProgressSummary] = useState('');
  const [blockers, setBlockers] = useState('');
  const [risks, setRisks] = useState('');
  const [nextWeekPlan, setNextWeekPlan] = useState('');
  const [overallStatus, setOverallStatus] = useState<'on_track' | 'at_risk' | 'delayed'>('on_track');
  const [completionPercentage, setCompletionPercentage] = useState('25');
  const [loading, setLoading] = useState(false);

  const applyTemplate = (weekKey: keyof typeof statusTemplates) => {
    const template = statusTemplates[weekKey];
    setProgressSummary(template.progress);
    setBlockers(template.blockers);
    setRisks(template.risks);
    setNextWeekPlan(template.nextWeek);
  };

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
          overall_status: overallStatus,
          completion_percentage: parseInt(completionPercentage),
        })
        .select()
        .single();

      if (error) throw error;
      onStatusCreated(data);
    } catch (error) {
      console.error('Error creating status:', error);
      alert('Error creating status report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">New Weekly Status Report</h2>
            <p className="text-sm text-slate-600">Week {weekNumber} Status</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Templates */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">Quick Templates</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(statusTemplates).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyTemplate(key as keyof typeof statusTemplates)}
                    className="px-3 py-1.5 text-sm bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100"
                  >
                    {key.replace('week', 'Week ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Week #</label>
                <input
                  type="number"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(e.target.value)}
                  required
                  min="1"
                  max="52"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Week Ending</label>
                <input
                  type="date"
                  value={weekEnding}
                  onChange={(e) => setWeekEnding(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={overallStatus}
                  onChange={(e) => setOverallStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="on_track">On Track</option>
                  <option value="at_risk">At Risk</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Completion %</label>
                <input
                  type="number"
                  value={completionPercentage}
                  onChange={(e) => setCompletionPercentage(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Progress Summary */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                  Progress Summary
                </span>
              </label>
              <textarea
                value={progressSummary}
                onChange={(e) => setProgressSummary(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="• Completed stakeholder interviews&#10;• Reviewed security documentation&#10;• Assessed Identity pillar controls"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blockers */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <span className="flex items-center">
                    <X className="w-4 h-4 mr-1 text-red-600" />
                    Blockers
                  </span>
                </label>
                <textarea
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="• Awaiting access credentials&#10;• Pending documentation"
                />
              </div>

              {/* Risks */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <span className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />
                    Risks
                  </span>
                </label>
                <textarea
                  value={risks}
                  onChange={(e) => setRisks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="• Stakeholder availability&#10;• Scope expansion"
                />
              </div>
            </div>

            {/* Next Week Plan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <span className="flex items-center">
                  <ArrowRight className="w-4 h-4 mr-1 text-blue-600" />
                  Next Week Plan
                </span>
              </label>
              <textarea
                value={nextWeekPlan}
                onChange={(e) => setNextWeekPlan(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="• Complete Networks pillar assessment&#10;• Begin gap analysis&#10;• Schedule executive briefing"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-slate-200">
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
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
