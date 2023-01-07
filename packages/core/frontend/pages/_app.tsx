import type { AppProps } from 'next/app';
import { Client as UrqlClient, Context as UrqlContext } from 'urql';
import { getCustomApps } from '../../shells/custom-app';
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
  const customApps = getCustomApps();

  const urqlClient = new UrqlClient({
    url: process.env.NEXT_PUBLIC_BACKEND_URL!,
  });

  return (
    <AppSettingsContext.Provider value={settings}>
      <UrqlContext.Provider value={urqlClient}>
        {customApps.reduce(
          (acc, App) => (
            <App>{acc}</App>
          ),
          <Component {...pageProps} />
        )}
      </UrqlContext.Provider>
    </AppSettingsContext.Provider>
  );
}

App.getInitialProps = (): CustomAppProps => {
  return {
    settings,
  };
};
