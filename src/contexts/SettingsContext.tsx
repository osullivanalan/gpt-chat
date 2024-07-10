import { createContext } from 'react';
import { SettingsContextProps } from '../types';

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

