import { X, Check, Lock, Mail, Shield, Zap, Building2, Star } from 'lucide-react';
import { useAccess, AccessTier } from '../contexts/AccessContext';

type PricingTier = {
  id: AccessTier;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
};

const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'Get started with basic assessment features',
    icon: <Shield className="w-6 h-6" />,
    features: [
      'View assessment framework',
      'Basic maturity charts',
      'Save progress locally',
      'Limited to 1 project',
      'Community support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'Full assessment capabilities for security teams',
    icon: <Zap className="w-6 h-6" />,
    highlighted: true,
    features: [
      'Everything in Basic',
      'Full ZTMM assessment (all 8 pillars)',
      'Export PDF/Excel reports',
      'Unlimited projects',
      'Roadmap planning',
      'Gap analysis & recommendations',
      'Priority email support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Advanced features for large organizations',
    icon: <Building2 className="w-6 h-6" />,
    features: [
      'Everything in Professional',
      'Evidence management',
      'Stakeholder tracking',
      'RAID log management',
      'Weekly status reports',
      'Advanced analytics',
      'SSO integration',
      'Dedicated support',
      'Custom training',
    ],
  },
];

export default function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, blockedFeature, accessTier } = useAccess();

  if (!showUpgradeModal) return null;

  const handleContactSales = () => {
    window.open('mailto:sales@zta-suite.com?subject=ZTA-Suite Enterprise Inquiry&body=I am interested in learning more about ZTA-Suite Enterprise features.', '_blank');
  };

  const handleUpgrade = (tier: AccessTier) => {
    if (tier === 'enterprise') {
      handleContactSales();
    } else {
      // For professional tier, redirect to payment page or show contact form
      window.open('mailto:sales@zta-suite.com?subject=ZTA-Suite Professional Upgrade&body=I would like to upgrade to ZTA-Suite Professional.', '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white rounded-t-2xl">
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Unlock Full Access</h2>
            {blockedFeature && (
              <p className="text-indigo-100">
                Upgrade to access <span className="font-semibold">{blockedFeature}</span> and more premium features
              </p>
            )}
            {!blockedFeature && (
              <p className="text-indigo-100">
                Choose the plan that's right for your organization
              </p>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-xl border-2 p-6 transition-all ${
                  tier.highlighted
                    ? 'border-indigo-500 shadow-lg scale-105'
                    : 'border-slate-200 hover:border-slate-300'
                } ${accessTier === tier.id ? 'ring-2 ring-green-500' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                {accessTier === tier.id && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                    tier.highlighted ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                    <span className="text-slate-500">{tier.period}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={accessTier === tier.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    accessTier === tier.id
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : tier.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {accessTier === tier.id
                    ? 'Current Plan'
                    : tier.id === 'enterprise'
                    ? 'Contact Sales'
                    : 'Upgrade Now'}
                </button>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-8 bg-slate-50 rounded-xl p-6 text-center">
            <h4 className="font-semibold text-slate-900 mb-2">Need a custom solution?</h4>
            <p className="text-slate-600 mb-4">
              Contact us for custom pricing, volume discounts, or specific requirements
            </p>
            <div className="flex items-center justify-center space-x-4">
              <a
                href="mailto:sales@zta-suite.com"
                className="inline-flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Sales
              </a>
              <span className="text-slate-500">or call</span>
              <span className="font-semibold text-slate-700">+1 (555) 123-4567</span>
            </div>
          </div>

          {/* Features Comparison Note */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>All plans include secure cloud storage and regular updates.</p>
            <p>30-day money-back guarantee on all paid plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
