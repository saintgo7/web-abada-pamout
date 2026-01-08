
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'generation' | 'analysis' | 'coding';
}

export interface MetricData {
  name: string;
  value: number;
}

// ============================================
// PPMS (Program Portfolio Management System) Types
// ============================================

// Status Enums
export type ProgramStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'blocked';
export type DependencyType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// Core Entities
export interface Program {
  id: string;
  name: string;
  description: string;
  status: ProgramStatus;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  progress: number; // 0-100
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  programId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  progress: number; // 0-100
  priority: Priority;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  priority: Priority;
  assigneeId?: string;
  dependencies: TaskDependency[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  type: DependencyType;
  lag?: number; // days
}

export interface Resource {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  capacity: number; // percentage (0-100)
  hourlyRate: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  projectId: string;
  taskId?: string;
  allocationPercent: number; // percentage (0-100)
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  projectId: string;
  category: string; // e.g., 'personnel', 'equipment', 'materials', 'overhead'
  plannedAmount: number;
  actualAmount: number;
  fiscalYear: number;
  quarter?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigationPlan: string;
  owner: string;
  status: 'open' | 'mitigated' | 'closed';
  identifiedDate: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

// View Models and Filters
export interface ProgramWithProjects extends Program {
  projects: Project[];
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
  program?: Program;
}

export interface ResourceWithAllocations extends Resource {
  allocations: (ResourceAllocation & { project: Project; task?: Task })[];
}

export interface ProgramFilter {
  status?: ProgramStatus;
  ownerId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ProjectFilter {
  programId?: string;
  status?: ProjectStatus;
  priority?: Priority;
  managerId?: string;
}

export interface ResourceFilter {
  department?: string;
  skill?: string;
  availability?: 'available' | 'fully-allocated' | 'over-allocated';
}
