import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, User } from 'lucide-react';

type Stakeholder = {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone: string;
  notes: string;
};

type Props = {
  projectId: string;
};

export default function StakeholdersView({ projectId }: Props) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStakeholders();
  }, [projectId]);

  const loadStakeholders = async () => {
    try {
      const { data, error } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at');

      if (error) throw error;
      setStakeholders(data || []);
    } catch (error) {
      console.error('Error loading stakeholders:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStakeholder = async (id: string) => {
    try {
      await supabase.from('stakeholders').delete().eq('id', id);
      setStakeholders(stakeholders.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading stakeholders...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Project Stakeholders</h3>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stakeholder</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stakeholders.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500">
            No stakeholders added yet
          </div>
        ) : (
          stakeholders.map(stakeholder => (
            <div key={stakeholder.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{stakeholder.name}</h4>
                    <p className="text-sm text-slate-600">{stakeholder.role}</p>
                    {stakeholder.organization && (
                      <p className="text-sm text-slate-500">{stakeholder.organization}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteStakeholder(stakeholder.id)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 text-sm">
                {stakeholder.email && (
                  <p className="text-slate-600">
                    <span className="font-medium">Email:</span> {stakeholder.email}
                  </p>
                )}
                {stakeholder.phone && (
                  <p className="text-slate-600">
                    <span className="font-medium">Phone:</span> {stakeholder.phone}
                  </p>
                )}
                {stakeholder.notes && (
                  <p className="text-slate-600 mt-2">
                    <span className="font-medium">Notes:</span> {stakeholder.notes}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showNewModal && (
        <NewStakeholderModal
          projectId={projectId}
          onClose={() => setShowNewModal(false)}
          onStakeholderCreated={(stakeholder) => {
            setStakeholders([...stakeholders, stakeholder]);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}

function NewStakeholderModal({ projectId, onClose, onStakeholderCreated }: {
  projectId: string;
  onClose: () => void;
  onStakeholderCreated: (stakeholder: Stakeholder) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('stakeholders')
        .insert({
          project_id: projectId,
          name,
          role,
          organization,
          email,
          phone,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      onStakeholderCreated(data);
    } catch (error) {
      console.error('Error creating stakeholder:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Add Stakeholder</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Stakeholder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
