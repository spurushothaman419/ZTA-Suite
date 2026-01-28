import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  Target,
  FileText,
  Users,
  Search,
  ClipboardCheck,
  BarChart3,
  Map,
  FileOutput,
  Lightbulb,
  AlertCircle,
  Play,
  Pause,
  SkipForward,
  Info,
} from 'lucide-react';
import {
  assessmentPhases,
  AssessmentPhase,
  AssessmentTask,
  TaskStatus,
} from '../lib/assessmentPhases';

type Props = {
  projectId: string;
};

type TaskProgress = Record<string, TaskStatus>;

const phaseIcons: Record<string, React.ReactNode> = {
  preparation: <FileText className="w-5 h-5" />,
  discovery: <Search className="w-5 h-5" />,
  assessment: <ClipboardCheck className="w-5 h-5" />,
  analysis: <BarChart3 className="w-5 h-5" />,
  recommendations: <Map className="w-5 h-5" />,
  reporting: <FileOutput className="w-5 h-5" />,
};

export default function AssessmentGuide({ projectId }: Props) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['preparation']));
  const [taskProgress, setTaskProgress] = useState<TaskProgress>({});
  const [activeTask, setActiveTask] = useState<AssessmentTask | null>(null);
  const [activePhase, setActivePhase] = useState<AssessmentPhase | null>(null);

  useEffect(() => {
    // Load saved progress from localStorage
    const saved = localStorage.getItem(`assessment-progress-${projectId}`);
    if (saved) {
      setTaskProgress(JSON.parse(saved));
    }
  }, [projectId]);

  const saveProgress = (newProgress: TaskProgress) => {
    setTaskProgress(newProgress);
    localStorage.setItem(`assessment-progress-${projectId}`, JSON.stringify(newProgress));
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

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const newProgress = { ...taskProgress, [taskId]: status };
    saveProgress(newProgress);
  };

  const getTaskStatus = (taskId: string): TaskStatus => {
    return taskProgress[taskId] || 'not_started';
  };

  const getPhaseProgress = (phase: AssessmentPhase): { completed: number; total: number; percentage: number } => {
    const total = phase.tasks.length;
    const completed = phase.tasks.filter(t => getTaskStatus(t.id) === 'completed').length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const getOverallProgress = (): { completed: number; total: number; percentage: number } => {
    const total = assessmentPhases.reduce((sum, p) => sum + p.tasks.length, 0);
    const completed = assessmentPhases.reduce(
      (sum, p) => sum + p.tasks.filter(t => getTaskStatus(t.id) === 'completed').length,
      0
    );
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-600" />;
      case 'skipped':
        return <SkipForward className="w-5 h-5 text-slate-400" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'skipped':
        return 'bg-slate-50 border-slate-200';
      default:
        return 'bg-white border-slate-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'required':
        return <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">Required</span>;
      case 'recommended':
        return <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Recommended</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">Optional</span>;
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCurrentPhase = (): AssessmentPhase | null => {
    for (const phase of assessmentPhases) {
      const progress = getPhaseProgress(phase);
      if (progress.percentage < 100) {
        return phase;
      }
    }
    return assessmentPhases[assessmentPhases.length - 1];
  };

  const getNextTask = (): AssessmentTask | null => {
    for (const phase of assessmentPhases) {
      for (const task of phase.tasks) {
        if (getTaskStatus(task.id) === 'not_started') {
          return task;
        }
      }
    }
    return null;
  };

  const overallProgress = getOverallProgress();
  const currentPhase = getCurrentPhase();
  const nextTask = getNextTask();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Assessment Guide</h3>
          <p className="text-sm text-slate-600">Step-by-step workflow for conducting ZTMM assessments</p>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium opacity-90">Assessment Progress</h4>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-4xl font-bold">{overallProgress.percentage}%</span>
              <span className="text-lg opacity-75">Complete</span>
            </div>
            <p className="mt-2 text-sm opacity-75">
              {overallProgress.completed} of {overallProgress.total} tasks completed
            </p>
          </div>
          <div className="text-right">
            {currentPhase && (
              <>
                <div className="text-sm opacity-75">Current Phase</div>
                <div className="text-xl font-semibold mt-1">
                  Phase {currentPhase.number}: {currentPhase.name}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full h-3 bg-white/20 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${overallProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {nextTask && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Next Task</h4>
              <p className="text-sm text-blue-700 mt-1">{nextTask.title}</p>
              <p className="text-xs text-blue-600 mt-1">{nextTask.description}</p>
              {nextTask.steps && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500 mb-1">How to complete this task</p>
                  <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1">
                    {nextTask.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                updateTaskStatus(nextTask.id, 'in_progress');
                const phase = assessmentPhases.find(p => p.tasks.some(t => t.id === nextTask.id));
                if (phase) {
                  setActivePhase(phase);
                  setActiveTask(nextTask);
                  setExpandedPhases(new Set([phase.id]));
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Start Task
            </button>
          </div>
        </div>
      )}

      {/* Phase Timeline */}
      <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4 overflow-x-auto">
        {assessmentPhases.map((phase, index) => {
          const progress = getPhaseProgress(phase);
          const isComplete = progress.percentage === 100;
          const isCurrent = currentPhase?.id === phase.id;

          return (
            <div key={phase.id} className="flex items-center">
              <div
                className={`flex flex-col items-center cursor-pointer ${
                  isCurrent ? 'scale-110' : ''
                }`}
                onClick={() => togglePhase(phase.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isComplete
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{phase.number}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium whitespace-nowrap ${
                    isCurrent ? 'text-indigo-600' : 'text-slate-600'
                  }`}
                >
                  {phase.name}
                </span>
                <span className="text-xs text-slate-400">{progress.percentage}%</span>
              </div>
              {index < assessmentPhases.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 rounded ${
                    isComplete ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Details */}
      <div className="space-y-4">
        {assessmentPhases.map(phase => {
          const progress = getPhaseProgress(phase);
          const isExpanded = expandedPhases.has(phase.id);

          return (
            <div
              key={phase.id}
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              {/* Phase Header */}
              <div
                className={`p-4 cursor-pointer transition-colors ${
                  isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                }`}
                onClick={() => togglePhase(phase.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    )}
                    <div
                      className={`p-2 rounded-lg ${
                        progress.percentage === 100
                          ? 'bg-green-100 text-green-600'
                          : 'bg-indigo-100 text-indigo-600'
                      }`}
                    >
                      {phaseIcons[phase.id]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Phase {phase.number}: {phase.name}
                      </h4>
                      <p className="text-sm text-slate-600">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {progress.completed}/{progress.total} tasks
                      </div>
                      <div className="text-xs text-slate-500">
                        Est. {phase.estimatedDays}
                      </div>
                    </div>
                    <div className="w-24">
                      <div className="w-full h-2 bg-slate-200 rounded-full">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progress.percentage === 100 ? 'bg-green-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Content */}
              {isExpanded && (
                <div className="border-t border-slate-200">
                  {/* Objectives & Deliverables */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Objectives
                      </h5>
                      <ul className="space-y-1">
                        {phase.objectives.map((obj, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Key Deliverables
                      </h5>
                      <ul className="space-y-1">
                        {phase.keyDeliverables.map((del, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {del}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="p-4 space-y-3">
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">Tasks</h5>
                    {phase.tasks.map(task => {
                      const status = getTaskStatus(task.id);
                      return (
                        <div
                          key={task.id}
                          className={`border rounded-lg p-4 transition-all ${getStatusColor(status)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <button
                                onClick={() => {
                                  const nextStatus: TaskStatus =
                                    status === 'not_started'
                                      ? 'in_progress'
                                      : status === 'in_progress'
                                      ? 'completed'
                                      : 'not_started';
                                  updateTaskStatus(task.id, nextStatus);
                                }}
                                className="mt-0.5"
                              >
                                {getStatusIcon(status)}
                              </button>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h6 className="font-medium text-slate-900">{task.title}</h6>
                                  {getPriorityBadge(task.priority)}
                                  {task.relatedPillar && (
                                    <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                                      {task.relatedPillar}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                                
                                {/* Task Details (expandable) */}
                                {(activeTask?.id === task.id || status === 'in_progress') && (
                                  <div className="mt-4 space-y-4">
                                    {task.tips && task.tips.length > 0 && (
                                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <h6 className="text-sm font-medium text-amber-800 flex items-center mb-2">
                                          <Lightbulb className="w-4 h-4 mr-2" />
                                          Tips & Guidance
                                        </h6>
                                        <ul className="space-y-1">
                                          {task.tips.map((tip, i) => (
                                            <li key={i} className="text-sm text-amber-700 flex items-start">
                                              <span className="mr-2">💡</span>
                                              {tip}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {task.deliverables && task.deliverables.length > 0 && (
                                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <h6 className="text-sm font-medium text-green-800 flex items-center mb-2">
                                          <FileText className="w-4 h-4 mr-2" />
                                          Expected Deliverables
                                        </h6>
                                        <ul className="space-y-1">
                                          {task.deliverables.map((del, i) => (
                                            <li key={i} className="text-sm text-green-700 flex items-start">
                                              <span className="mr-2">📄</span>
                                              {del}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <div className="flex items-center text-sm text-slate-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(task.estimatedMinutes)}
                              </div>
                              <button
                                onClick={() => {
                                  if (activeTask?.id === task.id) {
                                    setActiveTask(null);
                                  } else {
                                    setActiveTask(task);
                                    setActivePhase(phase);
                                  }
                                }}
                                className="p-1 hover:bg-slate-200 rounded"
                              >
                                <Info className="w-4 h-4 text-slate-400" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-200">
                            {status === 'not_started' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Start
                              </button>
                            )}
                            {status === 'in_progress' && (
                              <>
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'completed')}
                                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Complete
                                </button>
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'not_started')}
                                  className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 flex items-center"
                                >
                                  <Pause className="w-3 h-3 mr-1" />
                                  Pause
                                </button>
                              </>
                            )}
                            {status === 'completed' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, 'not_started')}
                                className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 flex items-center"
                              >
                                Reopen
                              </button>
                            )}
                            {status !== 'skipped' && status !== 'completed' && task.priority !== 'required' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, 'skipped')}
                                className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 flex items-center"
                              >
                                <SkipForward className="w-3 h-3 mr-1" />
                                Skip
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Success Criteria */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200">
                    <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Success Criteria
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.successCriteria.map((criteria, i) => (
                        <div key={i} className="flex items-center text-sm text-slate-600">
                          <Circle className="w-3 h-3 mr-2 text-slate-400" />
                          {criteria}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assessment Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
        <h4 className="font-semibold text-amber-900 flex items-center mb-4">
          <Lightbulb className="w-5 h-5 mr-2" />
          Assessment Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-amber-800 flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Be thorough:</strong> Collect evidence for every maturity rating</span>
            </p>
            <p className="text-sm text-amber-800 flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Stay objective:</strong> Base ratings on evidence, not aspirations</span>
            </p>
            <p className="text-sm text-amber-800 flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Engage stakeholders:</strong> Validate findings with SMEs</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-amber-800 flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Document everything:</strong> Keep detailed notes and evidence</span>
            </p>
            <p className="text-sm text-amber-800 flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Focus on gaps:</strong> Identify improvement opportunities</span>
            </p>
            <p className="text-sm text-amber-800 flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Prioritize risks:</strong> Connect gaps to business impact</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
