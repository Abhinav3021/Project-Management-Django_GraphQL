import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_ORGANIZATION, GET_ALL_ORGS } from '../graphql/queries';
import { useOrg } from '../context/OrgContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOrgModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { setCurrentOrgSlug } = useOrg();

  const [createOrg, { loading, error }] = useMutation(CREATE_ORGANIZATION, {
    // Refresh the dropdown list immediately
    refetchQueries: [{ query: GET_ALL_ORGS }],
    onCompleted: (data) => {
      // Automatically switch to the new organization
      const newSlug = data.createOrganization.organization.slug;
      setCurrentOrgSlug(newSlug);
      onClose();
      setName('');
      setEmail('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrg({ variables: { name, email } });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm border-black shadow-2xl flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Create Workspace</h2>
        
        {error && <p className="text-red-500 text-sm mb-3">{error.message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Organization Name</label>
            <input 
              type="text" required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Design Team"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Contact Email (Optional)</label>
            <input 
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@company.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrgModal;