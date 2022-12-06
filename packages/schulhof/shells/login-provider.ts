import { getShell } from '@dsh/core';

export const getLoginProviders = () => getShell('login-provider');
