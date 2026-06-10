import React from 'react';
import { DisplaySettings } from '../types';

interface ThemeContextType {
  settings: DisplaySettings;
  updateSettings: (newSettings: Partial<DisplaySettings>) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = React.useState<DisplaySettings>({
    theme: 'light',
    fontSize: 24,
    showTranslation: true,
    showTransliteration: true,
    language: 'id',
  });

  const updateSettings = (newSettings: Partial<DisplaySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, toggleTheme }}>
      <div className={settings.theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-full transition-colors duration-300">
           {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
