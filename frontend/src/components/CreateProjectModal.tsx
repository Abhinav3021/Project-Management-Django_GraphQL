import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_PROJECT, GET_ORG_PROJECTS } from '../graphql/queries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orgSlug: string;
}

const CreateProjectModal: React.FC<Props> = ({ isOpen, onClose, orgSlug }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    // Refresh the list after creating
    refetchQueries: [{ query: GET_ORG_PROJECTS, variables: { orgSlug } }],
    onCompleted: () => {
      onClose();
      setName('');
      setDescription('');
      setDueDate('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject({
      variables: {
        name,
        description,
        organizationSlug: orgSlug,
        dueDate: dueDate || null // Send null if empty
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm border-black shadow-2xl bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        
        {error && <p className="text-red-500 text-sm mb-2">{error.message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2  text-gray-950"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-gray-950"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input 
              type="date" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-gray-950"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;