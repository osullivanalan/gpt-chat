import React from 'react';
import {SettingProps} from '../types'

export type SettingsContextProps = {
  openSettings: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settings: SettingProps
};

export const SettingsContext = React.createContext<SettingsContextProps | undefined>(undefined);
