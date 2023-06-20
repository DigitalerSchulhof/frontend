import { BaseService } from './base';

export interface Class {
  levelId: string;
  name: string;
}

export interface ClassService extends BaseService<Class> {}
