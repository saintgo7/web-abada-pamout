import React, { useState } from 'react';
import { usePPMSStore } from '../../stores/ppmsStore';
import { Card } from './common/Card';
import { Badge, getStatusBadgeVariant } from './common/Badge';
import { Progress } from './common/Progress';
import { Button } from './common/Button';
import {
  Users,
  Calendar,
  Briefcase,
  Plus,
  UserPlus,
  Clock,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ResourceAllocationProps {
  lang: 'en' | 'ko';
}

const TRANSLATIONS = {
  en: {
    title: 'Resource Allocation',
    subtitle: 'Manage your team and project assignments',
    resources: 'Team Members',
    projects: 'Projects',
    available: 'Available',
    allocated: 'Allocated',
    overallocated: 'Over-allocated',
    assignToProject: 'Assign to Project',
    remove: 'Remove',
    skills: 'Skills',
    capacity: 'Capacity',
    allocation: 'Allocation',
    currentProjects: 'Current Projects',
    noAllocations: 'No allocations yet',
    totalResources: 'Total Resources',
    averageUtilization: 'Average Utilization',
    dragToAssign: 'Drag resources to projects to assign',
  },
  ko: {
    title: '리소스 할당',
    subtitle: '팀 및 프로젝트 배포를 관리합니다',
    resources: '팀원',
    projects: '프로젝트',
    available: '가용',
    allocated: '할당됨',
    overallocated: '과할당',
    assignToProject: '프로젝트에 할당',
    remove: '제거',
    skills: '기술',
    capacity: '용량',
    allocation: '할당',
    currentProjects: '현재 프로젝트',
    noAllocations: '할당 내역 없음',
    totalResources: '전체 리소스',
    averageUtilization: '평균 활용률',
    dragToAssign: '리소스를 드래그하여 프로젝트에 할당하세요',
  },
};

// Sortable Resource Card
interface SortableResourceCardProps {
  resource: ResourceWithAllocations;
  lang: 'en' | 'ko';
}

function SortableResourceCard({ resource, lang }: SortableResourceCardProps) {
  const t = TRANSLATIONS[lang];
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Calculate availability
  const totalAllocation = resource.allocations.reduce(
    (sum, a) => sum + a.allocationPercent,
    0
  );
  const available = resource.capacity - totalAllocation;
  const availabilityStatus =
    available < 0 ? 'overallocated' : available > 0 ? 'available' : 'allocated';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 cursor-move hover:shadow-md transition-shadow"
    >
      {/* Resource Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-xl">
            {resource.avatar}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {resource.name}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {resource.role}
            </p>
          </div>
        </div>
        <Badge
          variant={
            availabilityStatus === 'available'
              ? 'success'
              : availabilityStatus === 'allocated'
              ? 'info'
              : 'danger'
          }
        >
          {t[availabilityStatus]}
        </Badge>
      </div>

      {/* Capacity */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-600 dark:text-slate-400">
            {t.capacity}: {resource.capacity}%
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {t.allocation}: {totalAllocation}%
          </span>
        </div>
        <Progress value={totalAllocation} size="sm" max={resource.capacity} />
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {resource.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-md"
          >
            {skill}
          </span>
        ))}
        {resource.skills.length > 3 && (
          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-md">
            +{resource.skills.length - 3}
          </span>
        )}
      </div>

      {/* Current Allocations */}
      {resource.allocations.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
            {t.currentProjects}
          </p>
          <div className="space-y-1">
            {resource.allocations.slice(0, 2).map((allocation) => (
              <div
                key={allocation.id}
                className="text-xs text-slate-600 dark:text-slate-400"
              >
                <span className="font-medium">{allocation.project.name}</span> -{' '}
                {allocation.allocationPercent}%
              </div>
            ))}
            {resource.allocations.length > 2 && (
              <p className="text-xs text-slate-500">
                +{resource.allocations.length - 2} {t.projects}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Project Drop Zone
interface ProjectDropZoneProps {
  project: Project & { resources: ResourceWithAllocations[] };
  lang: 'en' | 'ko';
}

function ProjectDropZone({ project, lang }: ProjectDropZoneProps) {
  const t = TRANSLATIONS[lang];
  const { setNodeRef } = useDroppable({
    id: project.id,
  });

  const totalAllocation = project.resources.reduce(
    (sum, r) =>
      sum +
      r.allocations
        .filter((a) => a.projectId === project.id)
        .reduce((sum, a) => sum + a.allocationPercent, 0),
    0
  );

  return (
    <div
      ref={setNodeRef}
      className="bg-white dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 min-h-[200px]"
    >
      {/* Project Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">
            {project.name}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {project.resources.length} {t.resources}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(project.status)}>
          {project.status}
        </Badge>
      </div>

      {/* Allocated Resources */}
      {project.resources.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-600">
          <div className="text-center">
            <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t.dragToAssign}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {project.resources.map((resource) => {
            const allocation = resource.allocations.find(
              (a) => a.projectId === project.id
            );
            return (
              <div
                key={resource.id}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{resource.avatar}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {resource.name}
                  </span>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {allocation?.allocationPercent}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Total Allocation */}
      {project.resources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {t.allocation}
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {totalAllocation}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export const ResourceAllocation: React.FC<ResourceAllocationProps> = ({
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const { resources, projects, getAllocationsByProject, getResourceById } =
    usePPMSStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Enrich resources with allocations
  const resourcesWithAllocations = resources.map((resource) => ({
    ...resource,
    allocations: usePPMSStore
      .getState()
      .getAllocationsByResource(resource.id)
      .map((a) => ({
        ...a,
        project: usePPMSStore.getState().getProjectById(a.projectId)!,
      })),
  })) as ResourceWithAllocations[];

  // Enrich projects with allocated resources
  const projectsWithResources = projects.map((project) => ({
    ...project,
    resources: resourcesWithAllocations.filter((r) =>
      r.allocations.some((a) => a.projectId === project.id)
    ),
  }));

  // Calculate metrics
  const totalResources = resources.length;
  const averageUtilization =
    resources.length > 0
      ? resources.reduce((sum, r) => {
          const allocations = usePPMSStore
            .getState()
            .getAllocationsByResource(r.id);
          const totalAllocation = allocations.reduce(
            (sum, a) => sum + a.allocationPercent,
            0
          );
          return sum + (totalAllocation / r.capacity) * 100;
        }, 0) / resources.length
      : 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const resourceId = active.id as string;
    const projectId = over.id as string;

    // TODO: Create allocation
    console.log('Assign resource', resourceId, 'to project', projectId);
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
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t.totalResources}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {totalResources}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t.averageUtilization}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {Math.round(averageUtilization)}%
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Drag and Drop Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resources List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {t.resources}
            </h2>
            <div className="space-y-4">
              <SortableContext
                items={resourcesWithAllocations.map((r) => r.id)}
              >
                {resourcesWithAllocations.map((resource) => (
                  <SortableResourceCard
                    key={resource.id}
                    resource={resource}
                    lang={lang}
                  />
                ))}
              </SortableContext>
            </div>
          </div>

          {/* Projects Drop Zones */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              {t.projects}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsWithResources.map((project) => (
                <ProjectDropZone
                  key={project.id}
                  project={project}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

// Type imports
type ResourceWithAllocations = import('../../../types').ResourceWithAllocations;
type Project = import('../../../types').Project;
