import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccess, FeatureKey } from '../contexts/AccessContext';
import { supabase } from '../lib/supabase';
import { LogOut, Shield, Plus, Lock, Sparkles, X } from 'lucide-react';
import ProjectOverview from './ProjectOverview';
import PhasesView from './PhasesView';
import RAIDLog from './RAIDLog';
import StakeholdersView from './StakeholdersView';
import EvidenceView from './EvidenceView';
import ZTAMaturity from './ZTAMaturity';
import WeeklyStatus from './WeeklyStatus';
import RoadmapView from './RoadmapView';
import AssessmentGuide from './AssessmentGuide';
import FeatureGate from './FeatureGate';
import NewProjectModal from './NewProjectModal';
import ComplianceView from './ComplianceView';

type Project = {
  id: string;
  name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  status: string;
};

type TabConfig = {
  id: string;
  label: string;
  feature?: FeatureKey;
  featureName?: string;
};

const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'guide', label: '📋 Assessment Guide' },
  { id: 'zta', label: 'ZTA Maturity', feature: 'full_assessment', featureName: 'Full Assessment' },
  { id: 'phases', label: 'Phases & Tasks' },
  { id: 'compliance', label: 'Compliance', feature: 'compliance', featureName: 'Compliance Mapping' },
  { id: 'raid', label: 'RAID Log', feature: 'raid_log', featureName: 'RAID Log' },
  { id: 'stakeholders', label: 'Stakeholders', feature: 'stakeholders', featureName: 'Stakeholder Management' },
  { id: 'evidence', label: 'Evidence', feature: 'evidence_upload', featureName: 'Evidence Management' },
  { id: 'status', label: 'Weekly Status', feature: 'weekly_status', featureName: 'Weekly Status Reports' },
  { id: 'roadmap', label: 'Roadmap', feature: 'roadmap', featureName: 'Roadmap Planning' },
];

type DashboardProps = {
  isDemo?: boolean;
  onExitDemo?: () => void;
};

// Demo project for public users
const demoProject: Project = {
  id: 'demo-project',
  name: 'Demo Assessment',
  client_name: 'Sample Organization',
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'In Progress',
};

export default function Dashboard({ isDemo = false, onExitDemo }: DashboardProps) {
  const { user, signOut } = useAuth();
  const { canAccessFeature, requestFeatureAccess, isPublicMode } = useAccess();
  const [projects, setProjects] = useState<Project[]>(isDemo ? [demoProject] : []);
  const [selectedProject, setSelectedProject] = useState<Project | null>(isDemo ? demoProject : null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(!isDemo);
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    if (!isDemo) {
      loadProjects();
    }
  }, [isDemo]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (project: Project) => {
    setProjects([project, ...projects]);
    setSelectedProject(project);
    setShowNewProject(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  const handleTabClick = (tab: TabConfig) => {
    if (tab.feature && !canAccessFeature(tab.feature)) {
      requestFeatureAccess(tab.featureName || tab.label);
      return;
    }
    setActiveTab(tab.id);
  };

  const renderTabContent = () => {
    if (!selectedProject) return null;

    const currentTab = tabs.find(t => t.id === activeTab);
    
    // Check if current tab requires a feature that's not accessible
    if (currentTab?.feature && !canAccessFeature(currentTab.feature)) {
      return (
        <FeatureGate 
          feature={currentTab.feature} 
          featureName={currentTab.featureName || currentTab.label}
          showPreview={false}
        >
          <div />
        </FeatureGate>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <ProjectOverview project={selectedProject} />;
      case 'guide':
        return <AssessmentGuide projectId={selectedProject.id} />;
      case 'phases':
        return <PhasesView projectId={selectedProject.id} />;
      case 'raid':
        return <RAIDLog projectId={selectedProject.id} />;
      case 'stakeholders':
        return <StakeholdersView projectId={selectedProject.id} />;
      case 'evidence':
        return <EvidenceView projectId={selectedProject.id} />;
      case 'zta':
        return <ZTAMaturity projectId={selectedProject.id} projectName={selectedProject.name} clientName={selectedProject.client_name} />;
      case 'compliance':
        return <ComplianceView projectId={selectedProject.id} />;
      case 'status':
        return <WeeklyStatus projectId={selectedProject.id} />;
      case 'roadmap':
        return <RoadmapView projectId={selectedProject.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">You're viewing the demo version with limited features</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => requestFeatureAccess('Full Access')}
                className="px-4 py-1.5 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
              >
                Upgrade for Full Access
              </button>
              {onExitDemo && (
                <button
                  onClick={onExitDemo}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-slate-700" />
              <h1 className="text-2xl font-bold text-slate-900">ZTA Assessment Manager</h1>
              {isDemo && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  DEMO
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-slate-600">{user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onExitDemo}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <span>Sign In for Full Access</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-slate-700">Project:</label>
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const project = projects.find(p => p.id === e.target.value);
                setSelectedProject(project || null);
              }}
              disabled={isDemo}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white disabled:bg-slate-100"
            >
              {projects.length === 0 && <option value="">No projects</option>}
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.client_name}
                </option>
              ))}
            </select>
          </div>
          {!isDemo && (
            <button
              onClick={() => setShowNewProject(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          )}
          {isDemo && (
            <button
              onClick={() => requestFeatureAccess('Multiple Projects')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>New Project</span>
            </button>
          )}
        </div>

        {selectedProject ? (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
              <div className="border-b border-slate-200">
                <nav className="flex overflow-x-auto">
                  {tabs.map(tab => {
                    const isLocked = tab.feature && !canAccessFeature(tab.feature);
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab)}
                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
                          activeTab === tab.id
                            ? 'border-b-2 border-slate-700 text-slate-900'
                            : isLocked
                            ? 'text-slate-400'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                        {isLocked && <Lock className="w-3 h-3 ml-1.5 text-slate-400" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No Projects Yet</h2>
            <p className="text-slate-600 mb-6">Create your first ZTA assessment project to get started</p>
            <button
              onClick={() => setShowNewProject(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          </div>
        )}
      </div>

      {showNewProject && (
        <NewProjectModal
          onClose={() => setShowNewProject(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}
