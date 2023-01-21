import { createContext, useContext } from 'react';
import * as settings from '../../../settings.json';

export const useAppSettings = () => useContext(AppSettingsContext);

export const AppSettingsContext = createContext<typeof settings>(
  null as any as typeof settings
);
