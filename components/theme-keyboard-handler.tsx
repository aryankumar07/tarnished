'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeKeyboardHandler() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (e.key === 'm' || e.key === 'M') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }

      if (e.key === 's' || e.key === 'S') {
        setTheme('sunny');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, setTheme]);

  return null;
}
