import type {
  Program,
  Project,
  Task,
  Resource,
  ResourceAllocation,
  Budget,
  Risk,
  Milestone,
} from '../types';

// ============================================
// Mock PPMS Data Service
// Provides realistic sample data for development
// ============================================

// Helper to create dates relative to today
const today = new Date();
const addDays = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date;
};
const addMonths = (months: number) => {
  const date = new Date(today);
  date.setMonth(date.getMonth() + months);
  return date;
};

// ============================================
// Programs
// ============================================

export const mockPrograms: Program[] = [
  {
    id: 'prog-1',
    name: 'Digital Transformation 2025',
    description:
      'Company-wide digital initiative to modernize legacy systems and implement cloud-native solutions',
    status: 'active',
    startDate: addDays(-60),
    endDate: addMonths(8),
    budget: 2500000,
    spent: 850000,
    progress: 34,
    ownerId: 'user-1',
    createdAt: addDays(-60),
    updatedAt: today,
  },
  {
    id: 'prog-2',
    name: 'Customer Experience Enhancement',
    description:
      'Multi-project initiative to improve customer satisfaction through UX improvements and new service channels',
    status: 'active',
    startDate: addDays(-30),
    endDate: addMonths(6),
    budget: 1800000,
    spent: 420000,
    progress: 23,
    ownerId: 'user-2',
    createdAt: addDays(-30),
    updatedAt: today,
  },
  {
    id: 'prog-3',
    name: 'Infrastructure Modernization',
    description:
      'Complete overhaul of on-premise infrastructure to cloud-based architecture',
    status: 'planning',
    startDate: addMonths(2),
    endDate: addMonths(14),
    budget: 3200000,
    spent: 0,
    progress: 0,
    ownerId: 'user-1',
    createdAt: addDays(-10),
    updatedAt: today,
  },
];

// ============================================
// Projects
// ============================================

export const mockProjects: Project[] = [
  // Digital Transformation Projects
  {
    id: 'proj-1',
    programId: 'prog-1',
    name: 'Cloud Migration Platform',
    description:
      'Migrate core applications to AWS cloud infrastructure with auto-scaling capabilities',
    status: 'in-progress',
    startDate: addDays(-45),
    endDate: addMonths(4),
    budget: 850000,
    spent: 320000,
    progress: 38,
    priority: 'high',
    managerId: 'res-1',
    createdAt: addDays(-45),
    updatedAt: today,
  },
  {
    id: 'proj-2',
    programId: 'prog-1',
    name: 'API Gateway Implementation',
    description:
      'Implement centralized API management with authentication, rate limiting, and analytics',
    status: 'in-progress',
    startDate: addDays(-30),
    endDate: addMonths(3),
    budget: 420000,
    spent: 180000,
    progress: 43,
    priority: 'high',
    managerId: 'res-2',
    createdAt: addDays(-30),
    updatedAt: today,
  },
  {
    id: 'proj-3',
    programId: 'prog-1',
    name: 'Data Lake Construction',
    description:
      'Build enterprise data lake for analytics and machine learning workloads',
    status: 'not-started',
    startDate: addDays(15),
    endDate: addMonths(5),
    budget: 650000,
    spent: 0,
    progress: 0,
    priority: 'medium',
    managerId: 'res-3',
    createdAt: addDays(-15),
    updatedAt: today,
  },
  // Customer Experience Projects
  {
    id: 'proj-4',
    programId: 'prog-2',
    name: 'Mobile App Redesign',
    description:
      'Complete UX/UI overhaul of mobile application with modern design system',
    status: 'in-progress',
    startDate: addDays(-20),
    endDate: addMonths(4),
    budget: 520000,
    spent: 150000,
    progress: 29,
    priority: 'high',
    managerId: 'res-4',
    createdAt: addDays(-20),
    updatedAt: today,
  },
  {
    id: 'proj-5',
    programId: 'prog-2',
    name: 'Self-Service Portal',
    description:
      'Customer-facing portal for account management and service requests',
    status: 'not-started',
    startDate: addDays(30),
    endDate: addMonths(3),
    budget: 380000,
    spent: 0,
    progress: 0,
    priority: 'medium',
    managerId: 'res-5',
    createdAt: addDays(-5),
    updatedAt: today,
  },
];

// ============================================
// Tasks
// ============================================

