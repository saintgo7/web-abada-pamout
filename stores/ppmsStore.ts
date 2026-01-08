import { create } from 'zustand';
import type {
  Program,
  Project,
  Task,
  Resource,
  ResourceAllocation,
  Budget,
  Risk,
  Milestone,
  ProgramFilter,
  ProjectFilter,
  ResourceFilter,
} from '../types';

// ============================================
// PPMS Store - State Management
// ============================================

interface PPMSStore {
  // State
  programs: Program[];
  projects: Project[];
  tasks: Task[];
  resources: Resource[];
  allocations: ResourceAllocation[];
  budgets: Budget[];
  risks: Risk[];
  milestones: Milestone[];

  // Selection State
  selectedProgramId: string | null;
  selectedProjectId: string | null;
  selectedResourceId: string | null;

  // Loading & Error States
  loading: boolean;
  error: string | null;

  // Program Actions
  setPrograms: (programs: Program[]) => void;
  addProgram: (program: Program) => void;
  updateProgram: (id: string, updates: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  getProgramById: (id: string) => Program | undefined;
  filterPrograms: (filter: ProgramFilter) => Program[];

  // Project Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectsByProgram: (programId: string) => Project[];
  getProjectById: (id: string) => Project | undefined;
  filterProjects: (filter: ProjectFilter) => Project[];

  // Task Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTaskById: (id: string) => Task | undefined;

  // Resource Actions
  setResources: (resources: Resource[]) => void;
  addResource: (resource: Resource) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  getResourceById: (id: string) => Resource | undefined;
  filterResources: (filter: ResourceFilter) => Resource[];
  getResourceAvailability: (resourceId: string) => number; // Returns available capacity %

  // Allocation Actions
  setAllocations: (allocations: ResourceAllocation[]) => void;
  addAllocation: (allocation: ResourceAllocation) => void;
  updateAllocation: (id: string, updates: Partial<ResourceAllocation>) => void;
  deleteAllocation: (id: string) => void;
  getAllocationsByResource: (resourceId: string) => ResourceAllocation[];
  getAllocationsByProject: (projectId: string) => ResourceAllocation[];

  // Budget Actions
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetsByProject: (projectId: string) => Budget[];

  // Risk Actions
  setRisks: (risks: Risk[]) => void;
  addRisk: (risk: Risk) => void;
  updateRisk: (id: string, updates: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;
  getRisksByProject: (projectId: string) => Risk[];

  // Milestone Actions
  setMilestones: (milestones: Milestone[]) => void;
  addMilestone: (milestone: Milestone) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  getMilestonesByProject: (projectId: string) => Milestone[];

  // Selection Actions
  setSelectedProgram: (id: string | null) => void;
  setSelectedProject: (id: string | null) => void;
  setSelectedResource: (id: string | null) => void;
  clearSelections: () => void;

  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePPMSStore = create<PPMSStore>((set, get) => ({
  // Initial State
  programs: [],
  projects: [],
  tasks: [],
  resources: [],
  allocations: [],
  budgets: [],
  risks: [],
  milestones: [],

  selectedProgramId: null,
  selectedProjectId: null,
  selectedResourceId: null,

  loading: false,
  error: null,

  // ============================================
  // Program Actions
  // ============================================

  setPrograms: (programs) => set({ programs }),

  addProgram: (program) =>
    set((state) => ({
      programs: [...state.programs, program],
    })),

  updateProgram: (id, updates) =>
    set((state) => ({
      programs: state.programs.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    })),

  deleteProgram: (id) =>
    set((state) => ({
      programs: state.programs.filter((p) => p.id !== id),
      // Also delete associated projects
      projects: state.projects.filter((p) => p.programId !== id),
    })),

  getProgramById: (id) => {
    return get().programs.find((p) => p.id === id);
  },

  filterPrograms: (filter) => {
    let programs = get().programs;

    if (filter.status) {
      programs = programs.filter((p) => p.status === filter.status);
    }

    if (filter.ownerId) {
      programs = programs.filter((p) => p.ownerId === filter.ownerId);
    }

    if (filter.dateRange) {
      programs = programs.filter(
        (p) =>
          p.startDate >= filter.dateRange!.start &&
          p.endDate <= filter.dateRange!.end
      );
    }

    return programs;
  },

  // ============================================
  // Project Actions
  // ============================================

  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      // Also delete associated tasks
      tasks: state.tasks.filter((t) => t.projectId !== id),
    })),

  getProjectsByProgram: (programId) => {
    return get().projects.filter((p) => p.programId === programId);
  },

  getProjectById: (id) => {
    return get().projects.find((p) => p.id === id);
  },

  filterProjects: (filter) => {
    let projects = get().projects;

    if (filter.programId) {
      projects = projects.filter((p) => p.programId === filter.programId);
    }

    if (filter.status) {
      projects = projects.filter((p) => p.status === filter.status);
    }

    if (filter.priority) {
      projects = projects.filter((p) => p.priority === filter.priority);
    }

    if (filter.managerId) {
      projects = projects.filter((p) => p.managerId === filter.managerId);
    }

    return projects;
  },

  // ============================================
  // Task Actions
  // ============================================

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  getTasksByProject: (projectId) => {
    return get().tasks.filter((t) => t.projectId === projectId);
  },

  getTaskById: (id) => {
    return get().tasks.find((t) => t.id === id);
  },

  // ============================================
  // Resource Actions
  // ============================================

  setResources: (resources) => set({ resources }),

  addResource: (resource) =>
    set((state) => ({
      resources: [...state.resources, resource],
    })),

  updateResource: (id, updates) =>
    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
      ),
    })),

  deleteResource: (id) =>
    set((state) => ({
      resources: state.resources.filter((r) => r.id !== id),
      // Also delete associated allocations
      allocations: state.allocations.filter((a) => a.resourceId !== id),
    })),

  getResourceById: (id) => {
    return get().resources.find((r) => r.id === id);
  },

  filterResources: (filter) => {
    let resources = get().resources;

    if (filter.department) {
      resources = resources.filter((r) => r.department === filter.department);
    }

    if (filter.skill) {
      resources = resources.filter((r) => r.skills.includes(filter.skill!));
    }

    if (filter.availability) {
      resources = resources.filter((r) => {
        const availability = get().getResourceAvailability(r.id);
        switch (filter.availability) {
          case 'available':
            return availability > 20;
          case 'fully-allocated':
            return availability > 0 && availability <= 20;
          case 'over-allocated':
            return availability <= 0;
          default:
            return true;
        }
      });
    }

    return resources;
  },

  getResourceAvailability: (resourceId) => {
    const resource = get().getResourceById(resourceId);
    if (!resource) return 0;

    const allocations = get().getAllocationsByResource(resourceId);
    const totalAllocation = allocations.reduce(
      (sum, a) => sum + a.allocationPercent,
      0
    );

    return resource.capacity - totalAllocation;
  },

  // ============================================
  // Allocation Actions
  // ============================================

  setAllocations: (allocations) => set({ allocations }),

  addAllocation: (allocation) =>
    set((state) => ({
      allocations: [...state.allocations, allocation],
    })),

  updateAllocation: (id, updates) =>
    set((state) => ({
      allocations: state.allocations.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      ),
    })),

  deleteAllocation: (id) =>
    set((state) => ({
      allocations: state.allocations.filter((a) => a.id !== id),
    })),

  getAllocationsByResource: (resourceId) => {
    return get().allocations.filter((a) => a.resourceId === resourceId);
  },

  getAllocationsByProject: (projectId) => {
    return get().allocations.filter((a) => a.projectId === projectId);
  },

  // ============================================
  // Budget Actions
  // ============================================

  setBudgets: (budgets) => set({ budgets }),

  addBudget: (budget) =>
    set((state) => ({
      budgets: [...state.budgets, budget],
    })),

  updateBudget: (id, updates) =>
    set((state) => ({
      budgets: state.budgets.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
      ),
    })),

  deleteBudget: (id) =>
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    })),

  getBudgetsByProject: (projectId) => {
    return get().budgets.filter((b) => b.projectId === projectId);
  },

  // ============================================
  // Risk Actions
  // ============================================

  setRisks: (risks) => set({ risks }),

  addRisk: (risk) =>
    set((state) => ({
      risks: [...state.risks, risk],
    })),

  updateRisk: (id, updates) =>
    set((state) => ({
      risks: state.risks.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
      ),
    })),

  deleteRisk: (id) =>
    set((state) => ({
      risks: state.risks.filter((r) => r.id !== id),
    })),

  getRisksByProject: (projectId) => {
    return get().risks.filter((r) => r.projectId === projectId);
  },

  // ============================================
  // Milestone Actions
  // ============================================

  setMilestones: (milestones) => set({ milestones }),

  addMilestone: (milestone) =>
    set((state) => ({
      milestones: [...state.milestones, milestone],
    })),

  updateMilestone: (id, updates) =>
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
      ),
    })),

  deleteMilestone: (id) =>
    set((state) => ({
      milestones: state.milestones.filter((m) => m.id !== id),
    })),

  getMilestonesByProject: (projectId) => {
    return get().milestones.filter((m) => m.projectId === projectId);
  },

  // ============================================
  // Selection Actions
  // ============================================

  setSelectedProgram: (id) => set({ selectedProgramId: id }),

  setSelectedProject: (id) => set({ selectedProjectId: id }),

  setSelectedResource: (id) => set({ selectedResourceId: id }),

  clearSelections: () =>
    set({
      selectedProgramId: null,
      selectedProjectId: null,
      selectedResourceId: null,
    }),

  // ============================================
  // Utility Actions
  // ============================================

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      programs: [],
      projects: [],
      tasks: [],
      resources: [],
      allocations: [],
      budgets: [],
      risks: [],
      milestones: [],
      selectedProgramId: null,
      selectedProjectId: null,
      selectedResourceId: null,
      loading: false,
      error: null,
    }),
}));
