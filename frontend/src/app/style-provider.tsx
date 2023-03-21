'use client';

import { GlobalStyles } from '#/ui/global';
import { themes } from '#/ui/themes';
import { ThemeProvider } from 'styled-components';

export const StyleProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={themes.dark}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};
