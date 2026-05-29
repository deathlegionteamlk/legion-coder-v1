import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../shared/types';

const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  selectedModel: 'google/gemma-3-27b-it',
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  credits: {
    used: 0,
    limit: 10,
    lastUpdated: Date.now(),
  },
};

const STORAGE_KEY = 'legion-coder-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded,
  };
};
