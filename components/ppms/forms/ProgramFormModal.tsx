import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePPMSStore } from '../../../stores/ppmsStore';
import type { Program, ProgramStatus } from '../../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Calendar, DollarSign, User } from 'lucide-react';

interface ProgramFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  program?: Program;
  lang: 'en' | 'ko';
}

const TRANSLATIONS = {
  en: {
    createProgram: 'Create Program',
    editProgram: 'Edit Program',
    name: 'Program Name',
    namePlaceholder: 'Enter program name',
    description: 'Description',
    descriptionPlaceholder: 'Enter program description',
    status: 'Status',
    startDate: 'Start Date',
    endDate: 'End Date',
    budget: 'Budget (USD)',
    spent: 'Amount Spent (USD)',
    progress: 'Progress (%)',
    ownerId: 'Program Owner',
    save: 'Save Program',
    cancel: 'Cancel',
    required: 'This field is required',
    invalidDate: 'End date must be after start date',
    planning: 'Planning',
    active: 'Active',
    'on-hold': 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  ko: {
    createProgram: '프로그램 생성',
    editProgram: '프로그램 편집',
    name: '프로그램명',
    namePlaceholder: '프로그램명을 입력하세요',
    description: '설명',
    descriptionPlaceholder: '프로그램 설명을 입력하세요',
    status: '상태',
    startDate: '시작일',
    endDate: '종료일',
    budget: '예산 (USD)',
    spent: '지출액 (USD)',
    progress: '진행률 (%)',
    ownerId: '프로그램 담당자',
    save: '저장',
    cancel: '취소',
    required: '필수 항목입니다',
    invalidDate: '종료일은 시작일 이후여야 합니다',
    planning: '계획중',
    active: '활성',
    'on-hold': '보류',
    completed: '완료',
    cancelled: '취소됨',
  },
};

type FormData = {
  name: string;
  description: string;
  status: ProgramStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  ownerId: string;
};

const STATUSES: ProgramStatus[] = [
  'planning',
  'active',
  'on-hold',
  'completed',
  'cancelled',
];

export const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  isOpen,
  onClose,
  program,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const { addProgram, updateProgram } = usePPMSStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: program
      ? {
          name: program.name,
          description: program.description,
          status: program.status,
          startDate: new Date(program.startDate).toISOString().split('T')[0],
          endDate: new Date(program.endDate).toISOString().split('T')[0],
          budget: program.budget,
          spent: program.spent,
          progress: program.progress,
          ownerId: program.ownerId,
        }
      : {
          name: '',
          description: '',
          status: 'planning',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          budget: 0,
          spent: 0,
          progress: 0,
          ownerId: 'user-1', // Default owner
        },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const programData: Program = {
        id: program?.id || `prog-${Date.now()}`,
        name: data.name,
        description: data.description,
        status: data.status,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        budget: Number(data.budget),
        spent: Number(data.spent),
        progress: Number(data.progress),
        ownerId: data.ownerId,
        createdAt: program?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (program) {
        updateProgram(program.id, programData);
      } else {
        addProgram(programData);
      }

      onClose();
      reset();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={program ? t.editProgram : t.createProgram}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.name} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('name', { required: t.required })}
            placeholder={t.namePlaceholder}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.description} <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description', { required: t.required })}
            placeholder={t.descriptionPlaceholder}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.status}
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((status) => (
              <label
                key={status}
                className={`cursor-pointer ${
                  watch('status') === status ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <input
                  type="radio"
                  {...register('status')}
                  value={status}
                  className="sr-only"
                />
                <Badge variant={status === 'active' ? 'success' : 'gray'}>
                  {t[status] || status}
                </Badge>
              </label>
            ))}
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{t.startDate}</span>
                <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="date"
              {...register('startDate', { required: t.required })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{t.endDate}</span>
                <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="date"
              {...register('endDate', {
                required: t.required,
                validate: (value) => {
                  const startDate = new Date(watch('startDate'));
                  const endDate = new Date(value);
                  return endDate > startDate || t.invalidDate;
                },
              })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Financial Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>{t.budget}</span>
              </div>
            </label>
            <input
              type="number"
              {...register('budget', { valueAsNumber: true, min: 0 })}
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Spent */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>{t.spent}</span>
              </div>
            </label>
            <input
              type="number"
              {...register('spent', { valueAsNumber: true, min: 0 })}
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t.progress}
            </label>
            <input
              type="number"
              {...register('progress', { valueAsNumber: true, min: 0, max: 100 })}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Owner */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{t.ownerId}</span>
            </div>
          </label>
          <input
            type="text"
            {...register('ownerId')}
            defaultValue="user-1"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {t.save}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
