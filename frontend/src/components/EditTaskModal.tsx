import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_TASK } from '../graphql/queries';
import type { Task } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const EditTaskModal: React.FC<Props> = ({ isOpen, onClose, task }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(task.assigneeEmail);
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setAssignee(task.assigneeEmail);
    setDueDate(task.dueDate || '');
  }, [task]);

  const [updateTask, { loading }] = useMutation(UPDATE_TASK, {
    onCompleted: () => onClose()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask({
      variables: {
        id: task.id,
        title,
        description,
        assigneeEmail: assignee,
        dueDate: dueDate || null
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
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
            <label className="block text-sm font-medium text-gray-700">Assignee</label>
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
           {/* Description Field (Optional, reuse styling from above) */}
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;