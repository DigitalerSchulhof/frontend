import { ArangoRepository } from '../../arango';

export const PERSON_TYPES = [
  'student',
  'teacher',
  'parent',
  'admin',
  'other',
] as const;
export type PersonType = (typeof PERSON_TYPES)[number];

export const PERSON_GENDERS = ['male', 'female', 'other'] as const;
export type PersonGender = (typeof PERSON_GENDERS)[number];

export type PersonBase = {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  accountId: string | null;
};

export class PersonRepository extends ArangoRepository<'persons', PersonBase> {
  protected readonly collectionName = 'persons';
}
