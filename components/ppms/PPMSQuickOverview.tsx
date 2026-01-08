import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePPMSStore } from '../../stores/ppmsStore';
import { translations } from '../../translations';
import { Activity, TrendingUp, Users, DollarSign } from 'lucide-react';

interface PPMSQuickOverviewProps {
  lang: 'en' | 'ko';
  isDarkMode: boolean;
}

export const PPMSQuickOverview: React.FC<PPMSQuickOverviewProps> = ({ lang, isDarkMode }) => {
  const navigate = useNavigate();
  const t = translations[lang];

  const programs = usePPMSStore((state) => state.programs);
  const projects = usePPMSStore((state) => state.projects);
  const resources = usePPMSStore((state) => state.resources);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalPrograms = programs.length;
    const activeProjects = projects.filter(
      (p) => p.status === 'in-progress' || p.status === 'not-started'
    ).length;

    // Calculate resource utilization
    let totalAllocated = 0;
    resources.forEach((r) => {
      const allocations = usePPMSStore.getState().getAllocationsByResource(r.id);
      const allocated = allocations.reduce((sum, a) => sum + a.allocationPercent, 0);
      totalAllocated += allocated;
    });
    const totalCapacity = resources.reduce((sum, r) => sum + r.capacity, 0);
    const utilization = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;

    // Calculate budget consumed
    const totalBudget = programs.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = programs.reduce((sum, p) => sum + p.spent, 0);
    const budgetConsumed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    return {
      totalPrograms,
      activeProjects,
      utilization,
      budgetConsumed,
    };
  }, [programs, projects, resources]);

  const hasPrograms = programs.length > 0;

  return (
    <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
          <Activity className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
          {t.ppms.quickOverview.title}
        </h3>
        {hasPrograms && (
          <button
            onClick={() => navigate('/ppms')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            {t.viewDashboard} →
          </button>
        )}
      </div>

      {!hasPrograms ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Activity className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{t.noPrograms}</p>
          <button
            onClick={() => navigate('/ppms')}
            className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {t.createFirst}
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {t.ppms.quickOverview.subtitle}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Total Programs */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.ppms.quickOverview.totalPrograms}
                </span>
                <Activity className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {metrics.totalPrograms}
              </p>
            </div>

            {/* Active Projects */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.ppms.quickOverview.activeProjects}
                </span>
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {metrics.activeProjects}
              </p>
            </div>

            {/* Resource Utilization */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.ppms.quickOverview.resourceUtil}
                </span>
                <Users className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {metrics.utilization}%
              </p>
            </div>

            {/* Budget Consumed */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.ppms.quickOverview.budgetConsumed}
                </span>
                <DollarSign className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {metrics.budgetConsumed}%
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/ppms')}
            className="w-full px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {t.ppms.quickOverview.allPrograms}
          </button>
        </>
      )}
    </section>
  );
};
