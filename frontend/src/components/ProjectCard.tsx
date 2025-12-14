import React from 'react';
import type { Project } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const navigate = useNavigate();

  const statusStyles = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    ON_HOLD: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  // Calculate progress percentage
  const total = project.taskCount || 0;
  const completed = project.completedTaskCount || 0;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div 
      onClick={() => navigate(`/project/${project.id}`)}
      className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
          {project.name}
        </h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[project.status]}`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">
        {project.description || "No description provided."}
      </p>

      {/* Progress Bar Section */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-5 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-600">{completed}/{total}</span> Tasks
        </div>
        <div className="flex items-center gap-1">
          Due {project.dueDate ? new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;