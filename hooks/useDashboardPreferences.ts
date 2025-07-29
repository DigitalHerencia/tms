'use client';

import { useState, useEffect } from 'react';
import type { DashboardPreferences } from '@/types/dashboard';

const DEFAULT_PREFERENCES: DashboardPreferences = {
  showKPIs: true,
  showQuickActions: true,
  showRecentActivity: true,
  showAlerts: true,
  theme: 'system',
  refreshInterval: 5, // 5 minutes
};

export function useDashboardPreferences() {
  const [preferences, setPreferences] = useState<DashboardPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Load preferences from localStorage on mount
    const stored = localStorage.getItem('dashboard-preferences');
    if (stored) {
      try {
        const parsedPreferences = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPreferences });
      } catch (error) {
        console.warn('Invalid stored preferences, using defaults');
      }
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<DashboardPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('dashboard-preferences', JSON.stringify(updated));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem('dashboard-preferences');
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  };
}
