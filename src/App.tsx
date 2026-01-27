import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AccessProvider } from './contexts/AccessContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PublicLanding from './components/PublicLanding';
import UpgradeModal from './components/UpgradeModal';

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    return (
      <>
        <Dashboard />
        <UpgradeModal />
      </>
    );
  }

  // If user clicked "Sign In", show auth form
  if (showAuth) {
    return <Auth onBack={() => setShowAuth(false)} />;
  }

  // If user clicked "Try Demo", show dashboard in demo mode
  if (demoMode) {
    return (
      <>
        <Dashboard isDemo={true} onExitDemo={() => setDemoMode(false)} />
        <UpgradeModal />
      </>
    );
  }

  // Show public landing page
  return (
    <PublicLanding
      onSignIn={() => setShowAuth(true)}
      onTryDemo={() => setDemoMode(true)}
    />
  );
}

function App() {
  return (
    <AccessProvider>
      <AppContent />
    </AccessProvider>
  );
}

export default App;
