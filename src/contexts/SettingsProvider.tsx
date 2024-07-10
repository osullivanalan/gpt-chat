import React, { useEffect, useState } from 'react';
import { SettingsContext } from './SettingsContext';
import IndexedDBHelper from '../IndexedDBHelper';
import { SettingProps } from '../types';
export const SettingsProvider = ({ children }) => {
  
  const [openSettings, setSettingsOpen] = useState(false);
  
  const [settings, setSettings] = useState<SettingProps | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const fetchedSettings = await IndexedDBHelper.getSettings();
      setSettings(fetchedSettings);
      console.log(fetchedSettings)
    };

    fetchSettings();
  }, []);
  
  return (
    <SettingsContext.Provider value={{ openSettings, setSettingsOpen, settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};