import { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext(null);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    appName: 'Homeland Union',
    appVersion: '0.1.0',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'USD',
    currencySymbol: '$',
  });

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }
  }, []);

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('appConfig', JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    const defaultConfig = {
      appName: 'Homeland Union',
      appVersion: '0.1.0',
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      theme: 'light',
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm',
      currency: 'USD',
      currencySymbol: '$',
    };
    setConfig(defaultConfig);
    localStorage.setItem('appConfig', JSON.stringify(defaultConfig));
  };

  const value = {
    config,
    updateConfig,
    resetConfig,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
