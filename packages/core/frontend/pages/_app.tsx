import type { AppProps } from 'next/app';
import React from 'react';
import { AppSettingsContext } from '../AppSettingsContext';
import settings from '../settings.json';
import { getCustomApps } from '../../shells/custom-app';

interface CustomAppProps {
  settings: any;
}

export default function App({
  Component,
  pageProps,
  settings,
}: AppProps & CustomAppProps) {
  const customApps = getCustomApps();

  return (
    <AppSettingsContext.Provider value={settings}>
      {customApps.reduce(
        (acc, App) => (
          <App>{acc}</App>
        ),
        <Component {...pageProps} />
      )}
    </AppSettingsContext.Provider>
  );
}

App.getInitialProps = (): CustomAppProps => {
  return {
    settings,
  };
};
