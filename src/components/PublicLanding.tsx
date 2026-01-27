import { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  BarChart3,
  FileText,
  Users,
  Lock,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  TrendingUp,
  Award,
} from 'lucide-react';

type Props = {
  onSignIn: () => void;
  onTryDemo: () => void;
};

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: '8 Zero Trust Pillars',
    description: 'Comprehensive assessment covering Identity, Devices, Networks, Applications, Data, Visibility, Automation, and Governance.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Visual Analytics',
    description: 'Spider charts, gap analysis, and maturity distribution visualizations to understand your security posture.',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Guided Workflow',
    description: '50+ pre-defined tasks across 6 phases to guide assessors through the entire assessment process.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Roadmap Planning',
    description: 'Generate actionable roadmaps with prioritized recommendations for Zero Trust implementation.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Stakeholder Management',
    description: 'Track stakeholders, manage RACI matrices, and coordinate across teams.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'CISA ZTMM Aligned',
    description: 'Based on CISA Zero Trust Maturity Model v2.0 for federal compliance and best practices.',
  },
];

const maturityLevels = [
  { level: 'Traditional', color: 'bg-red-500', description: 'Manual processes, static policies' },
  { level: 'Initial', color: 'bg-yellow-500', description: 'Starting automation, some dynamic policies' },
  { level: 'Advanced', color: 'bg-blue-500', description: 'Automated processes, context-aware policies' },
  { level: 'Optimal', color: 'bg-green-500', description: 'Fully automated, continuous optimization' },
];

const faqs = [
  {
    question: 'What is the CISA Zero Trust Maturity Model?',
    answer: 'The CISA Zero Trust Maturity Model (ZTMM) is a framework developed by the Cybersecurity and Infrastructure Security Agency to help organizations implement Zero Trust architecture. It defines maturity levels across multiple pillars including Identity, Devices, Networks, Applications, and Data.',
  },
  {
    question: 'Who should use this assessment tool?',
    answer: 'This tool is designed for security professionals, IT managers, compliance officers, and consultants who need to assess and improve their organization\'s Zero Trust security posture. It\'s particularly useful for federal agencies and organizations following CISA guidelines.',
  },
  {
    question: 'What\'s included in the free version?',
    answer: 'The free version allows you to explore the assessment framework, view sample questions, and understand the maturity model. To save progress, generate reports, and access all features, you\'ll need to upgrade to a paid plan.',
  },
  {
    question: 'How long does an assessment take?',
    answer: 'A typical assessment takes 4-8 weeks depending on organization size and complexity. Our guided workflow breaks this into manageable phases with estimated timeframes for each task.',
  },
  {
    question: 'Can I export assessment results?',
    answer: 'Yes! Professional and Enterprise plans include export capabilities for PDF and Excel reports, making it easy to share findings with stakeholders and leadership.',
  },
];

export default function PublicLanding({ onSignIn, onTryDemo }: Props) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">ZTA-Suite</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onTryDemo}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Try Demo
              </button>
              <button
                onClick={onSignIn}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-6">
            <Star className="w-4 h-4 mr-2" />
            Based on CISA Zero Trust Maturity Model v2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Zero Trust Maturity
            <span className="text-indigo-400"> Assessment Tool</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Assess, visualize, and improve your organization's Zero Trust security posture with our comprehensive ZTMM assessment platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Try Free Demo
            </button>
            <button
              onClick={onSignIn}
              className="w-full sm:w-auto px-8 py-4 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold flex items-center justify-center"
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Maturity Levels Preview */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Four Maturity Levels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {maturityLevels.map((level, index) => (
              <div
                key={level.level}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-4 h-4 rounded-full ${level.color}`} />
                  <span className="font-semibold text-white">{level.level}</span>
                </div>
                <p className="text-sm text-slate-400">{level.description}</p>
                <div className="mt-4 text-xs text-slate-500">Level {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need for ZTMM Assessment
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A complete toolkit for conducting Zero Trust maturity assessments aligned with CISA guidelines
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                See Your Security Posture at a Glance
              </h2>
              <p className="text-slate-300 mb-6">
                Our interactive spider charts and analytics dashboards give you instant visibility into your Zero Trust maturity across all pillars.
              </p>
              <ul className="space-y-4">
                {[
                  'Overall maturity score with trend analysis',
                  'Per-pillar breakdown with detailed metrics',
                  'Gap analysis showing improvement areas',
                  'Comparison against industry benchmarks',
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onTryDemo}
                className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Try Interactive Demo
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
              {/* Mock Chart Preview */}
              <div className="aspect-square relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-indigo-500/30 rounded-full flex items-center justify-center">
                    <div className="w-36 h-36 border-2 border-indigo-500/50 rounded-full flex items-center justify-center">
                      <div className="w-24 h-24 border-2 border-indigo-500/70 rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                          2.8
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pillar Labels */}
                {['Identity', 'Devices', 'Networks', 'Apps', 'Data', 'Visibility', 'Automation', 'Governance'].map((pillar, index) => {
                  const angle = (index * 45 - 90) * (Math.PI / 180);
                  const x = 50 + 42 * Math.cos(angle);
                  const y = 50 + 42 * Math.sin(angle);
                  return (
                    <div
                      key={pillar}
                      className="absolute text-xs text-slate-400"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {pillar}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <p className="text-slate-400 text-sm">Sample Maturity Assessment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 mb-12">
            Start free, upgrade when you need more features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Free Demo</h3>
              <p className="text-3xl font-bold text-white mb-4">$0</p>
              <p className="text-slate-400 text-sm mb-6">Explore the framework</p>
              <button
                onClick={onTryDemo}
                className="w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Try Demo
              </button>
            </div>
            <div className="bg-indigo-600 rounded-xl p-6 transform scale-105">
              <div className="text-indigo-200 text-xs font-semibold mb-2">MOST POPULAR</div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional</h3>
              <p className="text-3xl font-bold text-white mb-4">$99<span className="text-lg">/mo</span></p>
              <p className="text-indigo-200 text-sm mb-6">Full assessment features</p>
              <button
                onClick={onSignIn}
                className="w-full py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
              >
                Get Started
              </button>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-3xl font-bold text-white mb-4">Custom</p>
              <p className="text-slate-400 text-sm mb-6">Advanced features & support</p>
              <a
                href="mailto:sales@zta-suite.com"
                className="block w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-center"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Assess Your Zero Trust Maturity?
          </h2>
          <p className="text-slate-400 mb-8">
            Start your free assessment today and get actionable insights to improve your security posture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Start Free Demo
            </button>
            <a
              href="mailto:sales@zta-suite.com"
              className="w-full sm:w-auto px-8 py-4 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold text-center"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Shield className="w-6 h-6 text-indigo-400" />
            <span className="text-white font-semibold">ZTA-Suite</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 ZTA-Suite. Based on CISA Zero Trust Maturity Model.
          </p>
        </div>
      </footer>
    </div>
  );
}
