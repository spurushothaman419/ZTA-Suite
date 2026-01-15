import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, FileText } from 'lucide-react';

type Evidence = {
  id: string;
  document_name: string;
  document_type: string;
  owner: string;
  relevance: string;
  received_date: string;
  file_url: string;
  notes: string;
};

type Props = {
  projectId: string;
};

export default function EvidenceView({ projectId }: Props) {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvidence();
  }, [projectId]);

  const loadEvidence = async () => {
    try {
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .eq('project_id', projectId)
        .order('received_date', { ascending: false });

      if (error) throw error;
      setEvidence(data || []);
    } catch (error) {
      console.error('Error loading evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvidence = async (id: string) => {
    try {
      await supabase.from('evidence').delete().eq('id', id);
      setEvidence(evidence.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting evidence:', error);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading evidence...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Evidence Index</h3>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Evidence</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Document Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Received</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Relevance</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {evidence.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                  No evidence documents added yet
                </td>
              </tr>
            ) : (
              evidence.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">{item.document_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.document_type}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.owner || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.received_date ? new Date(item.received_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.relevance || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteEvidence(item.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showNewModal && (
        <NewEvidenceModal
          projectId={projectId}
          onClose={() => setShowNewModal(false)}
          onEvidenceCreated={(item) => {
            setEvidence([item, ...evidence]);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}

function NewEvidenceModal({ projectId, onClose, onEvidenceCreated }: {
  projectId: string;
  onClose: () => void;
  onEvidenceCreated: (evidence: Evidence) => void;
}) {
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('policy');
  const [owner, setOwner] = useState('');
  const [relevance, setRelevance] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('evidence')
        .insert({
          project_id: projectId,
          document_name: documentName,
          document_type: documentType,
          owner,
          relevance,
          received_date: receivedDate || null,
          file_url: fileUrl,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      onEvidenceCreated(data);
    } catch (error) {
      console.error('Error creating evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Add Evidence Document</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Name</label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="policy">Policy</option>
                <option value="diagram">Diagram</option>
                <option value="audit">Audit Report</option>
                <option value="config">Configuration</option>
                <option value="plan">Plan</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Received Date</label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Relevance</label>
            <input
              type="text"
              value={relevance}
              onChange={(e) => setRelevance(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="e.g., Phase 1 - Identity Architecture"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">File URL</label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
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
              {loading ? 'Adding...' : 'Add Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
