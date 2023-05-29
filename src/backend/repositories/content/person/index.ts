import { ArangoRepository } from '../../arango';

export const PERSON_TYPES = new Set([
  'student',
  'teacher',
  'parent',
  'admin',
  'other',
] as const);
export type PersonType = typeof PERSON_TYPES extends Set<infer T> ? T : never;

export const PERSON_GENDERS = new Set(['male', 'female', 'other'] as const);
export type PersonGender = typeof PERSON_GENDERS extends Set<infer T>
  ? T
  : never;

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
