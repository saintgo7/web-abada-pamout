import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePPMSStore } from '../../stores/ppmsStore';
import { translations } from '../../translations';
import { AlertTriangle, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

interface PPMSAlertsProps {
  lang: 'en' | 'ko';
  isDarkMode: boolean;
  maxAlerts?: number;
}

interface Alert {
  id: string;
  type: 'milestone' | 'resource' | 'budget' | 'progress';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}

export const PPMSAlerts: React.FC<PPMSAlertsProps> = ({
  lang,
  isDarkMode,
  maxAlerts = 3
}) => {
  const navigate = useNavigate();
  const t = translations[lang];

  const programs = usePPMSStore((state) => state.programs);
  const projects = usePPMSStore((state) => state.projects);
  const resources = usePPMSStore((state) => state.resources);
  const milestones = usePPMSStore((state) => state.milestones);

  const alerts = useMemo((): Alert[] => {
    const alertList: Alert[] = [];
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Check upcoming milestones
    const upcomingMilestones = milestones.filter(m => {
      const milestoneDate = new Date(m.dueDate);
      return milestoneDate >= today && milestoneDate <= nextWeek;
    });

    upcomingMilestones.slice(0, 2).forEach(m => {
      const daysUntil = Math.ceil((new Date(m.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const project = projects.find(p => p.id === m.projectId);

      alertList.push({
        id: `milestone-${m.id}`,
        type: 'milestone',
        severity: daysUntil <= 3 ? 'critical' : 'warning',
        title: lang === 'ko' ? '다가오는 마일스톤' : 'Upcoming Milestone',
        description: lang === 'ko'
          ? `"${m.name}" - ${daysUntil}일 남음 (${project?.name || '프로젝트'})`
          : `"${m.name}" - ${daysUntil} days remaining (${project?.name || 'Project'})`,
        actionLabel: lang === 'ko' ? '일정 보기' : 'View Schedule',
        actionUrl: '/ppms/schedule'
      });
    });

    // Check resource over-allocation
    resources.forEach(r => {
      const allocations = usePPMSStore.getState().getAllocationsByResource(r.id);
      const totalAllocated = allocations.reduce((sum, a) => sum + a.allocationPercent, 0);

      if (totalAllocated > 100) {
        alertList.push({
          id: `resource-${r.id}`,
          type: 'resource',
          severity: 'critical',
          title: lang === 'ko' ? '리소스 과할당' : 'Over-allocated Resource',
          description: lang === 'ko'
            ? `${r.name}: ${totalAllocated}% 할당됨 (초과 ${totalAllocated - 100}%)`
            : `${r.name}: ${totalAllocated}% allocated (${totalAllocated - 100}% over)`,
          actionLabel: lang === 'ko' ? '리소스 보기' : 'View Resources',
          actionUrl: '/ppms/resources'
        });
      } else if (totalAllocated > 80) {
        alertList.push({
          id: `resource-${r.id}`,
          type: 'resource',
          severity: 'warning',
          title: lang === 'ko' ? '리소스 할당 주의' : 'Resource Allocation Warning',
          description: lang === 'ko'
            ? `${r.name}: ${totalAllocated}% 할당됨 (여유 ${100 - totalAllocated}% 남음)`
            : `${r.name}: ${totalAllocated}% allocated (${100 - totalAllocated}% remaining)`,
          actionLabel: lang === 'ko' ? '리소스 보기' : 'View Resources',
          actionUrl: '/ppms/resources'
        });
      }
    });

    // Check budget overruns
    programs.forEach(p => {
      const budgetUsed = (p.spent / p.budget) * 100;

      if (budgetUsed > 100) {
        alertList.push({
          id: `budget-${p.id}`,
          type: 'budget',
          severity: 'critical',
          title: lang === 'ko' ? '예산 초과' : 'Budget Exceeded',
          description: lang === 'ko'
            ? `${p.name}: ${budgetUsed.toFixed(1)}% 사용 (초과 ${budgetUsed - 100}%)`
            : `${p.name}: ${budgetUsed.toFixed(1)}% used (${budgetUsed - 100}% over)`,
          actionLabel: lang === 'ko' ? '상세 보기' : 'View Details',
          actionUrl: '/ppms'
        });
      } else if (budgetUsed > 90) {
        alertList.push({
          id: `budget-${p.id}`,
          type: 'budget',
          severity: 'warning',
          title: lang === 'ko' ? '예산 주의' : 'Budget Warning',
          description: lang === 'ko'
            ? `${p.name}: ${budgetUsed.toFixed(1)}% 사용 (${(100 - budgetUsed).toFixed(1)}% 남음)`
            : `${p.name}: ${budgetUsed.toFixed(1)}% used (${(100 - budgetUsed).toFixed(1)}% remaining)`,
          actionLabel: lang === 'ko' ? '상세 보기' : 'View Details',
          actionUrl: '/ppms'
        });
      }
    });

    // Check programs with low progress
    programs.forEach(p => {
      if (p.status === 'active' && p.progress < 30) {
        const startDate = new Date(p.startDate);
        const daysSinceStart = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalDuration = new Date(p.endDate).getTime() - startDate.getTime();
        const expectedProgress = (daysSinceStart / (totalDuration / (1000 * 60 * 60 * 24))) * 100;

        if (p.progress < expectedProgress - 20) {
          alertList.push({
            id: `progress-${p.id}`,
            type: 'progress',
            severity: 'info',
            title: lang === 'ko' ? '진행률 저조' : 'Low Progress Alert',
            description: lang === 'ko'
              ? `${p.name}: ${p.progress.toFixed(0)}% 완료 (예상 ${expectedProgress.toFixed(0)}%)`
              : `${p.name}: ${p.progress.toFixed(0)}% complete (expected ${expectedProgress.toFixed(0)}%)`,
            actionLabel: lang === 'ko' ? '상세 보기' : 'View Details',
            actionUrl: '/ppms'
          });
        }
      }
    });

    // Sort by severity and limit
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return alertList
      .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
      .slice(0, maxAlerts);
  }, [programs, projects, resources, milestones, lang, maxAlerts]);

  if (alerts.length === 0) {
    return null;
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Calendar className="w-4 h-4" />;
      case 'resource':
        return <Users className="w-4 h-4" />;
      case 'budget':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
          {lang === 'ko' ? '알림' : 'Alerts'}
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">{alerts.length}</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${getSeverityStyles(alert.severity)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <div className="mt-0.5">{getSeverityIcon(alert.type)}</div>
                <div className="flex-1">
                  <p className="text-xs font-bold mb-1">{alert.title}</p>
                  <p className="text-xs opacity-90">{alert.description}</p>
                </div>
              </div>
              {alert.actionLabel && (
                <button
                  onClick={() => alert.actionUrl && navigate(alert.actionUrl)}
                  className="text-xs font-medium underline opacity-90 hover:opacity-100"
                >
                  {alert.actionLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
