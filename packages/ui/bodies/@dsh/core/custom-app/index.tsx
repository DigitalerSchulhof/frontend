import { createGlobalStyle, ThemeProvider } from 'styled-components';
import React from 'react';
import { Roboto } from '@next/font/google';
import type { CustomApp } from '@dsh/core/shells/custom-app';

const roboto = Roboto({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const UiApp: CustomApp = ({ children }) => {
  return (
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
      {children}
    </ThemeProvider>
  );
};

export default UiApp;

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
