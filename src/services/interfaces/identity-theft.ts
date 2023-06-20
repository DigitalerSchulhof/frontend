import { BaseService } from './base';

export interface IdentityTheft {
  personId: string;
  name: string;
}

export interface IdentityTheftService extends BaseService<IdentityTheft> {}