export const mockTasks: Task[] = [
  // Cloud Migration Tasks
  {
    id: 'task-1',
    projectId: 'proj-1',
    name: 'Infrastructure Assessment',
    description: 'Assess current infrastructure and create migration roadmap',
    status: 'completed',
    startDate: addDays(-45),
    endDate: addDays(-30),
    progress: 100,
    priority: 'high',
    assigneeId: 'res-1',
    dependencies: [],
    createdAt: addDays(-45),
    updatedAt: addDays(-30),
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    name: 'AWS Account Setup',
    description: 'Set up AWS accounts, VPC, and security groups',
    status: 'completed',
    startDate: addDays(-35),
    endDate: addDays(-20),
    progress: 100,
    priority: 'critical',
    assigneeId: 'res-6',
    dependencies: [],
    createdAt: addDays(-35),
    updatedAt: addDays(-20),
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    name: 'Database Migration',
    description: 'Migrate PostgreSQL databases to AWS RDS',
    status: 'in-progress',
    startDate: addDays(-15),
    endDate: addDays(15),
    progress: 60,
    priority: 'high',
    assigneeId: 'res-7',
    dependencies: [
      {
        id: 'dep-1',
        taskId: 'task-3',
        dependsOnTaskId: 'task-2',
        type: 'finish-to-start',
      },
    ],
    createdAt: addDays(-15),
    updatedAt: today,
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    name: 'Application Deployment',
    description: 'Deploy applications to ECS clusters',
    status: 'todo',
    startDate: addDays(10),
    endDate: addDays(30),
    progress: 0,
    priority: 'high',
    assigneeId: 'res-8',
    dependencies: [
      {
        id: 'dep-2',
        taskId: 'task-4',
        dependsOnTaskId: 'task-3',
        type: 'finish-to-start',
      },
    ],
    createdAt: addDays(-10),
    updatedAt: today,
  },
  // Mobile App Tasks
  {
    id: 'task-5',
    projectId: 'proj-4',
    name: 'Design System Creation',
    description: 'Create comprehensive design system with components',
    status: 'completed',
    startDate: addDays(-20),
    endDate: addDays(-5),
    progress: 100,
    priority: 'high',
    assigneeId: 'res-9',
    dependencies: [],
    createdAt: addDays(-20),
    updatedAt: addDays(-5),
  },
  {
    id: 'task-6',
    projectId: 'proj-4',
    name: 'UI Component Development',
    description: 'Build reusable UI components based on design system',
    status: 'in-progress',
    startDate: addDays(-5),
    endDate: addDays(15),
    progress: 45,
    priority: 'high',
    assigneeId: 'res-10',
    dependencies: [
      {
        id: 'dep-3',
        taskId: 'task-6',
        dependsOnTaskId: 'task-5',
        type: 'finish-to-start',
      },
    ],
    createdAt: addDays(-5),
    updatedAt: today,
  },
];

// ============================================
// Resources
// ============================================

export const mockResources: Resource[] = [
  {
    id: 'res-1',
    name: '김철수',
    email: 'cheolsu.kim@company.com',
    role: 'Program Manager',
    department: 'IT',
    skills: ['Program Management', 'Agile', 'Stakeholder Management'],
    capacity: 80,
    hourlyRate: 150,
    avatar: '👨‍💼',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-2',
    name: '이영희',
    email: 'younghee.lee@company.com',
    role: 'Tech Lead',
    department: 'Engineering',
    skills: ['API Design', 'Node.js', 'AWS', 'Kubernetes'],
    capacity: 100,
    hourlyRate: 120,
    avatar: '👩‍💻',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-3',
    name: '박민수',
    email: 'minsu.park@company.com',
    role: 'Data Architect',
    department: 'Data',
    skills: ['Data Engineering', 'Python', 'SQL', 'AWS Redshift'],
    capacity: 90,
    hourlyRate: 130,
    avatar: '👨‍🔬',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-4',
    name: '최수진',
    email: 'sujin.choi@company.com',
    role: 'Product Manager',
    department: 'Product',
    skills: ['Product Strategy', 'UX Research', 'Agile'],
    capacity: 85,
    hourlyRate: 125,
    avatar: '👩‍💼',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-5',
    name: '정진우',
    email: 'jinwoo.jung@company.com',
    role: 'Project Manager',
    department: 'IT',
    skills: ['Project Management', 'Scrum', 'Risk Management'],
    capacity: 75,
    hourlyRate: 115,
    avatar: '👨‍💼',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-6',
    name: '강현준',
    email: 'hyunjun.kang@company.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    capacity: 100,
    hourlyRate: 110,
    avatar: '👨‍🔧',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-7',
    name: '윤서연',
    email: 'seoyoon.yoon@company.com',
    role: 'Backend Developer',
    department: 'Engineering',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    capacity: 95,
    hourlyRate: 105,
    avatar: '👩‍💻',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-8',
    name: '오도현',
    email: 'dohyun.oh@company.com',
    role: 'Full Stack Developer',
    department: 'Engineering',
    skills: ['React', 'Node.js', 'TypeScript', 'Docker'],
    capacity: 90,
    hourlyRate: 108,
    avatar: '👨‍💻',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-9',
    name: '신예린',
    email: 'yerin.shin@company.com',
    role: 'UI/UX Designer',
    department: 'Design',
    skills: ['Figma', 'UI Design', 'Prototyping', 'User Research'],
    capacity: 85,
    hourlyRate: 95,
    avatar: '👩‍🎨',
    createdAt: addDays(-90),
    updatedAt: today,
  },
  {
    id: 'res-10',
    name: '한준호',
    email: 'junho.han@company.com',
    role: 'Frontend Developer',
    department: 'Engineering',
    skills: ['React', 'TypeScript', 'CSS', 'Storybook'],
    capacity: 100,
    hourlyRate: 102,
    avatar: '👨‍💻',
    createdAt: addDays(-90),
    updatedAt: today,
  },
];

