import type { CustomApp } from '@dsh/core/shells/custom-app';
import React from 'react';
import { AuthContextProvider } from '../../../../auth';

const AuthApp: CustomApp = ({ children }) => {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
};

export default AuthApp;
