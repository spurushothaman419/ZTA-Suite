import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Clock,
  AlertCircle,
  PlayCircle,
  Download
} from 'lucide-react';
import { assessmentPhases } from '../lib/assessmentPhases';
import {
  exportPhaseInstructionsToPDF,
  exportPhaseInstructionsToExcel,
  exportTaskInstructionsToPDF,
  exportTaskInstructionsToExcel,
} from '../lib/exportUtils';

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

type TaskFormData = {
  title: string;
  description: string;
  priority: string;
  due_date: string;
};

export default function PhasesView({ projectId }: Props) {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [deliverables, setDeliverables] = useState<Record<string, Deliverable[]>>({});
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState<string>('');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [subtaskProgress, setSubtaskProgress] = useState<Record<string, string[]>>({});
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  
  // Task modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });
  const [taskError, setTaskError] = useState<string | null>(null);
  const [savingTask, setSavingTask] = useState(false);

  useEffect(() => {
    loadData();
    const savedSub = localStorage.getItem(`assessment-subtasks-${projectId}`);
    if (savedSub) setSubtaskProgress(JSON.parse(savedSub));
    const savedNotes = localStorage.getItem(`task-notes-${projectId}`);
    if (savedNotes) setTaskNotes(JSON.parse(savedNotes));
  }, [projectId]);

  const loadData = async () => {
    try {
      // Fetch project name for exports
      const { data: projectData } = await supabase.from('projects').select('name').eq('id', projectId).single();
      if (projectData) setProjectName(projectData.name || 'Project');
      
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

  const saveSubtaskProgress = (newMap: Record<string, string[]>) => {
    setSubtaskProgress(newMap);
    localStorage.setItem(`assessment-subtasks-${projectId}`, JSON.stringify(newMap));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const current = subtaskProgress[taskId] || [];
    const exists = current.includes(subtaskId);
    const updated = exists ? current.filter(s => s !== subtaskId) : [...current, subtaskId];
    const newMap = { ...subtaskProgress, [taskId]: updated };
    saveSubtaskProgress(newMap);
  };

  const updateTaskNote = (taskId: string, note: string) => {
    const newNotes = { ...taskNotes, [taskId]: note };
    setTaskNotes(newNotes);
    localStorage.setItem(`task-notes-${projectId}`, JSON.stringify(newNotes));
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

  // Open modal for creating a new task
  const openCreateTaskModal = (phaseId: string) => {
    setSelectedPhaseId(phaseId);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
    });
    setTaskError(null);
    setShowTaskModal(true);
  };

  // Open modal for editing an existing task
  const openEditTaskModal = (task: Task) => {
    setSelectedPhaseId(task.phase_id);
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date || '',
    });
    setTaskError(null);
    setShowTaskModal(true);
  };

  // Close task modal
  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setSelectedPhaseId(null);
    setTaskError(null);
  };

  // Save task (create or update)
  const saveTask = async () => {
    if (!taskForm.title.trim()) {
      setTaskError('Task title is required');
      return;
    }

    if (!selectedPhaseId) {
      setTaskError('Phase not selected');
      return;
    }

    setSavingTask(true);
    setTaskError(null);

    try {
      if (editingTask) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            title: taskForm.title.trim(),
            description: taskForm.description.trim() || null,
            priority: taskForm.priority,
            due_date: taskForm.due_date || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTask.id);

        if (error) throw error;

        setTasks({
          ...tasks,
          [selectedPhaseId]: tasks[selectedPhaseId].map(t =>
            t.id === editingTask.id
              ? { ...t, ...taskForm, description: taskForm.description.trim() || '', due_date: taskForm.due_date || '' }
              : t
          ),
        });
      } else {
        // Create new task
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            phase_id: selectedPhaseId,
            title: taskForm.title.trim(),
            description: taskForm.description.trim() || null,
            priority: taskForm.priority,
            due_date: taskForm.due_date || null,
            status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;

        setTasks({
          ...tasks,
          [selectedPhaseId]: [...(tasks[selectedPhaseId] || []), data],
        });
      }

      closeTaskModal();
    } catch (error: any) {
      console.error('Error saving task:', error);
      setTaskError(error.message || 'Failed to save task');
    } finally {
      setSavingTask(false);
    }
  };

  // Delete task
  const deleteTask = async (taskId: string, phaseId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks({
        ...tasks,
        [phaseId]: tasks[phaseId].filter(t => t.id !== taskId),
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'blocked': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'blocked': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getTaskStats = (phaseTasks: Task[]) => {
    const total = phaseTasks.length;
    const completed = phaseTasks.filter(t => t.status === 'completed').length;
    const inProgress = phaseTasks.filter(t => t.status === 'in-progress').length;
    const blocked = phaseTasks.filter(t => t.status === 'blocked').length;
    return { total, completed, inProgress, blocked };
  };

  const getNextRecommendedTask = (): { phase: Phase; task: Task } | null => {
    // Find the first phase that's not completed
    for (const phase of phases) {
      const phaseTasks = tasks[phase.id] || [];
      if (phaseTasks.length === 0) continue;
      
      // Look for in-progress tasks first
      const inProgressTask = phaseTasks.find(t => t.status === 'in-progress');
      if (inProgressTask) return { phase, task: inProgressTask };
      
      // Then look for pending tasks (prioritize high/critical priority)
      const pendingTasks = phaseTasks.filter(t => t.status === 'pending');
      const criticalTask = pendingTasks.find(t => t.priority === 'critical');
      if (criticalTask) return { phase, task: criticalTask };
      
      const highTask = pendingTasks.find(t => t.priority === 'high');
      if (highTask) return { phase, task: highTask };
      
      // Any pending task
      if (pendingTasks.length > 0) return { phase, task: pendingTasks[0] };
    }
    return null;
  };

  if (loading) {
    return <div className="text-slate-600">Loading phases...</div>;
  }

  const nextTask = getNextRecommendedTask();

  return (
    <div className="space-y-4">
      {/* Next Recommended Task */}
      {nextTask && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <PlayCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-semibold text-indigo-900">Recommended Next Task</h3>
              </div>
              <p className="text-sm text-slate-700 mb-2">
                <span className="font-medium">{nextTask.task.title}</span>
                <span className="text-slate-500"> · {nextTask.phase.name}</span>
              </p>
              {nextTask.task.description && (
                <p className="text-xs text-slate-600 mb-3">{nextTask.task.description}</p>
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setExpandedPhases(new Set([nextTask.phase.id]));
                    setActiveTaskId(nextTask.task.id);
                    setTimeout(() => {
                      document.getElementById(`task-${nextTask.task.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Start Task
                </button>
                {nextTask.task.status === 'pending' && (
                  <button
                    onClick={() => updateTaskStatus(nextTask.task.id, nextTask.phase.id, 'in-progress')}
                    className="px-3 py-1.5 bg-white text-indigo-600 border border-indigo-200 text-sm rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Mark In Progress
                  </button>
                )}
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(nextTask.task.priority)}`}>
              {nextTask.task.priority}
            </span>
          </div>
        </div>
      )}

      {phases.map(phase => {
        const stats = getTaskStats(tasks[phase.id] || []);
        return (
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
                    {stats.total > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-4">
                            <span className="text-slate-600">
                              {stats.completed}/{stats.total} tasks completed
                            </span>
                            {stats.inProgress > 0 && (
                              <span className="text-blue-600">{stats.inProgress} in progress</span>
                            )}
                            {stats.blocked > 0 && (
                              <span className="text-red-600">{stats.blocked} blocked</span>
                            )}
                          </div>
                          <span className="font-medium text-slate-700">
                            {Math.round((stats.completed / stats.total) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        const staticPhase = assessmentPhases.find(p => p.number === phase.phase_number);
                        if (staticPhase) exportPhaseInstructionsToPDF(projectName || 'Project', staticPhase);
                      }}
                      className="px-2 py-1 text-xs bg-white border rounded text-slate-700 hover:bg-slate-50"
                      title="Export Phase Instructions (PDF)"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => {
                        const staticPhase = assessmentPhases.find(p => p.number === phase.phase_number);
                        if (staticPhase) exportPhaseInstructionsToExcel(projectName || 'Project', staticPhase);
                      }}
                      className="px-2 py-1 text-xs bg-white border rounded text-slate-700 hover:bg-slate-50"
                      title="Export Phase Instructions (Excel)"
                    >
                      Excel
                    </button>
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
            </div>

            {expandedPhases.has(phase.id) && (
              <div className="p-4 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-900">Tasks</h4>
                    <button
                      onClick={() => openCreateTaskModal(phase.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Task</span>
                    </button>
                  </div>
                  {tasks[phase.id]?.length > 0 ? (
                    <div className="space-y-2">
                      {tasks[phase.id].map(task => {
                        const staticPhase = assessmentPhases.find(p => p.number === phase.phase_number);
                        const staticTask = staticPhase?.tasks.find(st => st.title === task.title || st.id === task.id);
                        const isExpanded = activeTaskId === task.id;
                        
                        return (
                        <div key={task.id} id={`task-${task.id}`} className="flex flex-col bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between p-3">
                          <div className="flex items-center space-x-3 flex-1">
                            {getStatusIcon(task.status)}
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                              )}
                              {task.due_date && (
                                <p className="text-xs text-slate-500 mt-1">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {staticTask?.estimatedMinutes && (
                              <span className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {Math.round(staticTask.estimatedMinutes / 60)}h {staticTask.estimatedMinutes % 60}m
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, phase.id, e.target.value)}
                              className={`px-2 py-1 text-xs rounded border ${getStatusColor(task.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="blocked">Blocked</option>
                            </select>
                            <button
                              onClick={() => setActiveTaskId(isExpanded ? null : task.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                              title="Show details"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditTaskModal(task)}
                              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                              title="Edit task"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id, phase.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          </div>

                          {/* Task Details Panel */}
                          {isExpanded && staticTask && (
                            <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-3">
                              {/* Steps */}
                              {staticTask.steps && staticTask.steps.length > 0 && (
                                <div>
                                  <h6 className="text-sm font-medium text-slate-800 mb-1">📋 How to complete</h6>
                                  <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1">
                                    {staticTask.steps.map((s, i) => (
                                      <li key={i}>{s}</li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {/* Checklist/Subtasks */}
                              {staticTask.subtasks && staticTask.subtasks.length > 0 && (
                                <div>
                                  <h6 className="text-sm font-medium text-slate-800 mb-1">✅ Checklist</h6>
                                  <ul className="space-y-1">
                                    {staticTask.subtasks.map(st => (
                                      <li key={st.id} className="flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={(subtaskProgress[task.id] || []).includes(st.id)}
                                          onChange={() => toggleSubtask(task.id, st.id)}
                                          className="mr-2"
                                        />
                                        <span className="text-sm text-slate-700">{st.title}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Acceptance Criteria */}
                              {staticTask.acceptanceCriteria && staticTask.acceptanceCriteria.length > 0 && (
                                <div>
                                  <h6 className="text-sm font-medium text-slate-800 mb-1">✓ Acceptance Criteria</h6>
                                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                    {staticTask.acceptanceCriteria.map((ac, i) => (
                                      <li key={i}>{ac}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Deliverables */}
                              {staticTask.deliverables && staticTask.deliverables.length > 0 && (
                                <div>
                                  <h6 className="text-sm font-medium text-slate-800 mb-1">📄 Expected Deliverables</h6>
                                  <ul className="space-y-1 text-sm text-slate-700">
                                    {staticTask.deliverables.map((d, i) => (
                                      <li key={i}>• {d}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Templates */}
                              {(task.id === 'prep-2' || task.id === 'prep-3' || staticTask?.id === 'prep-2' || staticTask?.id === 'prep-3' || task.title.includes('Interview') || task.title.includes('Scope')) && (
                                <div>
                                  <h6 className="text-sm font-medium text-slate-800 mb-1">📥 Downloadable Templates</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {(task.id === 'prep-2' || staticTask?.id === 'prep-2' || task.title.includes('Scope')) && (
                                      <a
                                        href="/ZTA-Suite/templates/Assessment_Scope_Template.md"
                                        download
                                        className="inline-flex items-center px-3 py-1.5 text-xs bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                                      >
                                        <Download className="w-3 h-3 mr-1" />
                                        Scope Template
                                      </a>
                                    )}
                                    {(task.id === 'prep-3' || staticTask?.id === 'prep-3') && (
                                      <a
                                        href="/ZTA-Suite/templates/RACI_Matrix_Template.md"
                                        download
                                        className="inline-flex items-center px-3 py-1.5 text-xs bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                                      >
                                        <Download className="w-3 h-3 mr-1" />
                                        RACI Matrix
                                      </a>
                                    )}
                                    {task.title.includes('Interview') && (
                                      <a
                                        href="/ZTA-Suite/templates/Interview_Notes_Template.md"
                                        download
                                        className="inline-flex items-center px-3 py-1.5 text-xs bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                                      >
                                        <Download className="w-3 h-3 mr-1" />
                                        Interview Notes
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Task Notes */}
                              <div>
                                <h6 className="text-sm font-medium text-slate-800 mb-1">📝 Notes & Observations</h6>
                                <textarea
                                  value={taskNotes[task.id] || ''}
                                  onChange={(e) => updateTaskNote(task.id, e.target.value)}
                                  placeholder="Add notes, observations, decisions, or blockers..."
                                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-y"
                                  rows={3}
                                />
                                <p className="text-xs text-slate-500 mt-1">💡 Notes are saved automatically</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      <p className="text-sm text-slate-500 mb-2">No tasks yet</p>
                      <button
                        onClick={() => openCreateTaskModal(phase.id)}
                        className="text-sm text-slate-700 hover:text-slate-900 font-medium"
                      >
                        + Add your first task
                      </button>
                    </div>
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
        );
      })}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button onClick={closeTaskModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="taskTitle" className="block text-sm font-medium text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  id="taskTitle"
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Enter task description (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="taskPriority" className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="taskPriority"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="taskDueDate" className="block text-sm font-medium text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    id="taskDueDate"
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              {taskError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200 text-sm">
                  {taskError}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeTaskModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveTask}
                  disabled={savingTask}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {savingTask ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