// ============================================
// Resource Allocations
// ============================================

export const mockAllocations: ResourceAllocation[] = [
  {
    id: 'alloc-1',
    resourceId: 'res-1',
    projectId: 'proj-1',
    allocationPercent: 40,
    startDate: addDays(-45),
    endDate: addMonths(4),
    createdAt: addDays(-45),
    updatedAt: today,
  },
  {
    id: 'alloc-2',
    resourceId: 'res-1',
    projectId: 'proj-2',
    allocationPercent: 30,
    startDate: addDays(-30),
    endDate: addMonths(3),
    createdAt: addDays(-30),
    updatedAt: today,
  },
  {
    id: 'alloc-3',
    resourceId: 'res-2',
    projectId: 'proj-2',
    allocationPercent: 60,
    startDate: addDays(-30),
    endDate: addMonths(3),
    createdAt: addDays(-30),
    updatedAt: today,
  },
  {
    id: 'alloc-4',
    resourceId: 'res-3',
    projectId: 'proj-3',
    allocationPercent: 50,
    startDate: addDays(15),
    endDate: addMonths(5),
    createdAt: addDays(-15),
    updatedAt: today,
  },
  {
    id: 'alloc-5',
    resourceId: 'res-4',
    projectId: 'proj-4',
    allocationPercent: 50,
    startDate: addDays(-20),
    endDate: addMonths(4),
    createdAt: addDays(-20),
    updatedAt: today,
  },
  {
    id: 'alloc-6',
    resourceId: 'res-6',
    projectId: 'proj-1',
    allocationPercent: 70,
    startDate: addDays(-35),
    endDate: addDays(30),
    createdAt: addDays(-35),
    updatedAt: today,
  },
  {
    id: 'alloc-7',
    resourceId: 'res-7',
    projectId: 'proj-1',
    allocationPercent: 80,
    startDate: addDays(-15),
    endDate: addDays(15),
    createdAt: addDays(-15),
    updatedAt: today,
  },
  {
    id: 'alloc-8',
    resourceId: 'res-8',
    projectId: 'proj-1',
    allocationPercent: 60,
    startDate: addDays(10),
    endDate: addDays(30),
    createdAt: addDays(-10),
    updatedAt: today,
  },
  {
    id: 'alloc-9',
    resourceId: 'res-9',
    projectId: 'proj-4',
    allocationPercent: 65,
    startDate: addDays(-20),
    endDate: addDays(15),
    createdAt: addDays(-20),
    updatedAt: today,
  },
  {
    id: 'alloc-10',
    resourceId: 'res-10',
    projectId: 'proj-4',
    allocationPercent: 75,
    startDate: addDays(-5),
    endDate: addDays(15),
    createdAt: addDays(-5),
    updatedAt: today,
  },
];

// ============================================
// Budgets
// ============================================

export const mockBudgets: Budget[] = [
  // Cloud Migration Budgets
  {
    id: 'budget-1',
    projectId: 'proj-1',
    category: 'personnel',
    plannedAmount: 450000,
    actualAmount: 175000,
    fiscalYear: 2025,
    quarter: 1,
    createdAt: addDays(-45),
    updatedAt: today,
  },
  {
    id: 'budget-2',
    projectId: 'proj-1',
    category: 'equipment',
    plannedAmount: 250000,
    actualAmount: 95000,
    fiscalYear: 2025,
    quarter: 1,
    createdAt: addDays(-45),
    updatedAt: today,
  },
  {
    id: 'budget-3',
    projectId: 'proj-1',
    category: 'cloud-services',
    plannedAmount: 150000,
    actualAmount: 50000,
    fiscalYear: 2025,
    quarter: 1,
    createdAt: addDays(-45),
    updatedAt: today,
  },
  // API Gateway Budgets
  {
    id: 'budget-4',
    projectId: 'proj-2',
    category: 'personnel',
    plannedAmount: 280000,
    actualAmount: 120000,
    fiscalYear: 2025,
    quarter: 1,
    createdAt: addDays(-30),
    updatedAt: today,
  },
  {
    id: 'budget-5',
    projectId: 'proj-2',
    category: 'software-licenses',
    plannedAmount: 140000,
    actualAmount: 60000,
    fiscalYear: 2025,
    quarter: 1,
    createdAt: addDays(-30),
    updatedAt: today,
  },
];

