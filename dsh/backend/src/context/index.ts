import { Config } from '../config';
import { createDbContext } from './db';

export interface CreateContextContext {
  config: Config;
}

export interface BackendContext {
}

export function createContext(context: CreateContextContext): BackendContext {
  return {
    ...createDbContext(context),
  };
}
