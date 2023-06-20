import { BaseService } from './base';

export interface Person {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  accountId: string | null;
}

export const PERSON_TYPES = [
  'student',
  'teacher',
  'parent',
  'admin',
  'other',
] as const;
export type PersonType = (typeof PERSON_TYPES)[number];

export const PERSON_GENDER = ['male', 'female', 'other'] as const;
export type PersonGender = (typeof PERSON_GENDER)[number];

export interface PersonService extends BaseService<Person> {}
