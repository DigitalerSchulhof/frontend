'use client';

import { createContext, useContext } from 'react';

export interface AppSettings {
  locale: string;
  school: {
    name: {
      genus: 'm' | 'w' | 'n';
      nominative: string;
      genitive: string;
      accusative: string;
      dative: string;
    };
  };
}

// @ts-expect-error -- ´This context requires a provider provider and if none is used, we want a 'cannot read property of null' error
export const settingsContext = createContext<AppSettings>(null);

export const SettingsProvider = ({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: AppSettings;
}) => {
  return (
    <settingsContext.Provider value={settings}>
      {children}
    </settingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(settingsContext);
};
