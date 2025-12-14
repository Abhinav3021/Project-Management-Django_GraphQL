import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ORG_PROJECTS } from '../graphql/queries';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import type { Project } from '../types';


interface DashboardData {
  organizationProjects: Project[];
}

const Dashboard: React.FC = () => {
  const ORG_SLUG = "techcorp"; // HARDCODED for this demo
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { loading, error, data } = useQuery<DashboardData>(GET_ORG_PROJECTS, {
    variables: { orgSlug: ORG_SLUG }
  });

  if (loading) return <div className="p-8 text-center text-gray-500">Loading projects...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.organizationProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {data?.organizationProjects.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
            No projects found. Create one to get started!
          </div>
        )}
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        orgSlug={ORG_SLUG}
      />
    </div>
  );
};

export default Dashboard;