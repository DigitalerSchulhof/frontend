import React from 'react';
import { getShell } from '../../shell';

export type CustomApp = React.FC<{ children: React.ReactNode }>;

export const getCustomApps = () => getShell<CustomApp>('custom-app');
