import { BaseService } from './base';

export interface Level {
  schoolyearId: string;
  name: string;
}

export interface LevelService extends BaseService<Level> {}
