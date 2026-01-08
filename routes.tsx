import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Navbar from './components/Navbar';
import { PortfolioDashboard } from './components/ppms/PortfolioDashboard';
import { ProgramList } from './components/ppms/ProgramList';
import { ProgramFormModal } from './components/ppms/forms/ProgramFormModal';
import { ResourceAllocation } from './components/ppms/ResourceAllocation';
import { ScheduleView } from './components/ppms/ScheduleView';
import type { Program } from './types';
import { usePPMSStore } from './stores/ppmsStore';
import { initializeMockData } from './services/mockPPMSData';

// Placeholder components for routes not yet implemented (none - all implemented!)

// Layout component for PPMS pages
const PPMSLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'ko'>('ko');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'
      }`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        lang={lang}
        toggleLang={() => setLang((l) => (l === 'en' ? 'ko' : 'en'))}
      />
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

// Portfolio Dashboard Page
const PortfolioDashboardPage: React.FC = () => {
  const [lang] = useState<'en' | 'ko'>('ko');
  return (
    <PPMSLayout>
      <PortfolioDashboard lang={lang} />
    </PPMSLayout>
  );
};

// Programs Page
const ProgramsPage: React.FC = () => {
  const [lang] = useState<'en' | 'ko'>('ko');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | undefined>();

  const handleCreateProgram = () => {
    setEditingProgram(undefined);
    setIsModalOpen(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleViewDetails = (programId: string) => {
    console.log('View program details:', projectId);
    // TODO: Navigate to program detail page
  };

  return (
    <PPMSLayout>
      <ProgramList
        lang={lang}
        onCreateProgram={handleCreateProgram}
        onEditProgram={handleEditProgram}
        onViewDetails={handleViewDetails}
      />
      <ProgramFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        program={editingProgram}
        lang={lang}
      />
    </PPMSLayout>
  );
};

// Resources Page
const ResourcesPage: React.FC = () => {
  const [lang] = useState<'en' | 'ko'>('ko');
  return (
    <PPMSLayout>
      <ResourceAllocation lang={lang} />
    </PPMSLayout>
  );
};

// Schedule Page
const SchedulePage: React.FC = () => {
  const [lang] = useState<'en' | 'ko'>('ko');
  return (
    <PPMSLayout>
      <ScheduleView lang={lang} />
    </PPMSLayout>
  );
};

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/ppms',
    element: <PortfolioDashboardPage />,
  },
  {
    path: '/ppms/programs',
    element: <ProgramsPage />,
  },
  {
    path: '/ppms/resources',
    element: <ResourcesPage />,
  },
  {
    path: '/ppms/schedule',
    element: <SchedulePage />,
  },
]);

// Router component
const AppRouter: React.FC = () => {
  const initializeStore = usePPMSStore((state) => state.setPrograms);

  // Initialize PPMS store with mock data
  useEffect(() => {
    const mockData = initializeMockData();
    initializeStore(mockData.programs);
    usePPMSStore.getState().setProjects(mockData.projects);
    usePPMSStore.getState().setTasks(mockData.tasks);
    usePPMSStore.getState().setResources(mockData.resources);
    usePPMSStore.getState().setAllocations(mockData.allocations);
    usePPMSStore.getState().setBudgets(mockData.budgets);
    usePPMSStore.getState().setRisks(mockData.risks);
    usePPMSStore.getState().setMilestones(mockData.milestones);
  }, []);

  return <RouterProvider router={router} />;
};

export default AppRouter;
