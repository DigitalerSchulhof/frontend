import { BaseService } from './base';

export interface IdentityTheft {
  personId: string;
}

export interface IdentityTheftService extends BaseService<IdentityTheft> {}