// ============================================
// Risks
// ============================================

export const mockRisks: Risk[] = [
  {
    id: 'risk-1',
    projectId: 'proj-1',
    title: 'AWS Service Outage',
    description:
      'Potential AWS service outage could impact migrated applications',
    probability: 'low',
    impact: 'high',
    mitigationPlan:
      'Implement multi-region deployment and disaster recovery procedures',
    owner: 'res-6',
    status: 'open',
    identifiedDate: addDays(-40),
    dueDate: addDays(30),
    createdAt: addDays(-40),
    updatedAt: today,
  },
  {
    id: 'risk-2',
    projectId: 'proj-1',
    title: 'Data Loss During Migration',
    description: 'Risk of data corruption or loss during database migration',
    probability: 'medium',
    impact: 'critical',
    mitigationPlan:
      'Implement comprehensive backup strategy and validation testing',
    owner: 'res-7',
    status: 'mitigated',
    identifiedDate: addDays(-25),
    dueDate: addDays(5),
    createdAt: addDays(-25),
    updatedAt: today,
  },
  {
    id: 'risk-3',
    projectId: 'proj-4',
    title: 'Scope Creep',
    description: 'Project scope expanding beyond original requirements',
    probability: 'high',
    impact: 'medium',
    mitigationPlan:
      'Strict change management process and regular stakeholder reviews',
    owner: 'res-4',
    status: 'open',
    identifiedDate: addDays(-15),
    dueDate: addDays(20),
    createdAt: addDays(-15),
    updatedAt: today,
  },
  {
    id: 'risk-4',
    projectId: 'proj-2',
    title: 'Third-Party API Compatibility',
    description:
      'Integration issues with third-party APIs through the gateway',
    probability: 'medium',
    impact: 'medium',
    mitigationPlan:
      'Early testing with all third-party providers and fallback mechanisms',
    owner: 'res-2',
    status: 'open',
    identifiedDate: addDays(-20),
    dueDate: addDays(25),
    createdAt: addDays(-20),
    updatedAt: today,
  },
];

// ============================================
// Milestones
// ============================================

export const mockMilestones: Milestone[] = [
  {
    id: 'milestone-1',
    projectId: 'proj-1',
    name: 'Infrastructure Ready',
    description: 'AWS infrastructure fully provisioned and configured',
    date: addDays(-20),
    status: 'completed',
    createdAt: addDays(-45),
    updatedAt: addDays(-20),
  },
  {
    id: 'milestone-2',
    projectId: 'proj-1',
    name: 'Database Migration Complete',
    description: 'All databases migrated to AWS RDS',
    date: addDays(15),
    status: 'pending',
    createdAt: addDays(-45),
    updatedAt: today,
  },
  {
    id: 'milestone-3',
    projectId: 'proj-1',
    name: 'Production Go-Live',
    description: 'Applications live in production environment',
    date: addDays(30),
    status: 'pending',
    createdAt: addDays(-45),
    updatedAt: today,
  },
  {
    id: 'milestone-4',
    projectId: 'proj-4',
    name: 'Design System Approved',
    description: 'Design system reviewed and approved by stakeholders',
    date: addDays(-5),
    status: 'completed',
    createdAt: addDays(-20),
    updatedAt: addDays(-5),
  },
  {
    id: 'milestone-5',
    projectId: 'proj-4',
    name: 'Beta Release',
    description: 'Beta version released to select customers',
    date: addDays(45),
    status: 'pending',
    createdAt: addDays(-20),
    updatedAt: today,
  },
];

// ============================================
// Initialize Store Function
// ============================================

/**
 * Initialize the PPMS store with mock data
 * Call this when the app starts to populate the store
 */
export const initializeMockData = () => {
  // This function will be called from App.tsx
  // It returns all the mock data
  return {
    programs: mockPrograms,
    projects: mockProjects,
    tasks: mockTasks,
    resources: mockResources,
    allocations: mockAllocations,
    budgets: mockBudgets,
    risks: mockRisks,
    milestones: mockMilestones,
  };
};
