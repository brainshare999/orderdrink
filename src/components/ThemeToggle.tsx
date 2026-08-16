import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sip_tea_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('sip_tea_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sip_tea_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="p-2.5 rounded-xl text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all border border-stone-200 dark:border-stone-700 shadow-xs flex items-center justify-center"
      title={isDarkMode ? "切換至淺色模式" : "切換至深色模式"}
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
      ) : (
        <Moon className="w-4 h-4 text-stone-700" />
      )}
    </button>
  );
};
