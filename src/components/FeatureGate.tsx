import { ReactNode } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useAccess, FeatureKey } from '../contexts/AccessContext';

type Props = {
  feature: FeatureKey;
  featureName: string;
  children: ReactNode;
  fallback?: ReactNode;
  showPreview?: boolean;
};

export default function FeatureGate({ 
  feature, 
  featureName, 
  children, 
  fallback,
  showPreview = true 
}: Props) {
  const { canAccessFeature, requestFeatureAccess } = useAccess();

  if (canAccessFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      {/* Blurred Preview */}
      {showPreview && (
        <div className="filter blur-sm pointer-events-none opacity-50">
          {children}
        </div>
      )}
      
      {/* Overlay */}
      <div className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center bg-slate-50/80 backdrop-blur-sm rounded-lg min-h-[200px]`}>
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {featureName}
          </h3>
          <p className="text-slate-600 mb-6">
            This feature is available in our Professional and Enterprise plans. Upgrade to unlock full access.
          </p>
          <button
            onClick={() => requestFeatureAccess(featureName)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Upgrade to Unlock
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple locked badge for tabs/buttons
export function LockedBadge() {
  return (
    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded text-xs">
      <Lock className="w-3 h-3" />
    </span>
  );
}

// Wrapper for tabs that should show locked state
type LockedTabProps = {
  feature: FeatureKey;
  featureName: string;
  children: ReactNode;
  onClick?: () => void;
};

export function LockedTab({ feature, featureName, children, onClick }: LockedTabProps) {
  const { canAccessFeature, requestFeatureAccess } = useAccess();

  if (canAccessFeature(feature)) {
    return <>{children}</>;
  }

  return (
    <button
      onClick={() => requestFeatureAccess(featureName)}
      className="flex items-center text-slate-400 cursor-pointer hover:text-slate-600"
    >
      {children}
      <LockedBadge />
    </button>
  );
}
