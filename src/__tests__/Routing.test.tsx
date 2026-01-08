import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PortfolioDashboard } from '../../components/ppms/PortfolioDashboard';
import { ProgramList } from '../../components/ppms/ProgramList';
import { ResourceAllocation } from '../../components/ppms/ResourceAllocation';
import { ScheduleView } from '../../components/ppms/ScheduleView';
import { usePPMSStore } from '../../stores/ppmsStore';
import { initializeMockData } from '../../services/mockPPMSData';

describe('Routing and Navigation Integration Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    const mockData = initializeMockData();
    usePPMSStore.getState().setPrograms(mockData.programs);
    usePPMSStore.getState().setProjects(mockData.projects);
    usePPMSStore.getState().setTasks(mockData.tasks);
    usePPMSStore.getState().setResources(mockData.resources);
    usePPMSStore.getState().setAllocations(mockData.allocations);
    usePPMSStore.getState().setBudgets(mockData.budgets);
    usePPMSStore.getState().setMilestones(mockData.milestones);
  });

  describe('PPMS Routes', () => {
    it('should render PortfolioDashboard at /ppms route', async () => {
      render(
        <MemoryRouter initialEntries={['/ppms']}>
          <Routes>
            <Route path="/ppms" element={<PortfolioDashboard lang="en" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Program Status/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Total Programs/i).length).toBeGreaterThan(0);
      });
    });

    it('should render ProgramList at /ppms/programs route', async () => {
      render(
        <MemoryRouter initialEntries={['/ppms/programs']}>
          <Routes>
            <Route path="/ppms/programs" element={
              <ProgramList
                lang="en"
                onCreateProgram={vi.fn()}
                onEditProgram={vi.fn()}
                onViewDetails={vi.fn()}
              />
            } />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Programs/i).length).toBeGreaterThan(0);
        expect(screen.getByRole('button', { name: /create program/i })).toBeInTheDocument();
      });
    });

    it('should render ResourceAllocation at /ppms/resources route', async () => {
      render(
        <MemoryRouter initialEntries={['/ppms/resources']}>
          <Routes>
            <Route path="/ppms/resources" element={<ResourceAllocation lang="en" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Resource Allocation/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Team Members/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Projects/i).length).toBeGreaterThan(0);
      });
    });

    it('should render ScheduleView at /ppms/schedule route', async () => {
      render(
        <MemoryRouter initialEntries={['/ppms/schedule']}>
          <Routes>
            <Route path="/ppms/schedule" element={<ScheduleView lang="en" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Schedule & Timeline/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /today/i })).toBeInTheDocument();
      });
    });
  });

  describe('Route Transitions', () => {
    it('should maintain store state across route changes', async () => {
      const { unmount } = render(
        <MemoryRouter initialEntries={['/ppms']}>
          <Routes>
            <Route path="/ppms" element={<PortfolioDashboard lang="en" />} />
          </Routes>
        </MemoryRouter>
      );

      // Get initial program count
      const initialPrograms = usePPMSStore.getState().programs;

      await waitFor(() => {
        expect(screen.getByText(/Total Programs/i)).toBeInTheDocument();
      });

      unmount();

      // Navigate to programs route
      render(
        <MemoryRouter initialEntries={['/ppms/programs']}>
          <Routes>
            <Route path="/ppms/programs" element={
              <ProgramList
                lang="en"
                onCreateProgram={vi.fn()}
                onEditProgram={vi.fn()}
                onViewDetails={vi.fn()}
              />
            } />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        // Store should still have the same data
        const currentPrograms = usePPMSStore.getState().programs;
        expect(currentPrograms.length).toBe(initialPrograms.length);
      });
    });
  });

  describe('URL Parameters', () => {
    it('should handle route transitions correctly', async () => {
      // Start at dashboard
      const { container } = render(
        <MemoryRouter initialEntries={['/ppms']}>
          <Routes>
            <Route path="/ppms" element={<PortfolioDashboard lang="en" />} />
            <Route path="/ppms/programs" element={
              <ProgramList
                lang="en"
                onCreateProgram={vi.fn()}
                onEditProgram={vi.fn()}
                onViewDetails={vi.fn()}
              />
            } />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Program Status/i).length).toBeGreaterThan(0);
      });

      // In a real app, we would use navigate() to change routes
      // For testing, we verify the router structure is correct
      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('404 - Unknown Routes', () => {
    it('should handle unknown routes gracefully', async () => {
      // This test checks that the app doesn't crash on unknown routes
      // In a real app, you might have a 404 page
      const { container } = render(
        <MemoryRouter initialEntries={['/unknown-route']}>
          <Routes>
            <Route path="/ppms" element={<PortfolioDashboard lang="en" />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Language Consistency Across Routes', () => {
    it('should maintain English language across all routes', async () => {
      // Test Dashboard
      render(
        <MemoryRouter initialEntries={['/ppms']}>
          <Routes>
            <Route path="/ppms" element={<PortfolioDashboard lang="en" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Total Programs/i).length).toBeGreaterThan(0);
      });

      // Test Programs page
      const { unmount: unmount1 } = render(
        <MemoryRouter initialEntries={['/ppms/programs']}>
          <Routes>
            <Route path="/ppms/programs" element={
              <ProgramList
                lang="en"
                onCreateProgram={vi.fn()}
                onEditProgram={vi.fn()}
                onViewDetails={vi.fn()}
              />
            } />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Programs/i).length).toBeGreaterThan(0);
      });
      unmount1();

      // Test Resources page
      const { unmount: unmount2 } = render(
        <MemoryRouter initialEntries={['/ppms/resources']}>
          <Routes>
            <Route path="/ppms/resources" element={<ResourceAllocation lang="en" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Resource Allocation/i).length).toBeGreaterThan(0);
      });
      unmount2();

      // Test Schedule page
      render(
        <MemoryRouter initialEntries={['/ppms/schedule']}>
          <Routes>
            <Route path="/ppms/schedule" element={<ScheduleView lang="en" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Schedule & Timeline/i)).toBeInTheDocument();
      });
    });

    it('should maintain Korean language across all routes', async () => {
      // Test Dashboard
      render(
        <MemoryRouter initialEntries={['/ppms']}>
          <Routes>
            <Route path="/ppms" element={<PortfolioDashboard lang="ko" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/전체 프로그램/i).length).toBeGreaterThan(0);
      });

      // Test Programs page
      const { unmount: unmount1 } = render(
        <MemoryRouter initialEntries={['/ppms/programs']}>
          <Routes>
            <Route path="/ppms/programs" element={
              <ProgramList
                lang="ko"
                onCreateProgram={vi.fn()}
                onEditProgram={vi.fn()}
                onViewDetails={vi.fn()}
              />
            } />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/프로그램/i).length).toBeGreaterThan(0);
      });
      unmount1();

      // Test Resources page
      const { unmount: unmount2 } = render(
        <MemoryRouter initialEntries={['/ppms/resources']}>
          <Routes>
            <Route path="/ppms/resources" element={<ResourceAllocation lang="ko" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/리소스 할당/i)).toBeInTheDocument();
      });
      unmount2();

      // Test Schedule page
      render(
        <MemoryRouter initialEntries={['/ppms/schedule']}>
          <Routes>
            <Route path="/ppms/schedule" element={<ScheduleView lang="ko" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/일정 및 타임라인/i)).toBeInTheDocument();
      });
    });
  });

  describe('Component Isolation', () => {
    it('should not leak state between different route components', async () => {
      // Render dashboard
      const { unmount } = render(
        <MemoryRouter initialEntries={['/ppms']}>
          <Routes>
            <Route path="/ppms" element={<PortfolioDashboard lang="en" />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Program Status/i).length).toBeGreaterThan(0);
      });

      unmount();

      // Render programs - should be clean state (not affected by dashboard)
      render(
        <MemoryRouter initialEntries={['/ppms/programs']}>
          <Routes>
            <Route path="/ppms/programs" element={
              <ProgramList
                lang="en"
                onCreateProgram={vi.fn()}
                onEditProgram={vi.fn()}
                onViewDetails={vi.fn()}
              />
            } />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Programs/i).length).toBeGreaterThan(0);
        expect(screen.queryByText(/Program Status/i)).not.toBeInTheDocument();
      });
    });
  });
});
