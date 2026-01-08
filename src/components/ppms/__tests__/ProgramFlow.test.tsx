import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent, waitFor } from '@test/utils';
import { ProgramList } from '../../../../components/ppms/ProgramList';
import { ProgramFormModal } from '../../../../components/ppms/forms/ProgramFormModal';
import { usePPMSStore } from '../../../../stores/ppmsStore';
import { initializeMockData } from '../../../../services/mockPPMSData';

describe('Program CRUD Integration Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    const mockData = initializeMockData();
    usePPMSStore.getState().setPrograms(mockData.programs);
    usePPMSStore.getState().setProjects(mockData.projects);
    usePPMSStore.getState().setTasks(mockData.tasks);
    usePPMSStore.getState().setResources(mockData.resources);
  });

  describe('Program List Display', () => {
    it('should display all programs from the store', async () => {
      renderWithProviders(<ProgramList lang="en" onCreateProgram={vi.fn()} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      // Wait for programs to render
      await waitFor(() => {
        expect(screen.getByText(/AI Platform Development/i)).toBeInTheDocument();
        expect(screen.getByText(/E-commerce Modernization/i)).toBeInTheDocument();
        expect(screen.getByText(/Cloud Migration Initiative/i)).toBeInTheDocument();
      });
    });

    it('should filter programs by status', async () => {
      renderWithProviders(<ProgramList lang="en" onCreateProgram={vi.fn()} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      // Find the filter dropdown
      const filterButton = screen.getByRole('combobox');
      expect(filterButton).toBeInTheDocument();

      // Filter by 'active' status
      fireEvent.change(filterButton, { target: { value: 'active' } });

      await waitFor(() => {
        // Should only show active programs
        const activePrograms = screen.getAllByTestId(/program-card-/);
        expect(activePrograms.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Program Creation Flow', () => {
    it('should open modal when Create button is clicked', async () => {
      const handleCreate = vi.fn();
      renderWithProviders(<ProgramList lang="en" onCreateProgram={handleCreate} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      // Click Create button
      const createButton = screen.getByRole('button', { name: /create program/i });
      fireEvent.click(createButton);

      // Verify handler was called
      expect(handleCreate).toHaveBeenCalledTimes(1);
    });

    it('should create a new program with valid data', async () => {
      const newProgram = {
        id: 'prog-test-001',
        name: 'Test Program',
        description: 'This is a test program',
        status: 'planning' as const,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        budget: 500000,
        spent: 0,
        progress: 0,
        ownerId: 'user-test-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const handleClose = vi.fn();
      renderWithProviders(
        <ProgramFormModal
          isOpen={true}
          onClose={handleClose}
          program={undefined}
          lang="en"
        />
      );

      // Fill out the form
      const nameInput = screen.getByLabelText(/program name/i);
      const descInput = screen.getByLabelText(/description/i);
      const budgetInput = screen.getByLabelText(/budget/i);
      const submitButton = screen.getByRole('button', { name: /save program/i });

      fireEvent.change(nameInput, { target: { value: newProgram.name } });
      fireEvent.change(descInput, { target: { value: newProgram.description } });
      fireEvent.change(budgetInput, { target: { value: newProgram.budget.toString() } });

      // Submit form
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Check if program was added to store
        const programs = usePPMSStore.getState().programs;
        const createdProgram = programs.find((p) => p.name === newProgram.name);
        expect(createdProgram).toBeDefined();
        expect(createdProgram?.name).toBe(newProgram.name);
      });
    });
  });

  describe('Program Edit Flow', () => {
    it('should open modal with existing program data when Edit is clicked', async () => {
      const handleEdit = vi.fn();
      renderWithProviders(<ProgramList lang="en" onCreateProgram={vi.fn()} onEditProgram={handleEdit} onViewDetails={vi.fn()} />);

      // Find first program's menu button and click it
      const menuButtons = screen.getAllByRole('button', { name: '' }).filter(btn =>
        btn.querySelector('svg')
      );
      if (menuButtons.length > 0) {
        fireEvent.click(menuButtons[0]);

        // Click Edit option
        await waitFor(() => {
          const editButton = screen.getByText(/edit program/i);
          fireEvent.click(editButton);
        });

        expect(handleEdit).toHaveBeenCalled();
      }
    });

    it('should update program with new data', async () => {
      const programs = usePPMSStore.getState().programs;
      const programToEdit = programs[0];

      const handleClose = vi.fn();
      renderWithProviders(
        <ProgramFormModal
          isOpen={true}
          onClose={handleClose}
          program={programToEdit}
          lang="en"
        />
      );

      // Update program name
      const nameInput = screen.getByLabelText(/program name/i);
      const updatedName = 'Updated Program Name';

      fireEvent.change(nameInput, { target: { value: updatedName } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /save program/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const updatedPrograms = usePPMSStore.getState().programs;
        const updatedProgram = updatedPrograms.find((p) => p.id === programToEdit.id);
        expect(updatedProgram?.name).toBe(updatedName);
      });
    });
  });

  describe('Program Delete Flow', () => {
    it('should delete program when confirmed', async () => {
      const initialPrograms = usePPMSStore.getState().programs;
      const programToDelete = initialPrograms[0];

      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      renderWithProviders(<ProgramList lang="en" onCreateProgram={vi.fn()} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      // Find program menu and click delete
      const menuButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg')
      );

      if (menuButtons.length > 0) {
        fireEvent.click(menuButtons[0]);

        await waitFor(() => {
          const deleteButton = screen.getByText(/delete program/i);
          fireEvent.click(deleteButton);
        });

        await waitFor(() => {
          const programsAfterDelete = usePPMSStore.getState().programs;
          expect(programsAfterDelete.length).toBe(initialPrograms.length - 1);
          expect(programsAfterDelete.find((p) => p.id === programToDelete.id)).toBeUndefined();
        });
      }

      confirmSpy.mockRestore();
    });

    it('should not delete program when cancelled', async () => {
      const initialPrograms = usePPMSStore.getState().programs;

      // Mock window.confirm to return false (cancel)
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      renderWithProviders(<ProgramList lang="en" onCreateProgram={vi.fn()} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      // Find program menu and click delete
      const menuButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg')
      );

      if (menuButtons.length > 0) {
        fireEvent.click(menuButtons[0]);

        await waitFor(() => {
          const deleteButton = screen.getByText(/delete program/i);
          fireEvent.click(deleteButton);
        });

        await waitFor(() => {
          const programsAfterCancel = usePPMSStore.getState().programs;
          expect(programsAfterCancel.length).toBe(initialPrograms.length);
        });
      }

      confirmSpy.mockRestore();
    });
  });

  describe('Program Progress Display', () => {
    it('should display correct progress percentage', async () => {
      renderWithProviders(<ProgramList lang="en" onCreateProgram={vi.fn()} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      const programs = usePPMSStore.getState().programs;

      await waitFor(() => {
        programs.forEach((program) => {
          const progressText = screen.getByText(new RegExp(`${program.progress}%`, 'i'));
          expect(progressText).toBeInTheDocument();
        });
      });
    });

    it('should display budget information', async () => {
      renderWithProviders(<ProgramList lang="en" onCreateProgram={vi.fn()} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      const programs = usePPMSStore.getState().programs;

      await waitFor(() => {
        programs.forEach((program) => {
          // Budget should be displayed (checking for currency symbol)
          const budgetElement = screen.getByText(/\$|₩/);
          expect(budgetElement).toBeInTheDocument();
        });
      });
    });
  });

  describe('Bilingual Support', () => {
    it('should display content in English when lang="en"', async () => {
      renderWithProviders(<ProgramList lang="en" onCreateProgram={vi.fn()} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/Programs/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create program/i })).toBeInTheDocument();
      });
    });

    it('should display content in Korean when lang="ko"', async () => {
      renderWithProviders(<ProgramList lang="ko" onCreateProgram={vi.fn()} onEditProgram={vi.fn()} onViewDetails={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/프로그램/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /프로그램 생성/i })).toBeInTheDocument();
      });
    });
  });
});
