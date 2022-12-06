import type { AppContext, AppProps } from 'next/app';
import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { AppSettingsContext } from '../AppSettingsContext';
import settings from '../settings.json';
import { Roboto } from '@next/font/google';

interface CustomAppProps {
  settings: any;
}

const roboto = Roboto({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export default function App({
  Component,
  pageProps,
  settings,
}: AppProps & CustomAppProps) {
  return (
    <>
      <AppSettingsContext.Provider value={settings}>
        <ThemeProvider
          theme={{
            backgroundColor: '#181818',
            fontSizes: {
              regular: '13px',
              small: '80%',
            },
            colors: {
              text: '#fcf8e3',
              textLink: '#3299cc',
              textMuted: '#ffffffb0',
            },
          }}
        >
          <GlobalStyles fontFamily={roboto.style.fontFamily} />
          <Component {...pageProps} />
        </ThemeProvider>
      </AppSettingsContext.Provider>
    </>
  );
}

App.getInitialProps = (): CustomAppProps => {
  return {
    settings,
  };
};

const GlobalStyles = createGlobalStyle<{ fontFamily: string }>`
  html,
  body {
    padding: 0;
    margin: 0;
  }

  body {
    font-family: ${({ fontFamily }) => fontFamily};
    font-size: ${({ theme }) => theme.fontSizes.regular};
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    text-decoration: none;
  }

  p {
    margin-top: 0;
    margin-bottom: 7px;
  }
`;
