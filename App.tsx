
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ToolCard from './components/ToolCard';
import ChatWindow from './components/ChatWindow';
import { PPMSQuickOverview } from './components/ppms/PPMSQuickOverview';
import { TOOLS, MOCK_CHART_DATA } from './constants';
import { translations } from './translations';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState(TOOLS[0].id);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'ko'>('ko');

  const t = translations[lang];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const activeToolLabel = t.tools[activeToolId as keyof typeof translations.en.tools].name;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        lang={lang}
        toggleLang={() => setLang(l => l === 'en' ? 'ko' : 'en')}
      />
      
      <main className="flex-1 container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: Tools & Stats */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.workspace}</h2>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">4 {t.enginesActive}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {TOOLS.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  active={activeToolId === tool.id}
                  onClick={setActiveToolId}
                  lang={lang}
                />
              ))}
            </div>
          </section>

          {/* PPMS Quick Overview */}
          <PPMSQuickOverview lang={lang} isDarkMode={isDarkMode} />

          <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              {t.metrics}
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, 
                      borderRadius: '8px',
                      color: isDarkMode ? '#fff' : '#000'
                    }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="efficiency" stroke="#6366f1" fillOpacity={1} fill="url(#colorEff)" strokeWidth={2} />
                  <Area type="monotone" dataKey="accuracy" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{t.efficiency}</p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">+88.4%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{t.latency}</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">12ms</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Content: Chat Workspace */}
        <div className="flex-1 flex flex-col min-h-[600px]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.console}</h2>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">{activeToolLabel}</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
              <button className="px-3 py-1 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md shadow-sm border border-slate-200 dark:border-slate-700">{t.active}</button>
              <button className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">{t.history}</button>
            </div>
          </div>
          <ChatWindow activeToolId={activeToolId} lang={lang} />
        </div>
      </main>

      <div className={`fixed top-0 right-0 -z-10 w-1/2 h-1/2 blur-[120px] rounded-full pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'bg-indigo-600/5 opacity-100' : 'bg-indigo-600/5 opacity-40'}`}></div>
      <div className={`fixed bottom-0 left-0 -z-10 w-1/2 h-1/2 blur-[120px] rounded-full pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'bg-purple-600/5 opacity-100' : 'bg-purple-600/5 opacity-40'}`}></div>
    </div>
  );
};

export default App;
