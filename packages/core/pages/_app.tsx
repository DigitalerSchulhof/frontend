import type { AppContext, AppProps } from 'next/app';
import * as React from 'react';
import { AppSettingsContext } from '../AppSettingsContext';
import settings from '../settings.json';

interface CustomAppProps {
  settings: any;
}

export default function App({
  Component,
  pageProps,
  settings,
}: AppProps & CustomAppProps) {
  return (
    <AppSettingsContext.Provider value={settings}>
      <Component {...pageProps} />
    </AppSettingsContext.Provider>
  );
}

App.getInitialProps = function (appContext: AppContext): CustomAppProps {
  return {
    settings,
  };
};
