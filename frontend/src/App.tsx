import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { GET_ALL_ORGS } from './graphql/queries';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import { OrgProvider, useOrg } from './context/OrgContext';
import CreateOrgModal from './components/CreateOrgModal';

/* ---------------- NAVBAR ---------------- */
const NavigationBar = () => {
  const { currentOrgSlug, setCurrentOrgSlug } = useOrg();
  const { data, loading } = useQuery(GET_ALL_ORGS);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Logo Section (UNCHANGED) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:bg-blue-700 transition-colors">
              PM
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              ProManage
            </span>
          </Link>

          {/* Org Switcher + Avatar */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Organization
              </p>

              <div className="flex items-center gap-2 justify-end">
                {loading ? (
                  <p className="text-sm text-slate-400">Loading...</p>
                ) : (
                  <select
                    value={currentOrgSlug}
                    onChange={(e) => setCurrentOrgSlug(e.target.value)}
                    //className="text-sm font-medium text-slate-900 bg-transparent border-none focus:ring-0 cursor-pointer appearance-none text-right"
                    className="
                              text-xs font-semibold uppercase tracking-wide text-slate-600 bg-white border border-slate-300 rounded-md px-1 py-1
                              shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    style={{ textAlignLast: 'right' }}
                  >
                    {data?.allOrganizations.map((org: any) => (
                      <option key={org.id} value={org.slug}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* ➕ Create Org Button (ADDED) */}
                <button
                  onClick={() => setIsOrgModalOpen(true)}
                  className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors"
                  title="Create New Organization"
                >
                  +
                </button>
              </div>
            </div>

            {/* Avatar (UNCHANGED) */}
            <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 font-medium">
              JD
            </div>
          </div>
        </div>
      </nav>

      {/* Create Organization Modal */}
      <CreateOrgModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
      />
    </>
  );
};

/* ---------------- MAIN APP ---------------- */
function App() {
  const location = useLocation();

  return (
    <OrgProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <NavigationBar />

        <main className="flex-1 container mx-auto py-8 px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </main>
      </div>
    </OrgProvider>
  );
}

export default App;
