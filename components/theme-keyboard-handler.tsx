'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef } from 'react';

export function ThemeKeyboardHandler() {
  const { theme, setTheme } = useTheme();
  const isAnimating = useRef(false);
  const prevThemeRef = useRef<string>('dark');

  const toggleTheme = useCallback((newTheme: string) => {
    if (isAnimating.current) return;

    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };

    if (doc.startViewTransition) {
      isAnimating.current = true;
      doc.startViewTransition(() => {
        setTheme(newTheme);
      });
      // Reset after animation completes
      setTimeout(() => { isAnimating.current = false; }, 600);
    } else {
      setTheme(newTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (e.key === 'm' || e.key === 'M') {
        toggleTheme(theme === 'dark' ? 'light' : 'dark');
      }

      if (e.key === 's' || e.key === 'S') {
        if (theme === 'sunny') {
          toggleTheme(prevThemeRef.current);
        } else {
          prevThemeRef.current = theme || 'dark';
          toggleTheme('sunny');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, toggleTheme]);

  return null;
}
