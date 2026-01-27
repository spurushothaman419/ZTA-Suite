import { useMemo } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Target,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { ztmmPillars, getMaturityFromScore, MaturityLevel } from '../lib/ztmmData';
import { getRecommendations } from '../lib/exportUtils';

type AssessmentAnswer = {
  questionId: string;
  pillarId: string;
  functionId: string;
  maturityLevel: MaturityLevel;
  notes: string;
  evidence: string;
};

type Props = {
  answers: Record<string, AssessmentAnswer>;
  targetLevel?: number; // Default target is Advanced (3)
};

const getMaturityScore = (level: MaturityLevel): number => {
  switch (level) {
    case 'Optimal': return 4;
    case 'Advanced': return 3;
    case 'Initial': return 2;
    default: return 1;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
    case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Low': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

const getBarColor = (score: number) => {
  if (score >= 3.5) return '#22c55e'; // green
  if (score >= 2.5) return '#3b82f6'; // blue
  if (score >= 1.5) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

export default function GapAnalysis({ answers, targetLevel = 3 }: Props) {
  const analysis = useMemo(() => {
    const pillarData = ztmmPillars.map(pillar => {
      const questionIds = pillar.functions.flatMap(f => f.questions.map(q => q.id));
      const answeredQuestions = questionIds.filter(id => answers[id]);
      
      let score = 0;
      if (answeredQuestions.length > 0) {
        const totalScore = answeredQuestions.reduce((sum, id) => {
          return sum + getMaturityScore(answers[id].maturityLevel);
        }, 0);
        score = totalScore / answeredQuestions.length;
      }
      
      const gap = Math.max(0, targetLevel - score);
      const completion = questionIds.length > 0 
        ? Math.round((answeredQuestions.length / questionIds.length) * 100) 
        : 0;
      
      let priority: string;
      if (gap >= 2) priority = 'Critical';
      else if (gap >= 1.5) priority = 'High';
      else if (gap >= 0.5) priority = 'Medium';
      else priority = 'Low';
      
      return {
        pillar,
        score,
        gap,
        priority,
        completion,
        maturityLevel: getMaturityFromScore(score),
        recommendations: getRecommendations(pillar.id, score),
      };
    });
    
    // Sort by gap (highest first)
    const sortedByGap = [...pillarData].sort((a, b) => b.gap - a.gap);
    
    // Calculate overall metrics
    const overallScore = pillarData.reduce((sum, p) => sum + p.score, 0) / pillarData.length;
    const overallGap = Math.max(0, targetLevel - overallScore);
    const criticalGaps = pillarData.filter(p => p.priority === 'Critical').length;
    const highGaps = pillarData.filter(p => p.priority === 'High').length;
    
    return {
      pillarData,
      sortedByGap,
      overallScore,
      overallGap,
      criticalGaps,
      highGaps,
    };
  }, [answers, targetLevel]);

  const chartData = analysis.pillarData.map(p => ({
    name: p.pillar.name.substring(0, 10),
    fullName: p.pillar.name,
    current: Number(p.score.toFixed(2)),
    target: targetLevel,
    gap: Number(p.gap.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Overall Score</p>
              <p className="text-3xl font-bold mt-1">{analysis.overallScore.toFixed(1)}</p>
              <p className="text-indigo-200 text-sm">{getMaturityFromScore(analysis.overallScore)}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-indigo-200" />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Gap to Target</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{analysis.overallGap.toFixed(1)}</p>
              <p className="text-slate-500 text-sm">points to Advanced</p>
            </div>
            <Target className="w-10 h-10 text-indigo-500" />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Critical Gaps</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{analysis.criticalGaps}</p>
              <p className="text-slate-500 text-sm">pillars need attention</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">High Priority</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{analysis.highGaps}</p>
              <p className="text-slate-500 text-sm">pillars to improve</p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Gap Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Current vs Target Maturity</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                        <p className="font-semibold text-slate-900">{data.fullName}</p>
                        <p className="text-sm text-slate-600">Current: {data.current} ({getMaturityFromScore(data.current)})</p>
                        <p className="text-sm text-slate-600">Target: {data.target} (Advanced)</p>
                        <p className="text-sm text-red-600">Gap: {data.gap}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="current" name="Current Score" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.current)} />
                ))}
              </Bar>
              <Bar dataKey="target" name="Target (Advanced)" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Gap Priority Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Pillar</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Current</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Target</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Gap</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Priority</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Completion</th>
              </tr>
            </thead>
            <tbody>
              {analysis.sortedByGap.map((item, index) => (
                <tr key={item.pillar.id} className={index % 2 === 0 ? 'bg-slate-50' : ''}>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{item.pillar.name}</div>
                    <div className="text-xs text-slate-500">{item.pillar.description}</div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="font-semibold">{item.score.toFixed(1)}</span>
                    <span className="text-xs text-slate-500 block">{item.maturityLevel}</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="font-semibold">{targetLevel}</span>
                    <span className="text-xs text-slate-500 block">Advanced</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`font-bold ${item.gap > 1 ? 'text-red-600' : item.gap > 0.5 ? 'text-orange-600' : 'text-green-600'}`}>
                      {item.gap.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-2 bg-slate-200 rounded-full mr-2">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${item.completion}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{item.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
          Prioritized Recommendations
        </h3>
        <div className="space-y-4">
          {analysis.sortedByGap
            .filter(item => item.gap > 0)
            .slice(0, 5)
            .map((item, index) => (
              <div key={item.pillar.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                      index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.pillar.name}</h4>
                      <p className="text-sm text-slate-500">
                        Current: {item.maturityLevel} → Target: Advanced
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="ml-11">
                  <p className="text-sm font-medium text-slate-700 mb-2">Key Actions:</p>
                  <ul className="space-y-2">
                    {item.recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-600">
                        <ArrowRight className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
        </div>
        
        {analysis.sortedByGap.filter(item => item.gap > 0).length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-slate-900">Excellent!</h4>
            <p className="text-slate-600">All pillars are at or above the target maturity level.</p>
          </div>
        )}
      </div>

      {/* Quick Wins */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
          Quick Wins (Low Effort, High Impact)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Enable MFA for all users', pillar: 'Identity', effort: 'Low', impact: 'High' },
            { title: 'Deploy EDR on all endpoints', pillar: 'Devices', effort: 'Medium', impact: 'High' },
            { title: 'Implement network segmentation', pillar: 'Networks', effort: 'Medium', impact: 'High' },
            { title: 'Enable encryption at rest', pillar: 'Data', effort: 'Low', impact: 'High' },
            { title: 'Centralize logging in SIEM', pillar: 'Visibility', effort: 'Medium', impact: 'High' },
            { title: 'Document security policies', pillar: 'Governance', effort: 'Low', impact: 'Medium' },
          ].map((win, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{win.title}</p>
                  <p className="text-sm text-slate-500">{win.pillar} Pillar</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {win.effort} Effort
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
