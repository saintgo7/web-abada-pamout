
import React from 'react';
import { translations } from '../translations';
import Logo from './Logo';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  lang: 'en' | 'ko';
  toggleLang: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, lang, toggleLang }) => {
  const t = translations[lang];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 px-6 py-3 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col">
          <Logo isDarkMode={isDarkMode} className="h-9" />
        </div>
        
        <div className="hidden lg:block h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
        
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <a href="#/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">{t.workspace}</a>
          <a href="#/solutions" className="hover:text-indigo-600 dark:hover:text-white transition-colors">{t.solutions}</a>
          <a href="#/analytics" className="hover:text-indigo-600 dark:hover:text-white transition-colors">{t.analytics}</a>
          <a href="#/about" className="hover:text-indigo-600 dark:hover:text-white transition-colors">{t.company}</a>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-full p-1 border border-slate-200 dark:border-slate-700/50">
          <button 
            onClick={toggleLang}
            className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${
              lang === 'ko' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            KO
          </button>
          <button 
            onClick={toggleLang}
            className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${
              lang === 'en' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            EN
          </button>
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        <button className="hidden sm:block px-6 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          {t.signIn}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
