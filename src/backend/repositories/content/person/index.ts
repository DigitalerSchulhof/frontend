import { ArangoRepository } from '../../arango';

export type PersonType = 'student' | 'teacher' | 'parent' | 'admin' | 'other';

export type PersonGender = 'male' | 'female' | 'other';

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
