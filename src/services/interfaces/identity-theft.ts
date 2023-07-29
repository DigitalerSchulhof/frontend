import type { BaseService } from './base';

export interface IdentityTheft {
  personId: string;
}

export interface IdentityTheftService extends BaseService<IdentityTheft> {
  report(personId: string): Promise<void>;
}
