import type { CustomApp } from '@dsh/core/shells/custom-app';
import { Roboto } from '@next/font/google';
import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from "~/theme";

const roboto = Roboto({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const UiApp: CustomApp = ({ children }) => {
  return (
    <ThemeProvider
      theme={theme}
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
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.colors.text};
  }

  body, button, input, optgroup, select, textarea {
    font-family: ${({ fontFamily }) => fontFamily};
    font-size: ${({ theme }) => theme.fontSizes.regular};
  }

  a {
    text-decoration: none;
  }

  p {
    margin-top: 0;
    margin-bottom: 7px;
  }
`;
