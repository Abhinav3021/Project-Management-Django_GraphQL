import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_TASK, GET_PROJECT_DETAILS } from '../graphql/queries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const CreateTaskModal: React.FC<Props> = ({ isOpen, onClose, projectId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    // Refetch project details to show the new task immediately
    refetchQueries: [{ query: GET_PROJECT_DETAILS, variables: { id: projectId } }],
    onCompleted: () => {
      onClose();
      setTitle('');
      setDescription('');
      setAssignee('');
      setDueDate('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask({
      variables: {
        projectId,
        title,
        description,
        assigneeEmail: assignee,
        dueDate: dueDate || null
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" required
              className="mt-1 block w-full border rounded-md p-2"
              value={title} onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assignee Email</label>
            <input 
              type="email"
              className="mt-1 block w-full border rounded-md p-2"
              value={assignee} onChange={e => setAssignee(e.target.value)}
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
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;