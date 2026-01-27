import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ChevronDown, 
  ChevronRight, 
  User, 
  Monitor, 
  Network, 
  AppWindow, 
  Database, 
  Eye, 
  Cog,
  Scale,
  CheckCircle2,
  Circle,
  HelpCircle,
  BarChart3,
  ClipboardList,
  Save,
  X,
  PieChart
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  ztmmPillars, 
  MaturityLevel, 
  getMaturityScore, 
  getMaturityFromScore,
  maturityLevelDescriptions,
  ZTMMPillar,
  ZTMMFunction,
  AssessmentQuestion
} from '../lib/ztmmData';

type Props = {
  projectId: string;
};

type AssessmentAnswer = {
  questionId: string;
  pillarId: string;
  functionId: string;
  maturityLevel: MaturityLevel;
  notes: string;
  evidence: string;
};

type ViewMode = 'overview' | 'assessment' | 'results' | 'charts';

const pillarIcons: Record<string, React.ReactNode> = {
  User: <User className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Network: <Network className="w-5 h-5" />,
  AppWindow: <AppWindow className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
  Cog: <Cog className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
};

const CHART_COLORS = {
  current: '#3b82f6',
  target: '#22c55e',
  traditional: '#ef4444',
  initial: '#f59e0b',
  advanced: '#3b82f6',
  optimal: '#22c55e',
};

