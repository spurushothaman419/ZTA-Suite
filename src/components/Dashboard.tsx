import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, Shield, Plus } from 'lucide-react';
import ProjectOverview from './ProjectOverview';
import PhasesView from './PhasesView';
import RAIDLog from './RAIDLog';
import StakeholdersView from './StakeholdersView';
import EvidenceView from './EvidenceView';
import ZTAMaturity from './ZTAMaturity';
import WeeklyStatus from './WeeklyStatus';
import RoadmapView from './RoadmapView';
import AssessmentGuide from './AssessmentGuide';
import NewProjectModal from './NewProjectModal';

type Project = {
  id: string;
  name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  status: string;
};

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'guide', label: '📋 Assessment Guide' },
  { id: 'zta', label: 'ZTA Maturity' },
  { id: 'phases', label: 'Phases & Tasks' },
  { id: 'raid', label: 'RAID Log' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'status', label: 'Weekly Status' },
  { id: 'roadmap', label: 'Roadmap' },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-slate-700" />
              <h1 className="text-2xl font-bold text-slate-900">ZTA Assessment Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
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
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
            >
              {projects.length === 0 && <option value="">No projects</option>}
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.client_name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        {selectedProject ? (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
              <div className="border-b border-slate-200">
                <nav className="flex overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'border-b-2 border-slate-700 text-slate-900'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && <ProjectOverview project={selectedProject} />}
                {activeTab === 'guide' && <AssessmentGuide projectId={selectedProject.id} />}
                {activeTab === 'phases' && <PhasesView projectId={selectedProject.id} />}
                {activeTab === 'raid' && <RAIDLog projectId={selectedProject.id} />}
                {activeTab === 'stakeholders' && <StakeholdersView projectId={selectedProject.id} />}
                {activeTab === 'evidence' && <EvidenceView projectId={selectedProject.id} />}
                {activeTab === 'zta' && <ZTAMaturity projectId={selectedProject.id} />}
                {activeTab === 'status' && <WeeklyStatus projectId={selectedProject.id} />}
                {activeTab === 'roadmap' && <RoadmapView projectId={selectedProject.id} />}
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
