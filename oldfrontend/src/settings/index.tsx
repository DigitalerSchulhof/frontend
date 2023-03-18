import { createContext, useContext } from 'react';
import settings from '../../../settings.json';

export const useSettings = () => useContext(SettingsContext);

export const SettingsContext = createContext<typeof settings>(
  null as any as typeof settings
);
