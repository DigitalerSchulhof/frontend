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
