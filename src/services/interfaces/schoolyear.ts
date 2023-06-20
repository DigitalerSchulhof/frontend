import { BaseService } from './base';

export interface Schoolyear {
  name: string;
  start: Date;
  end: Date;
}

export interface SchoolyearService extends BaseService<Schoolyear> {}
