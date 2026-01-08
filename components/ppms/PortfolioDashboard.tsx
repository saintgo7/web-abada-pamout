import React from 'react';
import { usePPMSStore } from '../../stores/ppmsStore';
import type { Program } from '../../types';
import { Card } from './common/Card';
import { Badge, getStatusBadgeVariant } from './common/Badge';
import { Progress } from './common/Progress';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface PortfolioDashboardProps {
  lang: 'en' | 'ko';
}

const TRANSLATIONS = {
  en: {
    totalPrograms: 'Total Programs',
    activeProjects: 'Active Projects',
    resourceUtilization: 'Resource Utilization',
    budgetConsumed: 'Budget Consumed',
    programStatus: 'Program Status',
    budgetTrend: 'Budget Trend (K)',
    viewAll: 'View All',
  },
  ko: {
    totalPrograms: '전체 프로그램',
    activeProjects: '활성 프로젝트',
    resourceUtilization: '리소스 활용률',
    budgetConsumed: '예산 소비',
    programStatus: '프로그램 상태',
    budgetTrend: '예산 추이 (K)',
    viewAll: '전체 보기',
  },
};

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const { programs, projects, resources, budgets } = usePPMSStore();

  // Calculate KPIs
  const totalPrograms = programs.length;
  const activeProjects = projects.filter(
    (p) => p.status === 'in-progress' || p.status === 'not-started'
  ).length;

  // Calculate resource utilization
  const totalCapacity = resources.reduce((sum, r) => sum + r.capacity, 0);
  const totalAllocated = resources.reduce((sum, r) => {
    const allocations = usePPMSStore
      .getState()
      .getAllocationsByResource(r.id);
    const allocated = allocations.reduce(
      (sum, a) => sum + a.allocationPercent,
      0
    );
    return sum + allocated;
  }, 0);
  const resourceUtilization = totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 0;

  // Calculate budget consumed
  const totalBudget = programs.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = programs.reduce((sum, p) => sum + p.spent, 0);
  const budgetConsumed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Prepare program status data for pie chart
  const programStatusData = programs.reduce((acc, program) => {
    const status = program.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(programStatusData).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Prepare budget trend data (last 6 months)
  const budgetTrendData = programs.map((program) => ({
    name: program.name.split(' ')[0], // Use first word as label
    planned: program.budget / 1000, // Convert to K
    actual: program.spent / 1000,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t.programStatus}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'en'
              ? 'Overview of your programs and projects'
              : '프로그램 및 프로젝트 현황 개요'}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Programs */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t.totalPrograms}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {totalPrograms}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        {/* Active Projects */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t.activeProjects}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {activeProjects}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        {/* Resource Utilization */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t.resourceUtilization}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {Math.round(resourceUtilization)}%
              </p>
              <Progress
                value={resourceUtilization}
                size="sm"
                color={resourceUtilization > 80 ? 'amber' : 'emerald'}
                className="mt-3"
              />
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl ml-4">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        {/* Budget Consumed */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t.budgetConsumed}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {Math.round(budgetConsumed)}%
              </p>
              <Progress
                value={budgetConsumed}
                size="sm"
                color={budgetConsumed > 80 ? 'amber' : 'indigo'}
                className="mt-3"
              />
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl ml-4">
              <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Status Pie Chart */}
        <Card title={t.programStatus}>
          <div className="h-80">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                {lang === 'en' ? 'No data available' : '데이터 없음'}
              </div>
            )}
          </div>
        </Card>

        {/* Budget Trend Line Chart */}
        <Card title={t.budgetTrend}>
          <div className="h-80">
            {budgetTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={budgetTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis
                    dataKey="name"
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <YAxis className="text-slate-600 dark:text-slate-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(15 23 42)',
                      border: '1px solid rgb(51 65 85)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name={lang === 'en' ? 'Planned' : '계획'}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    name={lang === 'en' ? 'Actual' : '실제'}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                {lang === 'en' ? 'No data available' : '데이터 없음'}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Programs List Preview */}
      <Card
        title={lang === 'en' ? 'Programs Overview' : '프로그램 개요'}
        subtitle={lang === 'en' ? 'Your active programs' : '활성화된 프로그램'}
      >
        <div className="space-y-4">
          {programs.slice(0, 3).map((program) => (
            <div
              key={program.id}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {program.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {program.description.substring(0, 60)}...
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {Math.round(program.progress)}%
                  </p>
                  <Progress value={program.progress} size="sm" className="w-24" />
                </div>
                <Badge variant={getStatusBadgeVariant(program.status)}>
                  {program.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