export default function ZTAMaturity({ projectId }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [expandedPillars, setExpandedPillars] = useState<Set<string>>(new Set());
  const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswer>>({});
  const [activeQuestion, setActiveQuestion] = useState<AssessmentQuestion | null>(null);
  const [activePillar, setActivePillar] = useState<ZTMMPillar | null>(null);
  const [activeFunction, setActiveFunction] = useState<ZTMMFunction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAssessmentData();
  }, [projectId]);

  const loadAssessmentData = async () => {
    try {
      const { data } = await supabase
        .from('zta_capabilities')
        .select('*')
        .eq('pillar_id', projectId);

      // Load saved answers from localStorage for now (can be moved to DB later)
      const savedAnswers = localStorage.getItem(`ztmm-answers-${projectId}`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch (error) {
      console.error('Error loading assessment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAnswers = async () => {
    setSaving(true);
    try {
      localStorage.setItem(`ztmm-answers-${projectId}`, JSON.stringify(answers));
      // Could also save to Supabase here
    } catch (error) {
      console.error('Error saving answers:', error);
    } finally {
      setSaving(false);
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

  const toggleFunction = (functionId: string) => {
    const newExpanded = new Set(expandedFunctions);
    if (newExpanded.has(functionId)) {
      newExpanded.delete(functionId);
    } else {
      newExpanded.add(functionId);
    }
    setExpandedFunctions(newExpanded);
  };

  const updateAnswer = (questionId: string, pillarId: string, functionId: string, update: Partial<AssessmentAnswer>) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        pillarId,
        functionId,
        maturityLevel: 'Traditional',
        notes: '',
        evidence: '',
        ...prev[questionId],
        ...update,
      },
    }));
  };

  const getPillarScore = (pillarId: string): number => {
    const pillar = ztmmPillars.find(p => p.id === pillarId);
    if (!pillar) return 0;

    const questionIds = pillar.functions.flatMap(f => f.questions.map(q => q.id));
    const answeredQuestions = questionIds.filter(id => answers[id]);
    
    if (answeredQuestions.length === 0) return 0;

    const totalScore = answeredQuestions.reduce((sum, id) => {
      return sum + getMaturityScore(answers[id].maturityLevel);
    }, 0);

    return totalScore / answeredQuestions.length;
  };

  const getFunctionScore = (functionId: string): number => {
    const func = ztmmPillars.flatMap(p => p.functions).find(f => f.id === functionId);
    if (!func) return 0;

    const answeredQuestions = func.questions.filter(q => answers[q.id]);
    if (answeredQuestions.length === 0) return 0;

    const totalScore = answeredQuestions.reduce((sum, q) => {
      return sum + getMaturityScore(answers[q.id].maturityLevel);
    }, 0);

    return totalScore / answeredQuestions.length;
  };

  const getOverallScore = (): number => {
    const allQuestionIds = ztmmPillars.flatMap(p => p.functions.flatMap(f => f.questions.map(q => q.id)));
    const answeredQuestions = allQuestionIds.filter(id => answers[id]);
    
    if (answeredQuestions.length === 0) return 0;

    const totalScore = answeredQuestions.reduce((sum, id) => {
      return sum + getMaturityScore(answers[id].maturityLevel);
    }, 0);

    return totalScore / answeredQuestions.length;
  };

  const getCompletionPercentage = (pillarId?: string): number => {
    let totalQuestions: number;
    let answeredCount: number;

    if (pillarId) {
      const pillar = ztmmPillars.find(p => p.id === pillarId);
      if (!pillar) return 0;
      totalQuestions = pillar.functions.reduce((sum, f) => sum + f.questions.length, 0);
      answeredCount = pillar.functions.reduce((sum, f) => 
        sum + f.questions.filter(q => answers[q.id]).length, 0);
    } else {
      totalQuestions = ztmmPillars.reduce((sum, p) => 
        sum + p.functions.reduce((fSum, f) => fSum + f.questions.length, 0), 0);
      answeredCount = Object.keys(answers).length;
    }

    return totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  };

  const getMaturityColor = (level: MaturityLevel | string) => {
    switch (level) {
      case 'Optimal': return 'bg-green-100 text-green-800 border-green-300';
      case 'Advanced': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Initial': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getMaturityBgColor = (level: MaturityLevel | string) => {
    switch (level) {
      case 'Optimal': return 'bg-green-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Initial': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const openQuestionModal = (question: AssessmentQuestion, pillar: ZTMMPillar, func: ZTMMFunction) => {
    setActiveQuestion(question);
    setActivePillar(pillar);
    setActiveFunction(func);
  };

  const closeQuestionModal = () => {
    setActiveQuestion(null);
    setActivePillar(null);
    setActiveFunction(null);
  };

  if (loading) {
    return <div className="text-slate-600">Loading ZTMM assessment...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">CISA Zero Trust Maturity Model Assessment</h3>
          <p className="text-sm text-slate-600">Comprehensive assessment based on CISA ZTMM v2.0</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={saveAnswers}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Progress'}</span>
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setViewMode('overview')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </div>
        </button>
        <button
          onClick={() => setViewMode('assessment')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'assessment' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-4 h-4" />
            <span>Assessment</span>
          </div>
        </button>
        <button
          onClick={() => setViewMode('results')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'results' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Results</span>
          </div>
        </button>
        <button
          onClick={() => setViewMode('charts')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'charts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4" />
            <span>Charts</span>
          </div>
        </button>
      </div>

      {/* Overview View */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Overall Score Card */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium opacity-90">Overall Maturity Score</h4>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-4xl font-bold">{getOverallScore().toFixed(1)}</span>
                  <span className="text-lg opacity-75">/ 4.0</span>
                </div>
                <p className="mt-2 text-sm opacity-75">
                  Current Level: <span className="font-semibold">{getMaturityFromScore(getOverallScore())}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-75">Assessment Progress</div>
                <div className="text-3xl font-bold mt-1">{getCompletionPercentage()}%</div>
                <div className="w-32 h-2 bg-white/20 rounded-full mt-2">
                  <div 
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pillar Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ztmmPillars.map(pillar => {
              const score = getPillarScore(pillar.id);
              const maturity = getMaturityFromScore(score);
              const completion = getCompletionPercentage(pillar.id);
              
              return (
                <div 
                  key={pillar.id} 
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setViewMode('assessment');
                    setExpandedPillars(new Set([pillar.id]));
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${getMaturityColor(maturity)}`}>
                      {pillarIcons[pillar.icon]}
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900">{pillar.name}</h5>
                      <p className="text-xs text-slate-500">{pillar.functions.length} functions</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Score</span>
                      <span className="font-semibold">{score.toFixed(1)} / 4.0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Level</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getMaturityColor(maturity)}`}>
                        {maturity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-slate-900">{completion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full">
                      <div 
                        className={`h-full rounded-full transition-all ${getMaturityBgColor(maturity)}`}
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Maturity Level Legend */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-3">Maturity Level Definitions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.entries(maturityLevelDescriptions) as [MaturityLevel, string][]).map(([level, description]) => (
                <div key={level} className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${getMaturityBgColor(level)}`} />
                  <div>
                    <p className="font-medium text-slate-900">{level}</p>
                    <p className="text-xs text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assessment View */}
      {viewMode === 'assessment' && (
        <div className="space-y-4">
          {ztmmPillars.map(pillar => (
            <div key={pillar.id} className="border border-slate-200 rounded-lg overflow-hidden">
              {/* Pillar Header */}
              <div 
                className="bg-slate-50 p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => togglePillar(pillar.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {expandedPillars.has(pillar.id) ? (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    )}
                    <div className={`p-2 rounded-lg ${getMaturityColor(getMaturityFromScore(getPillarScore(pillar.id)))}`}>
                      {pillarIcons[pillar.icon]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{pillar.name}</h4>
                      <p className="text-sm text-slate-600">{pillar.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {getPillarScore(pillar.id).toFixed(1)} / 4.0
                      </div>
                      <div className="text-xs text-slate-500">
                        {getCompletionPercentage(pillar.id)}% complete
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${getMaturityColor(getMaturityFromScore(getPillarScore(pillar.id)))}`}>
                      {getMaturityFromScore(getPillarScore(pillar.id))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pillar Functions */}
              {expandedPillars.has(pillar.id) && (
                <div className="p-4 space-y-3">
                  {pillar.functions.map(func => (
                    <div key={func.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      {/* Function Header */}
                      <div 
                        className="bg-white p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => toggleFunction(func.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {expandedFunctions.has(func.id) ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500" />
                            )}
                            <div>
                              <h5 className="font-medium text-slate-900">{func.name}</h5>
                              <p className="text-xs text-slate-500">{func.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-slate-600">
                              {func.questions.filter(q => answers[q.id]).length}/{func.questions.length} answered
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getMaturityColor(getMaturityFromScore(getFunctionScore(func.id)))}`}>
                              {getMaturityFromScore(getFunctionScore(func.id))}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Function Questions */}
                      {expandedFunctions.has(func.id) && (
                        <div className="border-t border-slate-200 p-3 space-y-2 bg-slate-50">
                          {func.questions.map((question, idx) => {
                            const answer = answers[question.id];
                            const isAnswered = !!answer;
                            
                            return (
                              <div 
                                key={question.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  isAnswered 
                                    ? 'bg-white border-slate-200 hover:border-slate-300' 
                                    : 'bg-white border-dashed border-slate-300 hover:border-slate-400'
                                }`}
                                onClick={() => openQuestionModal(question, pillar, func)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3 flex-1">
                                    <div className="mt-0.5">
                                      {isAnswered ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-slate-300" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-slate-900">
                                        Q{idx + 1}: {question.question}
                                      </p>
                                      {isAnswered && (
                                        <div className="mt-2 flex items-center space-x-2">
                                          <span className={`px-2 py-0.5 text-xs rounded-full ${getMaturityColor(answer.maturityLevel)}`}>
                                            {answer.maturityLevel}
                                          </span>
                                          {answer.notes && (
                                            <span className="text-xs text-slate-500 truncate max-w-xs">
                                              {answer.notes}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <HelpCircle className="w-4 h-4 text-slate-400 ml-2" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Results View */}
      {viewMode === 'results' && (
        <div className="space-y-6">
          {/* Summary Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-900">Assessment Results Summary</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Pillar</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Functions</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Questions</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Answered</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Maturity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ztmmPillars.map(pillar => {
                    const totalQuestions = pillar.functions.reduce((sum, f) => sum + f.questions.length, 0);
                    const answeredQuestions = pillar.functions.reduce((sum, f) => 
                      sum + f.questions.filter(q => answers[q.id]).length, 0);
                    const score = getPillarScore(pillar.id);
                    const maturity = getMaturityFromScore(score);
                    
                    return (
                      <tr key={pillar.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1.5 rounded ${getMaturityColor(maturity)}`}>
                              {pillarIcons[pillar.icon]}
                            </div>
                            <span className="font-medium text-slate-900">{pillar.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{pillar.functions.length}</td>
                        <td className="px-4 py-3 text-center text-sm text-slate-600">{totalQuestions}</td>
                        <td className="px-4 py-3 text-center text-sm text-slate-600">{answeredQuestions}</td>
                        <td className="px-4 py-3 text-center text-sm font-medium text-slate-900">{score.toFixed(1)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${getMaturityColor(maturity)}`}>
                            {maturity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Overall</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {ztmmPillars.reduce((sum, p) => sum + p.functions.length, 0)}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-slate-600">
                      {ztmmPillars.reduce((sum, p) => sum + p.functions.reduce((fSum, f) => fSum + f.questions.length, 0), 0)}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-slate-600">
                      {Object.keys(answers).length}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-900">
                      {getOverallScore().toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getMaturityColor(getMaturityFromScore(getOverallScore()))}`}>
                        {getMaturityFromScore(getOverallScore())}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Detailed Function Results */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-900">Detailed Function Assessment</h4>
            </div>
            <div className="p-4 space-y-4">
              {ztmmPillars.map(pillar => (
                <div key={pillar.id} className="space-y-2">
                  <h5 className="font-medium text-slate-900 flex items-center space-x-2">
                    <span className={`p-1 rounded ${getMaturityColor(getMaturityFromScore(getPillarScore(pillar.id)))}`}>
                      {pillarIcons[pillar.icon]}
                    </span>
                    <span>{pillar.name}</span>
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-7">
                    {pillar.functions.map(func => {
                      const score = getFunctionScore(func.id);
                      const maturity = getMaturityFromScore(score);
                      const answered = func.questions.filter(q => answers[q.id]).length;
                      
                      return (
                        <div 
                          key={func.id}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm text-slate-700">{func.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-500">{answered}/{func.questions.length}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getMaturityColor(maturity)}`}>
                              {score > 0 ? maturity : 'N/A'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts View */}
      {viewMode === 'charts' && (
        <div className="space-y-8">
          {/* Overall Maturity Spider Chart */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Overall Zero Trust Maturity Assessment</h4>
            <p className="text-sm text-slate-600 mb-6">Spider chart showing maturity scores across all ZTMM pillars</p>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  data={ztmmPillars.map(pillar => ({
                    pillar: pillar.name,
                    current: getPillarScore(pillar.id),
                    target: 4,
                    fullMark: 4,
                  }))}
                >
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis 
                    dataKey="pillar" 
                    tick={{ fill: '#475569', fontSize: 12 }}
                    tickLine={false}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 4]} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickCount={5}
                    axisLine={false}
                  />
                  <Radar
                    name="Target (Optimal)"
                    dataKey="target"
                    stroke={CHART_COLORS.target}
                    fill={CHART_COLORS.target}
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Radar
                    name="Current Score"
                    dataKey="current"
                    stroke={CHART_COLORS.current}
                    fill={CHART_COLORS.current}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value.toFixed(2), '']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: CHART_COLORS.current, opacity: 0.5 }} />
                <span className="text-slate-600">Current Maturity: <span className="font-semibold">{getOverallScore().toFixed(2)}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2 border-dashed" style={{ borderColor: CHART_COLORS.target }} />
                <span className="text-slate-600">Target (Optimal): <span className="font-semibold">4.00</span></span>
              </div>
            </div>
          </div>

          {/* Individual Pillar Spider Charts */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Individual Pillar Assessments</h4>
            <p className="text-sm text-slate-600 mb-6">Detailed spider charts showing function-level maturity within each pillar</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ztmmPillars.map(pillar => {
                const pillarData = pillar.functions.map(func => ({
                  function: func.name.length > 15 ? func.name.substring(0, 15) + '...' : func.name,
                  fullName: func.name,
                  current: getFunctionScore(func.id),
                  target: 4,
                  fullMark: 4,
                }));

                const pillarScore = getPillarScore(pillar.id);
                const maturity = getMaturityFromScore(pillarScore);

                return (
                  <div key={pillar.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getMaturityColor(maturity)}`}>
                          {pillarIcons[pillar.icon]}
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-900">{pillar.name}</h5>
                          <p className="text-xs text-slate-500">{pillar.functions.length} functions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{pillarScore.toFixed(2)}</div>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getMaturityColor(maturity)}`}>
                          {maturity}
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={pillarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis 
                            dataKey="function" 
                            tick={{ fill: '#475569', fontSize: 10 }}
                            tickLine={false}
                          />
                          <PolarRadiusAxis 
                            angle={90} 
                            domain={[0, 4]} 
                            tick={{ fill: '#94a3b8', fontSize: 9 }}
                            tickCount={5}
                            axisLine={false}
                          />
                          <Radar
                            name="Target"
                            dataKey="target"
                            stroke={CHART_COLORS.target}
                            fill={CHART_COLORS.target}
                            fillOpacity={0.1}
                            strokeWidth={1}
                            strokeDasharray="3 3"
                          />
                          <Radar
                            name="Current"
                            dataKey="current"
                            stroke={CHART_COLORS.current}
                            fill={CHART_COLORS.current}
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Tooltip 
                            formatter={(value: number, name: string, props: any) => [
                              value.toFixed(2), 
                              props.payload.fullName
                            ]}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              fontSize: '12px'
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Function scores list */}
                    <div className="mt-4 space-y-1">
                      {pillar.functions.map(func => {
                        const score = getFunctionScore(func.id);
                        const funcMaturity = getMaturityFromScore(score);
                        return (
                          <div key={func.id} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 truncate flex-1">{func.name}</span>
                            <div className="flex items-center space-x-2 ml-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${getMaturityBgColor(funcMaturity)}`}
                                  style={{ width: `${(score / 4) * 100}%` }}
                                />
                              </div>
                              <span className="text-slate-900 font-medium w-8 text-right">{score.toFixed(1)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maturity Distribution Chart */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Maturity Level Distribution</h4>
            <p className="text-sm text-slate-600 mb-6">Comparison of current vs target maturity levels across all pillars</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['Traditional', 'Initial', 'Advanced', 'Optimal'] as MaturityLevel[]).map(level => {
                const pillarsAtLevel = ztmmPillars.filter(p => 
                  getMaturityFromScore(getPillarScore(p.id)) === level
                ).length;
                const percentage = (pillarsAtLevel / ztmmPillars.length) * 100;
                
                return (
                  <div key={level} className={`p-4 rounded-lg border ${getMaturityColor(level)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{level}</span>
                      <span className="text-2xl font-bold">{pillarsAtLevel}</span>
                    </div>
                    <div className="text-sm opacity-75">
                      {percentage.toFixed(0)}% of pillars
                    </div>
                    <div className="mt-2 h-2 bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getMaturityBgColor(level)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gap Analysis Summary */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Gap Analysis Summary</h4>
            <p className="text-sm text-slate-600 mb-6">Distance from optimal maturity level for each pillar</p>
            
            <div className="space-y-4">
              {ztmmPillars.map(pillar => {
                const score = getPillarScore(pillar.id);
                const gap = 4 - score;
                const maturity = getMaturityFromScore(score);
                
                return (
                  <div key={pillar.id} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-48">
                      <div className={`p-1.5 rounded ${getMaturityColor(maturity)}`}>
                        {pillarIcons[pillar.icon]}
                      </div>
                      <span className="text-sm font-medium text-slate-900 truncate">{pillar.name}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full rounded-full ${getMaturityBgColor(maturity)}`}
                            style={{ width: `${(score / 4) * 100}%` }}
                          />
                          <div 
                            className="absolute top-0 right-0 h-full bg-slate-300 opacity-50"
                            style={{ width: `${(gap / 4) * 100}%` }}
                          />
                        </div>
                        <div className="w-20 text-right">
                          <span className="text-sm font-medium text-slate-900">{score.toFixed(2)}</span>
                          <span className="text-xs text-slate-500"> / 4.0</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className={`text-sm font-medium ${gap > 2 ? 'text-red-600' : gap > 1 ? 'text-yellow-600' : 'text-green-600'}`}>
                        Gap: {gap.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Question Assessment Modal */}
      {activeQuestion && activePillar && activeFunction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 mb-1">
                    <span>{activePillar.name}</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>{activeFunction.name}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{activeQuestion.question}</h3>
                </div>
                <button 
                  onClick={closeQuestionModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Guidance */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-1">Assessment Guidance</h4>
                <p className="text-sm text-blue-800">{activeQuestion.guidance}</p>
              </div>

              {/* Maturity Level Selection */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Select Current Maturity Level</h4>
                <div className="space-y-3">
                  {(['Traditional', 'Initial', 'Advanced', 'Optimal'] as MaturityLevel[]).map(level => {
                    const indicator = level === 'Traditional' ? activeQuestion.traditionalIndicator :
                                     level === 'Initial' ? activeQuestion.initialIndicator :
                                     level === 'Advanced' ? activeQuestion.advancedIndicator :
                                     activeQuestion.optimalIndicator;
                    const isSelected = answers[activeQuestion.id]?.maturityLevel === level;
                    
                    return (
                      <div
                        key={level}
                        onClick={() => updateAnswer(activeQuestion.id, activePillar.id, activeFunction.id, { maturityLevel: level })}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? `${getMaturityColor(level)} border-current` 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                            isSelected ? 'border-current bg-current' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{level}</span>
                              <span className="text-xs text-slate-500">({getMaturityScore(level)}/4)</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{indicator}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-medium text-slate-900 mb-2">Assessment Notes</label>
                <textarea
                  value={answers[activeQuestion.id]?.notes || ''}
                  onChange={(e) => updateAnswer(activeQuestion.id, activePillar.id, activeFunction.id, { notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Document your observations, findings, or justification for the selected maturity level..."
                />
              </div>

              {/* Evidence */}
              <div>
                <label className="block font-medium text-slate-900 mb-2">Evidence / References</label>
                <textarea
                  value={answers[activeQuestion.id]?.evidence || ''}
                  onChange={(e) => updateAnswer(activeQuestion.id, activePillar.id, activeFunction.id, { evidence: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Reference documents, screenshots, or other evidence supporting your assessment..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={closeQuestionModal}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveAnswers();
                  closeQuestionModal();
                }}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
