import React from 'react';
import type { Project } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const navigate = useNavigate();

  // Helper to color-code status
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    ON_HOLD: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div 
      onClick={() => navigate(`/project/${project.id}`)}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]}`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
        {project.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
        <div>
          <span className="font-medium">{project.completedTaskCount}/{project.taskCount}</span> Tasks
        </div>
        <div>
          {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No Deadline'}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;