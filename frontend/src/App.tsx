import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail'; // <--- Import the new page

function App() {
  return (
    <div className="min-h-screen flex flex-col">
       {/* ... (Keep your existing Navigation bar) ... */}
       <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="font-bold text-xl text-gray-800">PM System</span>
        </div>
        <div className="text-sm text-gray-500">Organization: TechCorp</div>
      </nav>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} /> {/* <--- Update this route */}
        </Routes>
      </main>
    </div>
  )
}

export default App