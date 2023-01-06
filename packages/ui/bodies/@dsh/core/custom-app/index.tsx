import type { CustomApp } from '@dsh/core/shells/custom-app';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyles } from '../../../../theme';
import { MainContainer } from '../../../../MainContainer';

const UiApp: CustomApp = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {/* TODO */}
      <div style={{ height: 82 }} />
      <MainContainer>{children}</MainContainer>
    </ThemeProvider>
  );
};

export default UiApp;
