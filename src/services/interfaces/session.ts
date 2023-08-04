import type { BaseService } from './base';

export interface Session {
  personId: string;
  issuedAt: Date;
  didShowLastLogin: boolean;
}

export interface SessionService extends BaseService<Session> {}
