import type { CustomApp } from '@dsh/core/shells/custom-app';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyles } from '~/theme';

const UiApp: CustomApp = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

export default UiApp;
