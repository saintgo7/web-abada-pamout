import React, { useState } from 'react';
import { usePPMSStore } from '../../stores/ppmsStore';
import type { Program } from '../../types';
import { Card } from './common/Card';
import { Badge, getStatusBadgeVariant } from './common/Badge';
import { Progress } from './common/Progress';
import { Button } from './common/Button';
import {
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';

interface ProgramListProps {
  lang: 'en' | 'ko';
  onCreateProgram: () => void;
  onEditProgram: (program: Program) => void;
  onViewDetails: (programId: string) => void;
}

const TRANSLATIONS = {
  en: {
    title: 'Programs',
    subtitle: 'Manage your programs',
    createProgram: 'Create Program',
    filterAll: 'All',
    filterActive: 'Active',
    filterPlanning: 'Planning',
    filterCompleted: 'Completed',
    filterOnhold: 'On Hold',
    budget: 'Budget',
    spent: 'Spent',
    progress: 'Progress',
    projects: 'projects',
    noPrograms: 'No programs found',
    start: 'Start',
    end: 'End',
    owner: 'Owner',
  },
  ko: {
    title: '프로그램',
    subtitle: '프로그램을 관리합니다',
    createProgram: '프로그램 생성',
    filterAll: '전체',
    filterActive: '활성',
    filterPlanning: '계획중',
    filterCompleted: '완료',
    filterOnhold: '보류',
    budget: '예산',
    spent: '지출',
    progress: '진행률',
    projects: '프로젝트',
    noPrograms: '프로그램을 찾을 수 없습니다',
    start: '시작일',
    end: '종료일',
    owner: '담당자',
  },
};

export const ProgramList: React.FC<ProgramListProps> = ({
  lang,
  onCreateProgram,
  onEditProgram,
  onViewDetails,
}) => {
  const t = TRANSLATIONS[lang];
  const { programs, deleteProgram, getProjectsByProgram, filterPrograms } =
    usePPMSStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Filter programs
  const filteredPrograms =
    statusFilter === 'all'
      ? programs
      : filterPrograms({ status: statusFilter as any });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleDelete = (programId: string) => {
    if (lang === 'en') {
      if (confirm('Are you sure you want to delete this program?')) {
        deleteProgram(programId);
      }
    } else {
      if (confirm('이 프로그램을 삭제하시겠습니까?')) {
        deleteProgram(programId);
      }
    }
    setMenuOpen(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t.subtitle}
          </p>
        </div>
        <Button onClick={onCreateProgram} leftIcon={<Plus className="w-4 h-4" />}>
          {t.createProgram}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Button
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          {t.filterAll}
        </Button>
        <Button
          variant={statusFilter === 'active' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('active')}
        >
          {t.filterActive}
        </Button>
        <Button
          variant={statusFilter === 'planning' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('planning')}
        >
          {t.filterPlanning}
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('completed')}
        >
          {t.filterCompleted}
        </Button>
        <Button
          variant={statusFilter === 'on-hold' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('on-hold')}
        >
          {t.filterOnhold}
        </Button>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {t.noPrograms}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {lang === 'en'
                ? 'Get started by creating your first program'
                : '첫 번째 프로그램을 생성하여 시작하세요'}
            </p>
            <Button onClick={onCreateProgram} leftIcon={<Plus className="w-4 h-4" />}>
              {t.createProgram}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => {
            const projectCount = getProjectsByProgram(program.id).length;
            const isMenuOpen = menuOpen === program.id;

            return (
              <Card
                key={program.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {program.name}
                    </h3>
                    <Badge variant={getStatusBadgeVariant(program.status)}>
                      {program.status}
                    </Badge>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(isMenuOpen ? null : program.id)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuOpen(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 z-20">
                          <button
                            onClick={() => {
                              onViewDetails(program.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 rounded-t-lg"
                          >
                            <Eye className="w-4 h-4" />
                            <span>{t.viewDetails}</span>
                          </button>
                          <button
                            onClick={() => {
                              onEditProgram(program);
                              setMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>{t.editProgram}</span>
                          </button>
                          <button
                            onClick={() => handleDelete(program.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>{t.deleteProgram}</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {program.description}
                </p>

                {/* Dates */}
                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {t.start}: {formatDate(program.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {t.end}: {formatDate(program.endDate)}
                    </span>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {t.budget}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(program.budget)}
                  </span>
                </div>

                {/* Spent */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {t.spent}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(program.spent)}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">
                      {t.progress}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {Math.round(program.progress)}%
                    </span>
                  </div>
                  <Progress value={program.progress} size="md" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    {projectCount} {t.projects}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(program.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {t.viewDetails}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
