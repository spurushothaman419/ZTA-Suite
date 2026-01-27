import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type AccessTier = 'public' | 'basic' | 'professional' | 'enterprise';

interface AccessContextType {
  accessTier: AccessTier;
  isPublicMode: boolean;
  isPaidUser: boolean;
  canAccessFeature: (feature: FeatureKey) => boolean;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  blockedFeature: string | null;
  requestFeatureAccess: (feature: string) => void;
}

export type FeatureKey = 
  | 'full_assessment'
  | 'export_reports'
  | 'save_progress'
  | 'multiple_projects'
  | 'charts'
  | 'roadmap'
  | 'evidence_upload'
  | 'stakeholders'
  | 'raid_log'
  | 'weekly_status'
  | 'all_pillars'
  | 'advanced_analytics';

// Define which features are available at each tier
const featureAccess: Record<AccessTier, FeatureKey[]> = {
  public: [
    // Limited demo features
  ],
  basic: [
    'save_progress',
    'charts',
  ],
  professional: [
    'save_progress',
    'charts',
    'full_assessment',
    'export_reports',
    'multiple_projects',
    'roadmap',
    'all_pillars',
  ],
  enterprise: [
    'save_progress',
    'charts',
    'full_assessment',
    'export_reports',
    'multiple_projects',
    'roadmap',
    'evidence_upload',
    'stakeholders',
    'raid_log',
    'weekly_status',
    'all_pillars',
    'advanced_analytics',
  ],
};

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export function AccessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [accessTier, setAccessTier] = useState<AccessTier>('public');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Check user's subscription tier from metadata or database
      // For now, authenticated users get 'basic' tier
      // In production, this would check Stripe subscription or database
      const userTier = (user.user_metadata?.access_tier as AccessTier) || 'basic';
      setAccessTier(userTier);
    } else {
      setAccessTier('public');
    }
  }, [user]);

  const isPublicMode = accessTier === 'public';
  const isPaidUser = accessTier === 'professional' || accessTier === 'enterprise';

  const canAccessFeature = (feature: FeatureKey): boolean => {
    return featureAccess[accessTier].includes(feature);
  };

  const requestFeatureAccess = (feature: string) => {
    setBlockedFeature(feature);
    setShowUpgradeModal(true);
  };

  return (
    <AccessContext.Provider
      value={{
        accessTier,
        isPublicMode,
        isPaidUser,
        canAccessFeature,
        showUpgradeModal,
        setShowUpgradeModal,
        blockedFeature,
        requestFeatureAccess,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (context === undefined) {
    throw new Error('useAccess must be used within an AccessProvider');
  }
  return context;
}
