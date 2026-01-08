import React, { useState } from 'react';
import { usePPMSStore } from '../../stores/ppmsStore';
import { Card } from './common/Card';
import { Badge, getStatusBadgeVariant } from './common/Badge';
import { Button } from './common/Button';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Target,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';

interface ScheduleViewProps {
  lang: 'en' | 'ko';
}

const TRANSLATIONS = {
  en: {
    title: 'Schedule & Timeline',
    subtitle: 'View your project timeline and milestones',
    today: 'Today',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    projects: 'Projects',
    tasks: 'Tasks',
    milestones: 'Milestones',
    view: 'View',
    zoom: 'Zoom',
    previous: 'Previous',
    next: 'Next',
    goToToday: 'Go to Today',
    progress: 'Progress',
    noData: 'No scheduled items found',
  },
  ko: {
    title: '일정 및 타임라인',
    subtitle: '프로젝트 타임라인과 마일스톤을 확인하세요',
    today: '오늘',
    day: '일',
    week: '주',
    month: '월',
    projects: '프로젝트',
    tasks: '태스크',
    milestones: '마일스톤',
    view: '보기',
    zoom: '확대/축소',
    previous: '이전',
    next: '다음',
    goToToday: '오늘로 이동',
    progress: '진행률',
    noData: '예약된 항목이 없습니다',
  },
};

type ZoomLevel = 'day' | 'week' | 'month';

export const ScheduleView: React.FC<ScheduleViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const { projects, tasks, milestones, getTasksByProject, getMilestonesByProject } =
    usePPMSStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('week');

  // Get date range based on zoom level
  const getDateRange = () => {
    switch (zoomLevel) {
      case 'day':
        return {
          start: currentDate,
          end: currentDate,
          days: [currentDate],
        };
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return {
          start: weekStart,
          end: weekEnd,
          days: eachDayOfInterval({ start: weekStart, end: weekEnd }),
        };
      case 'month':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
          days: eachDayOfInterval({
            start: startOfMonth(currentDate),
            end: endOfMonth(currentDate),
          }),
        };
    }
  };

  const dateRange = getDateRange();

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const amount = direction === 'next' ? 1 : -1;
    switch (zoomLevel) {
      case 'day':
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + amount)));
        break;
      case 'week':
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + amount * 7)));
        break;
      case 'month':
        setCurrentDate(
          direction === 'next'
            ? addMonths(currentDate, 1)
            : subMonths(currentDate, 1)
        );
        break;
    }
  };

  // Calculate position and width for timeline items
  const calculateItemPosition = (
    startDate: Date,
    endDate: Date
  ) => {
    const rangeDays = dateRange.days.length;
    const totalDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

    const startOffset = Math.max(
      0,
      Math.floor(
        (new Date(startDate).getTime() - dateRange.start.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    return {
      left: (startOffset / rangeDays) * 100,
      width: (Math.min(totalDays, rangeDays - startOffset) / rangeDays) * 100,
    };
  };

  // Check if date is in range
  const isDateInRange = (date: Date) => {
    const d = new Date(date);
    return d >= dateRange.start && d <= dateRange.end;
  };

  // Check for today
  const isToday = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // Group projects by visibility in date range
  const visibleProjects = projects.filter(
    (p) =>
      isDateInRange(p.startDate) ||
      isDateInRange(p.endDate) ||
      (new Date(p.startDate) < dateRange.start && new Date(p.endDate) > dateRange.end)
  );

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
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              {t.today}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="ml-4 text-lg font-semibold text-slate-900 dark:text-white">
              {format(dateRange.start, lang === 'en' ? 'MMM yyyy' : 'yyyy년 MM월')}
            </span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t.view}:
            </span>
            {(['day', 'week', 'month'] as ZoomLevel[]).map((level) => (
              <Button
                key={level}
                variant={zoomLevel === level ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setZoomLevel(level)}
              >
                {t[level]}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Gantt Chart */}
      <Card>
        {visibleProjects.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-600">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t.noData}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Timeline Header */}
              <div className="sticky top-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                <div className="flex">
                  <div className="w-48 flex-shrink-0 p-3 border-r border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white text-sm">
                    {t.projects}
                  </div>
                  <div className="flex-1 flex">
                    {dateRange.days.map((day, index) => (
                      <div
                        key={index}
                        className={`flex-1 p-2 text-center border-r border-slate-200 dark:border-slate-800 text-xs font-medium
                          ${isToday(day) ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}
                          ${isToday(day) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}
                        `}
                      >
                        <div>{format(day, 'MMM d')}</div>
                        <div className="text-[10px] opacity-70">{format(day, 'EEE')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Body */}
              <div>
                {visibleProjects.map((project) => {
                  const position = calculateItemPosition(project.startDate, project.endDate);
                  const projectTasks = getTasksByProject(project.id);
                  const projectMilestones = getMilestonesByProject(project.id);

                  return (
                    <div key={project.id} className="border-b border-slate-200 dark:border-slate-800">
                      <div className="flex">
                        {/* Project Info */}
                        <div className="w-48 flex-shrink-0 p-3 border-r border-slate-200 dark:border-slate-800">
                          <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                            {project.name}
                          </div>
                          <Badge variant={getStatusBadgeVariant(project.status)} size="sm">
                            {project.status}
                          </Badge>
                        </div>

                        {/* Timeline Bar */}
                        <div className="flex-1 p-3 relative" style={{ height: '100px' }}>
                          {/* Grid lines */}
                          <div className="absolute inset-0 flex">
                            {dateRange.days.map((_, index) => (
                              <div
                                key={index}
                                className="flex-1 border-r border-slate-100 dark:border-slate-800"
                              />
                            ))}
                          </div>

                          {/* Project Bar */}
                          <div
                            className="absolute top-2 h-6 rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 shadow-sm flex items-center px-2 cursor-pointer hover:shadow-md transition-shadow"
                            style={{
                              left: `${position.left}%`,
                              width: `${position.width}%`,
                            }}
                          >
                            <span className="text-xs font-medium text-white truncate">
                              {project.name}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div
                            className="absolute top-10 h-2 rounded-full bg-slate-200 dark:bg-slate-700"
                            style={{
                              left: `${position.left}%`,
                              width: `${position.width}%`,
                            }}
                          >
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>

                          {/* Milestones */}
                          {projectMilestones
                            .filter((m) => isDateInRange(m.date))
                            .map((milestone) => {
                              const dayIndex = Math.floor(
                                (new Date(milestone.date).getTime() - dateRange.start.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                              const left = (dayIndex / dateRange.days.length) * 100;

                              return (
                                <div
                                  key={milestone.id}
                                  className="absolute top-16 transform -translate-x-1/2 cursor-pointer group"
                                  style={{ left: `${left}%` }}
                                >
                                  <div className="relative">
                                    <div
                                      className={`w-4 h-4 rotate-45 transform
                                        ${milestone.status === 'completed'
                                          ? 'bg-emerald-500'
                                          : milestone.status === 'overdue'
                                          ? 'bg-red-500'
                                          : 'bg-amber-500'
                                        }
                                      `}
                                    />
                                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block w-max z-20">
                                      <div className="bg-slate-900 text-white text-xs rounded px-2 py-1">
                                        {milestone.name}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
