import { createContext, useContext } from 'react';

export const AppSettingsContext = createContext<any>({});

export const useAppSettings = () => useContext(AppSettingsContext);
