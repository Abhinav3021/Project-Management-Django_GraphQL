import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_PROJECT } from '../graphql/queries';
import type { Project } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const EditProjectModal: React.FC<Props> = ({ isOpen, onClose, project }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [dueDate, setDueDate] = useState(project.dueDate || '');

  // Reset form when project changes
  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
    setDueDate(project.dueDate || '');
  }, [project]);

  const [updateProject, { loading }] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => onClose()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject({
      variables: {
        id: project.id,
        name,
        description,
        dueDate: dueDate || null
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" required
              className="mt-1 block w-full border rounded-md p-2"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              className="mt-1 block w-full border rounded-md p-2" rows={3}
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input 
              type="date"
              className="mt-1 block w-full border rounded-md p-2"
              value={dueDate} onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;