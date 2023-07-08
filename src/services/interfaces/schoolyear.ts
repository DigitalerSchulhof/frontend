import { BaseService } from './base';

export interface Schoolyear {
  name: string;
  start: number;
  end: number;
}

export interface SchoolyearService extends BaseService<Schoolyear> {}
