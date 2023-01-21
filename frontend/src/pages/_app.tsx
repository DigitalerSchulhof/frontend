import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { Client as UrqlClient, Context as UrqlContext } from 'urql';
import * as settings from '../../../settings.json';
import { AuthContextProvider } from '../schulhof/auth';
import { AppSettingsContext } from '../settings';
import { MainContainer } from '../ui/MainContainer';
import { GlobalStyles, theme } from '../ui/theme';

interface CustomAppProps {
  settings: any;
}

export default function App({
  Component,
  pageProps,
  settings,
}: AppProps & CustomAppProps) {
  const urqlClient = new UrqlClient({
    url: process.env.NEXT_PUBLIC_BACKEND_URL!,
  });

  return (
    <AppSettingsContext.Provider value={settings}>
      <UrqlContext.Provider value={urqlClient}>
        <AuthContextProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            {/* TODO */}
            <div style={{ height: 82 }} />
            <MainContainer>
              <Component {...pageProps} />
            </MainContainer>
          </ThemeProvider>
        </AuthContextProvider>
      </UrqlContext.Provider>
    </AppSettingsContext.Provider>
  );
}

App.getInitialProps = (): CustomAppProps => {
  return {
    settings,
  };
};
