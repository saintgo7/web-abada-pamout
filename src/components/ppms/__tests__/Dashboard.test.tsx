import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@test/utils';
import { PortfolioDashboard } from '../../../../components/ppms/PortfolioDashboard';
import { usePPMSStore } from '../../../../stores/ppmsStore';
import { initializeMockData } from '../../../../services/mockPPMSData';

describe('Portfolio Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    const mockData = initializeMockData();
    usePPMSStore.getState().setPrograms(mockData.programs);
    usePPMSStore.getState().setProjects(mockData.projects);
    usePPMSStore.getState().setTasks(mockData.tasks);
    usePPMSStore.getState().setResources(mockData.resources);
    usePPMSStore.getState().setBudgets(mockData.budgets);
  });

  describe('KPI Cards Display', () => {
    it('should display Total Programs KPI card', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Total Programs/i)).toBeInTheDocument();
        const programCount = usePPMSStore.getState().programs.length;
        expect(screen.getByText(programCount.toString())).toBeInTheDocument();
      });
    });

    it('should display Active Projects KPI card', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Active Projects/i)).toBeInTheDocument();
      });
    });

    it('should display Resource Utilization KPI card', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Resource Utilization/i)).toBeInTheDocument();
        // Should have a percentage display
        const utilization = screen.getByText(/\d+%/);
        expect(utilization).toBeInTheDocument();
      });
    });

    it('should display Budget Consumed KPI card', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Budget Consumed/i)).toBeInTheDocument();
        const budget = screen.getByText(/\d+%/);
        expect(budget).toBeInTheDocument();
      });
    });

    it('should calculate correct active projects count', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        const projects = usePPMSStore.getState().projects;
        const activeCount = projects.filter(
          (p) => p.status === 'in-progress' || p.status === 'not-started'
        ).length;

        // Find the active projects number
        const activeProjectsText = screen.getByText(activeCount.toString());
        expect(activeProjectsText).toBeInTheDocument();
      });
    });
  });

  describe('Charts Display', () => {
    it('should render Program Status pie chart', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Program Status/i)).toBeInTheDocument();
      });
    });

    it('should render Budget Trend line chart', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Budget Trend/i)).toBeInTheDocument();
      });
    });

    it('should display no data message when no programs exist', async () => {
      // Clear programs
      usePPMSStore.getState().setPrograms([]);

      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/No data available|데이터 없음/i)).toBeInTheDocument();
      });
    });
  });

  describe('Program Overview Section', () => {
    it('should display Programs Overview section', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Programs Overview/i)).toBeInTheDocument();
      });
    });

    it('should display up to 3 programs in overview', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        const programs = usePPMSStore.getState().programs;
        const displayCount = Math.min(programs.length, 3);

        // Should display program cards
        const programCards = screen.getAllByTestId(/program-/i);
        expect(programCards.length).toBeGreaterThan(0);
        expect(programCards.length).toBeLessThanOrEqual(displayCount);
      });
    });

    it('should show progress bars for each program', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        const programs = usePPMSStore.getState().programs;

        programs.slice(0, 3).forEach((program) => {
          // Check if progress percentage is displayed
          const progressText = screen.getByText(new RegExp(`${Math.round(program.progress)}%`, 'i'));
          expect(progressText).toBeInTheDocument();
        });
      });
    });
  });

  describe('Data Calculation Accuracy', () => {
    it('should calculate resource utilization correctly', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        const resources = usePPMSStore.getState().resources;
        const totalCapacity = resources.reduce((sum, r) => sum + r.capacity, 0);

        let totalAllocated = 0;
        resources.forEach((r) => {
          const allocations = usePPMSStore.getState().getAllocationsByResource(r.id);
          const allocated = allocations.reduce((sum, a) => sum + a.allocationPercent, 0);
          totalAllocated += allocated;
        });

        const expectedUtilization = totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 0;

        // Find utilization percentage in DOM
        const utilizationElement = screen.getByText(/\d+%/);
        const displayedUtilization = parseInt(utilizationElement.textContent || '0');

        // Allow for small rounding differences
        expect(Math.abs(displayedUtilization - Math.round(expectedUtilization))).toBeLessThanOrEqual(1);
      });
    });

    it('should calculate budget consumed correctly', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        const programs = usePPMSStore.getState().programs;
        const totalBudget = programs.reduce((sum, p) => sum + p.budget, 0);
        const totalSpent = programs.reduce((sum, p) => sum + p.spent, 0);
        const expectedConsumed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

        // Find budget percentage in DOM
        const budgetElement = screen.getByText(/\d+%/);
        const displayedConsumed = parseInt(budgetElement?.textContent || '0');

        // Allow for small rounding differences
        expect(Math.abs(displayedConsumed - Math.round(expectedConsumed))).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Bilingual Support', () => {
    it('should display dashboard in English when lang="en"', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Total Programs/i)).toBeInTheDocument();
        expect(screen.getByText(/Active Projects/i)).toBeInTheDocument();
        expect(screen.getByText(/Resource Utilization/i)).toBeInTheDocument();
        expect(screen.getByText(/Budget Consumed/i)).toBeInTheDocument();
      });
    });

    it('should display dashboard in Korean when lang="ko"', async () => {
      renderWithProviders(<PortfolioDashboard lang="ko" />);

      await waitFor(() => {
        expect(screen.getByText(/전체 프로그램/i)).toBeInTheDocument();
        expect(screen.getByText(/활성 프로젝트/i)).toBeInTheDocument();
        expect(screen.getByText(/리소스 활용률/i)).toBeInTheDocument();
        expect(screen.getByText(/예산 소비/i)).toBeInTheDocument();
      });
    });

    it('should display correct chart labels in English', async () => {
      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Program Status/i)).toBeInTheDocument();
        expect(screen.getByText(/Budget Trend/i)).toBeInTheDocument();
      });
    });

    it('should display correct chart labels in Korean', async () => {
      renderWithProviders(<PortfolioDashboard lang="ko" />);

      await waitFor(() => {
        expect(screen.getByText(/프로그램 상태/i)).toBeInTheDocument();
        expect(screen.getByText(/예산 추이/i)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render all KPI cards on large screen', async () => {
      // Mock large screen
      global.innerWidth = 1200;

      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Total Programs/i)).toBeInTheDocument();
        expect(screen.getByText(/Active Projects/i)).toBeInTheDocument();
        expect(screen.getByText(/Resource Utilization/i)).toBeInTheDocument();
        expect(screen.getByText(/Budget Consumed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no programs exist', async () => {
      usePPMSStore.getState().setPrograms([]);
      usePPMSStore.getState().setProjects([]);

      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        // Total programs should be 0
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    it('should show empty state when no resources exist', async () => {
      usePPMSStore.getState().setResources([]);

      renderWithProviders(<PortfolioDashboard lang="en" />);

      await waitFor(() => {
        // Resource utilization should be 0
        const utilization = screen.getAllByText('0%');
        expect(utilization.length).toBeGreaterThan(0);
      });
    });
  });
});
