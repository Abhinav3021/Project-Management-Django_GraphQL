import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_PROJECT_DETAILS } from '../graphql/queries';
import TaskItem from '../components/TaskItem';
import CreateTaskModal from '../components/CreateTaskModal';
import type { Task } from '../types';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_PROJECT_DETAILS, {
    variables: { id }
  });

  if (loading) return <div className="p-8 text-center text-gray-500">Loading project details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

  const project = data.project;

  // Filter tasks into columns
  const tasksByStatus = {
    TODO: project.tasks.filter((t: Task) => t.status === 'TODO'),
    IN_PROGRESS: project.tasks.filter((t: Task) => t.status === 'IN_PROGRESS'),
    DONE: project.tasks.filter((t: Task) => t.status === 'DONE'),
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <button 
            onClick={() => navigate('/')} 
            className="text-gray-500 hover:text-gray-700 text-sm mb-2 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
        </div>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-8">
        
        {/* Column: To Do */}
        <div className="bg-gray-100 rounded-xl p-4 min-h-[500px]">
          <h3 className="font-bold text-gray-700 mb-4 flex justify-between items-center">
            To Do 
            <span className="bg-white px-2 py-0.5 rounded-full text-xs border shadow-sm text-gray-600">
              {tasksByStatus.TODO.length}
            </span>
          </h3>
          {tasksByStatus.TODO.map((task: Task) => <TaskItem key={task.id} task={task} />)}
        </div>

        {/* Column: In Progress */}
        <div className="bg-blue-50 rounded-xl p-4 min-h-[500px]">
          <h3 className="font-bold text-blue-800 mb-4 flex justify-between items-center">
            In Progress 
            <span className="bg-white px-2 py-0.5 rounded-full text-xs border shadow-sm text-blue-600">
              {tasksByStatus.IN_PROGRESS.length}
            </span>
          </h3>
          {tasksByStatus.IN_PROGRESS.map((task: Task) => <TaskItem key={task.id} task={task} />)}
        </div>

        {/* Column: Done */}
        <div className="bg-green-50 rounded-xl p-4 min-h-[500px]">
          <h3 className="font-bold text-green-800 mb-4 flex justify-between items-center">
            Done 
            <span className="bg-white px-2 py-0.5 rounded-full text-xs border shadow-sm text-green-600">
              {tasksByStatus.DONE.length}
            </span>
          </h3>
          {tasksByStatus.DONE.map((task: Task) => <TaskItem key={task.id} task={task} />)}
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={id!}
      />
    </div>
  );
};

export default ProjectDetail;