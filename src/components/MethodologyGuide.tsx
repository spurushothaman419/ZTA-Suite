import { Calculator, TrendingUp, Target, CheckCircle, BarChart3, Info, BookOpen, Lightbulb, Gauge, Shield, ListChecks, AlertTriangle } from 'lucide-react';

export default function MethodologyGuide() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Complete Assessment Methodology & Formulas</h2>
        </div>
        <p className="text-indigo-100">
          Comprehensive guide to all calculations, formulas, and logic used throughout the Zero Trust Assessment Suite
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Calculation Categories</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <Gauge className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-slate-900">ZTA Maturity Scoring</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-900">Gap Analysis</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-900">Compliance Scoring</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <ListChecks className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-slate-900">Phase Progress</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-slate-900">Completion Metrics</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-slate-900">Priority Determination</span>
          </div>
        </div>
      </div>

      {/* Maturity Levels */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Maturity Levels</h3>
        </div>
        <p className="text-slate-600 mb-4">
          The assessment uses four maturity levels based on the CISA Zero Trust Maturity Model (ZTMM). Each level is assigned a numerical score:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-red-900">Traditional</span>
              <span className="px-2 py-1 bg-red-200 text-red-900 rounded text-sm font-bold">1</span>
            </div>
            <p className="text-sm text-red-800">
              Manual processes, static security policies, limited visibility, and siloed operations
            </p>
          </div>
          <div className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-yellow-900">Initial</span>
              <span className="px-2 py-1 bg-yellow-200 text-yellow-900 rounded text-sm font-bold">2</span>
            </div>
            <p className="text-sm text-yellow-800">
              Starting automation, some dynamic policies, increased visibility, and initial integration
            </p>
          </div>
          <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-900">Advanced</span>
              <span className="px-2 py-1 bg-blue-200 text-blue-900 rounded text-sm font-bold">3</span>
            </div>
            <p className="text-sm text-blue-800">
              Automated processes, dynamic policies based on context, comprehensive visibility, and cross-pillar integration
            </p>
          </div>
          <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-green-900">Optimal</span>
              <span className="px-2 py-1 bg-green-200 text-green-900 rounded text-sm font-bold">4</span>
            </div>
            <p className="text-sm text-green-800">
              Fully automated, continuous optimization, real-time analytics, and organization-wide integration
            </p>
          </div>
        </div>
      </div>

      {/* Scoring Formulas */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calculator className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Scoring Formulas</h3>
        </div>
        
        <div className="space-y-6">
          {/* Question Score */}
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Question Score</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 font-mono text-sm">
              Score = Maturity Level Value
            </div>
            <p className="text-slate-600 text-sm">
              Each question is assigned a score based on the selected maturity level (1 for Traditional, 2 for Initial, 3 for Advanced, 4 for Optimal).
            </p>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Example:</span> If you select "Advanced" for a question, that question receives a score of <strong>3.0</strong>
              </p>
            </div>
          </div>

          {/* Function Score */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Function Score</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 font-mono text-sm">
              Function Score = Sum of Question Scores / Number of Answered Questions
            </div>
            <p className="text-slate-600 text-sm">
              The function score is calculated by averaging all answered questions within that specific function.
            </p>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Example:</span> A function has 3 questions with scores 2, 3, and 4<br />
                Function Score = (2 + 3 + 4) / 3 = <strong>3.0</strong>
              </p>
            </div>
          </div>

          {/* Pillar Score */}
          <div className="border-l-4 border-pink-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Pillar Score</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 font-mono text-sm">
              Pillar Score = Sum of All Question Scores in Pillar / Number of Answered Questions in Pillar
            </div>
            <p className="text-slate-600 text-sm">
              The pillar score is calculated by averaging all answered questions across all functions within that pillar.
            </p>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Example:</span> A pillar has 2 functions:<br />
                • Function 1: Questions scored 2, 3, 3 (avg = 2.67)<br />
                • Function 2: Questions scored 3, 4 (avg = 3.5)<br />
                Pillar Score = (2 + 3 + 3 + 3 + 4) / 5 = <strong>3.0</strong>
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Overall Maturity Score</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 font-mono text-sm">
              Overall Score = Sum of All Question Scores / Total Number of Answered Questions
            </div>
            <p className="text-slate-600 text-sm">
              The overall score represents your organization's overall Zero Trust maturity across all pillars and functions.
            </p>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Example:</span> Total of 50 questions answered with a combined score of 135<br />
                Overall Score = 135 / 50 = <strong>2.7</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Maturity Level Determination */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Maturity Level Determination</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Numerical scores are mapped back to maturity levels using the following thresholds:
        </p>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-32 font-mono font-semibold text-green-900">3.5 - 4.0</div>
            <div className="flex-1 text-green-800">→ <strong>Optimal</strong> maturity level</div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-32 font-mono font-semibold text-blue-900">2.5 - 3.49</div>
            <div className="flex-1 text-blue-800">→ <strong>Advanced</strong> maturity level</div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="w-32 font-mono font-semibold text-yellow-900">1.5 - 2.49</div>
            <div className="flex-1 text-yellow-800">→ <strong>Initial</strong> maturity level</div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="w-32 font-mono font-semibold text-red-900">1.0 - 1.49</div>
            <div className="flex-1 text-red-800">→ <strong>Traditional</strong> maturity level</div>
          </div>
        </div>
      </div>

      {/* Completion Percentage */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Completion Percentage</h3>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 mb-2 font-mono text-sm">
          Completion % = (Number of Answered Questions / Total Number of Questions) × 100
        </div>
        <p className="text-slate-600 mb-4">
          This metric tracks assessment progress and can be calculated for:
        </p>
        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start space-x-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span><strong>Overall Assessment:</strong> Across all pillars and functions</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span><strong>Individual Pillars:</strong> Progress within a specific pillar</span>
          </li>
        </ul>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Example:</span> 45 out of 150 total questions answered<br />
            Completion = (45 / 150) × 100 = <strong>30%</strong>
          </p>
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Gap Analysis</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Gap analysis helps identify the difference between your current maturity and your target maturity level.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 mb-4 font-mono text-sm">
          Gap = Target Maturity Score - Current Maturity Score
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-32 font-semibold text-green-900">Gap ≤ 1.0</div>
            <div className="flex-1 text-green-800">Low priority - Near target maturity</div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="w-32 font-semibold text-yellow-900">1.0 &lt; Gap ≤ 2.0</div>
            <div className="flex-1 text-yellow-800">Medium priority - Moderate improvement needed</div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="w-32 font-semibold text-red-900">Gap &gt; 2.0</div>
            <div className="flex-1 text-red-800">High priority - Significant improvement required</div>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Example:</span> Target maturity is Advanced (3.0), current score is 1.8<br />
            Gap = 3.0 - 1.8 = <strong>1.2</strong> (Medium priority)
          </p>
        </div>
      </div>

      {/* Assessment Framework */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-slate-900">Assessment Framework</h3>
        </div>
        <p className="text-slate-600 mb-4">
          The assessment is structured using the CISA Zero Trust Maturity Model framework:
        </p>
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">8 Pillars</h4>
                <p className="text-sm text-slate-600">Identity, Devices, Networks, Applications & Workloads, Data, Visibility & Analytics, Automation & Orchestration, Governance</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Multiple Functions per Pillar</h4>
                <p className="text-sm text-slate-600">Each pillar contains several capability functions (e.g., Authentication, Identity Stores, Risk Assessment)</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Assessment Questions per Function</h4>
                <p className="text-sm text-slate-600">Each function has specific questions with maturity indicators for all four levels</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h3 className="text-xl font-semibold text-slate-900">Assessment Best Practices</h3>
        </div>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Be Honest:</strong> Select maturity levels based on actual implementation, not aspirational goals</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Provide Evidence:</strong> Document your assessment with specific examples and evidence</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Add Notes:</strong> Include context and justification for your maturity level selections</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Involve Stakeholders:</strong> Gather input from technical teams and business leaders</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Review Regularly:</strong> Reassess maturity periodically to track progress over time</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Complete All Questions:</strong> Answer all questions for the most accurate overall score</span>
          </li>
        </ul>
      </div>

      {/* Gap Analysis Detailed Calculations */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-slate-900">Gap Analysis Calculations</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Gap analysis compares your current maturity against target levels to identify improvement priorities.
        </p>
        
        <div className="space-y-6">
          {/* Gap Score */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Gap Score Calculation</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 font-mono text-sm">
              Gap = Max(0, Target Score - Current Score)
            </div>
            <p className="text-slate-600 text-sm mb-2">
              Gap is calculated as the positive difference between target maturity (typically 3.0 for Advanced) and current score.
            </p>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Example:</span> Target is 3.0 (Advanced), Current is 1.8<br />
                Gap = Max(0, 3.0 - 1.8) = <strong>1.2</strong>
              </p>
            </div>
          </div>

          {/* Priority Determination */}
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Priority Level Determination</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 font-mono text-sm">
              Priority = Function(Gap Size)
            </div>
            <p className="text-slate-600 text-sm mb-3">
              Priority is automatically assigned based on the gap size:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-32 font-mono font-semibold text-red-900">Gap ≥ 2.0</div>
                <div className="flex-1 text-red-800">→ <strong>Critical Priority</strong> - Immediate action required</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-32 font-mono font-semibold text-orange-900">1.5 ≤ Gap &lt; 2.0</div>
                <div className="flex-1 text-orange-800">→ <strong>High Priority</strong> - Plan action within quarter</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-32 font-mono font-semibold text-yellow-900">0.5 ≤ Gap &lt; 1.5</div>
                <div className="flex-1 text-yellow-800">→ <strong>Medium Priority</strong> - Address in next 6 months</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-32 font-mono font-semibold text-green-900">Gap &lt; 0.5</div>
                <div className="flex-1 text-green-800">→ <strong>Low Priority</strong> - Monitor and maintain</div>
              </div>
            </div>
          </div>

          {/* Overall Gap Metrics */}
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Overall Gap Metrics</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 space-y-2 font-mono text-sm">
              <div>Overall Gap = Target - Overall Score</div>
              <div>Critical Gaps Count = Number of Pillars with Gap ≥ 2.0</div>
              <div>High Gaps Count = Number of Pillars with Gap ≥ 1.5</div>
            </div>
            <p className="text-slate-600 text-sm">
              These aggregate metrics help prioritize organizational improvement efforts across all pillars.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Scoring */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-900">Compliance Framework Scoring</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Compliance scoring tracks implementation status against regulatory frameworks (NIST, FedRAMP, etc.).
        </p>
        
        <div className="space-y-6">
          {/* Control Status Scoring */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Control Status Values</h4>
            <p className="text-slate-600 text-sm mb-3">
              Each control is assigned a weighted value based on implementation status:
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-32 font-semibold text-green-900">Implemented</div>
                <div className="flex-1 text-green-800">Value = <strong>1.0</strong> (Full credit)</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-32 font-semibold text-yellow-900">Partial</div>
                <div className="flex-1 text-yellow-800">Value = <strong>0.5</strong> (Half credit)</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-32 font-semibold text-red-900">Not Implemented</div>
                <div className="flex-1 text-red-800">Value = <strong>0.0</strong> (No credit)</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-32 font-semibold text-slate-900">Not Applicable</div>
                <div className="flex-1 text-slate-800">Value = <strong>Excluded</strong> (Not counted)</div>
              </div>
            </div>
          </div>

          {/* Compliance Score Formula */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Framework Compliance Score</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 space-y-2 font-mono text-sm">
              <div>Total Points = Σ (Control Status Values)</div>
              <div>Total Controls = Count of Applicable Controls</div>
              <div>Compliance % = (Total Points / Total Controls) × 100</div>
            </div>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Example:</span> Framework has 20 controls<br />
                • 10 Implemented (10 × 1.0 = 10 points)<br />
                • 6 Partial (6 × 0.5 = 3 points)<br />
                • 4 Not Implemented (4 × 0.0 = 0 points)<br />
                Total Points = 10 + 3 + 0 = 13<br />
                Compliance % = (13 / 20) × 100 = <strong>65%</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Progress Tracking */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <ListChecks className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-slate-900">Phase & Task Progress Tracking</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Progress tracking for implementation phases and individual tasks throughout the assessment project.
        </p>
        
        <div className="space-y-6">
          {/* Task Status */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Task Status Categories</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-32 font-semibold text-slate-900">Not Started</div>
                <div className="flex-1 text-slate-700">Task has not begun</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-32 font-semibold text-blue-900">In Progress</div>
                <div className="flex-1 text-blue-800">Task is actively being worked on</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-32 font-semibold text-green-900">Completed</div>
                <div className="flex-1 text-green-800">Task is finished (counts toward completion)</div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-32 font-semibold text-red-900">Blocked</div>
                <div className="flex-1 text-red-800">Task is blocked by dependencies or issues</div>
              </div>
            </div>
          </div>

          {/* Phase Progress Formula */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Phase Completion Percentage</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 space-y-2 font-mono text-sm">
              <div>Total Tasks = Count of All Tasks in Phase</div>
              <div>Completed Tasks = Count of Tasks with Status "Completed"</div>
              <div>Phase Progress % = (Completed Tasks / Total Tasks) × 100</div>
            </div>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Example:</span> Phase has 15 tasks<br />
                • 8 Completed<br />
                • 3 In Progress<br />
                • 2 Blocked<br />
                • 2 Not Started<br />
                Phase Progress = (8 / 15) × 100 = <strong>53%</strong>
              </p>
            </div>
          </div>

          {/* Phase Statistics */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Phase Statistics</h4>
            <div className="bg-slate-50 rounded-lg p-4 mb-2 space-y-2 font-mono text-sm">
              <div>Total = Count of all tasks in phase</div>
              <div>Completed = Count where status = "completed"</div>
              <div>In Progress = Count where status = "in-progress"</div>
              <div>Blocked = Count where status = "blocked"</div>
            </div>
            <p className="text-slate-600 text-sm">
              These counts help track task distribution and identify bottlenecks in project execution.
            </p>
          </div>
        </div>
      </div>

      {/* Overall Assessment Metrics */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-amber-600" />
          <h3 className="text-xl font-semibold text-slate-900">Overall Assessment Metrics</h3>
        </div>
        
        <div className="space-y-4">
          <div className="border-l-4 border-amber-500 pl-4">
            <h4 className="font-semibold text-slate-900 mb-2">Key Performance Indicators</h4>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm">
              <div>
                <p className="font-mono text-slate-700 mb-1">Assessment Completion = (Answered Questions / Total Questions) × 100</p>
                <p className="text-slate-600">Measures overall progress in completing the assessment</p>
              </div>
              <div className="border-t border-slate-300 pt-3">
                <p className="font-mono text-slate-700 mb-1">Pillar Completion = (Answered in Pillar / Total in Pillar) × 100</p>
                <p className="text-slate-600">Tracks completion status for each individual pillar</p>
              </div>
              <div className="border-t border-slate-300 pt-3">
                <p className="font-mono text-slate-700 mb-1">Average Pillar Score = Σ(All Pillar Scores) / Number of Pillars</p>
                <p className="text-slate-600">Provides alternative view of overall organizational maturity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Important Notes on Calculations</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span><strong>ZTA Maturity:</strong> Scores are calculated only from answered questions. Unanswered questions do not affect the score but reduce completion percentage.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span><strong>Equal Weighting:</strong> All pillars and functions are weighted equally in the overall score calculation.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span><strong>Linear Scale:</strong> The assessment uses a linear scale with equal intervals between maturity levels (1, 2, 3, 4).</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span><strong>CISA Standards:</strong> Maturity level thresholds are based on CISA ZTMM v2.0 standards and best practices.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span><strong>Compliance Weighting:</strong> Partial implementation gives 50% credit to encourage incremental progress.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span><strong>Rounding:</strong> Percentages are rounded to whole numbers for display. Internal calculations use full precision.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span><strong>Gap Priority:</strong> Priority levels are automatically assigned and cannot be manually overridden to ensure consistency.</span>
          </li>
        </ul>
      </div>

      {/* Calculation Example */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-300 rounded-lg p-6">
        <h4 className="font-semibold text-slate-900 mb-4 text-lg">Complete Calculation Example</h4>
        <div className="bg-white rounded-lg p-5 space-y-4 text-sm">
          <div>
            <p className="font-semibold text-slate-900 mb-2">Scenario: Identity Pillar Assessment</p>
            <ul className="space-y-1 text-slate-700 ml-4">
              <li>• Total Questions: 15</li>
              <li>• Answered: 12 questions</li>
              <li>• Scores: 3 Traditional (1), 4 Initial (2), 3 Advanced (3), 2 Optimal (4)</li>
            </ul>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <p className="font-semibold text-indigo-900 mb-2">Calculations:</p>
            <div className="bg-indigo-50 rounded p-3 space-y-2 font-mono text-xs">
              <p>Total Score = (3×1) + (4×2) + (3×3) + (2×4) = 3 + 8 + 9 + 8 = 28</p>
              <p>Pillar Score = 28 / 12 = 2.33</p>
              <p>Maturity Level = Initial (1.5 ≤ 2.33 &lt; 2.5)</p>
              <p>Completion = (12 / 15) × 100 = 80%</p>
              <p>Gap to Advanced = 3.0 - 2.33 = 0.67</p>
              <p>Priority = Medium (0.5 ≤ 0.67 &lt; 1.5)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
