import type { HasId } from '#/services/interfaces/base';

export interface Session extends HasId {
  personId: string;
  issuedAt: Date;
  didShowLastLogin: boolean;
}

export interface SessionService {
  /**
   * Marks that the user has seen the last login date for
   * the session with the given ID.
   */
  setDidShowLastLogin(id: string): Promise<void>;
}
