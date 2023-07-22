import type { BaseService } from './base';

export interface Session {
  personId: string;
  issuedAt: number;
  didShowLastLogin: boolean;
}

export interface SessionService extends BaseService<Session> {}
