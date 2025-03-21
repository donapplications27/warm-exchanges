
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Get theme from localStorage or default to system
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return settings.theme || 'dark';
      }
    } catch (error) {
      console.error("Failed to load theme from settings:", error);
    }
    return 'dark';
  });

  useEffect(() => {
    const applyTheme = (selectedTheme: ThemeMode) => {
      const root = window.document.documentElement;
      
      // Remove both classes first
      root.classList.remove('light', 'dark');
      
      // Apply the right class based on theme
      if (selectedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(selectedTheme);
      }
    };

    applyTheme(theme);

    // Listen for system theme changes if using system preference
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Update localStorage when theme changes
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        settings.theme = theme;
        localStorage.setItem('app-settings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error("Failed to save theme to settings:", error);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
