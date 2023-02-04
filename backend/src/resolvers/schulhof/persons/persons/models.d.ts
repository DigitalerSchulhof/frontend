import { Collection } from '../../../models';

/**
 * @collection persons
 */
export interface Person extends Collection {
  firstname: string;
  lastname: string;
  birthdate: number;
  gender: 'male' | 'female' | 'other';
  type: 'student' | 'teacher' | 'parent' | 'administrator' | 'other';
}

export type PersonAccess = Person;
export type PersonFieldsAccess = Person;
export type PersonActionsAccess = Person;
