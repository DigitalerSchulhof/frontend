import { Collection } from '../../../models';

/**
 * @collection persons
 */
export interface Person extends Collection {
  firstname: string;
  lastname: string;
  birthdate: number;
  gender: 'm' | 'f' | 'o';
  type: 'student' | 'teacher' | 'parent' | 'administrator' | 'other';
}
