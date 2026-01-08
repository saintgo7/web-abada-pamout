
import React from 'react';
import { translations } from '../translations';

interface ToolCardProps {
  tool: any;
  onClick: (id: string) => void;
  active: boolean;
  lang: 'en' | 'ko';
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, active, lang }) => {
  const t = translations[lang].tools[tool.id as keyof typeof translations.en.tools];
  
  return (
    <div 
      onClick={() => onClick(tool.id)}
      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 group border
        ${active 
          ? 'bg-indigo-50 dark:bg-indigo-600/10 border-indigo-500 shadow-lg dark:shadow-[0_0_20px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500' 
          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none'
        }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
          active ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>
          {tool.icon}
        </div>
        <div className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
          tool.category === 'generation' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
          tool.category === 'analysis' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 
          'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
        }`}>
          {tool.category}
        </div>
      </div>
      <h3 className={`text-lg font-bold mb-2 ${active ? 'text-indigo-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
        {t.name}
      </h3>
      <p className={`text-sm line-clamp-2 leading-relaxed ${active ? 'text-indigo-700 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {t.desc}
      </p>
    </div>
  );
};

export default ToolCard;
