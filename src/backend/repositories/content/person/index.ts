import { ArangoRepository } from '../../arango';

export enum FormOfAddress {
  Formal = 'formal',
  Informal = 'informal',
}

export enum PersonType {
  Student = 'student',
  Teacher = 'teacher',
  Parent = 'parent',
  Admin = 'admin',
  Other = 'other',
}

export enum PersonGender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type PersonBase = {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  formOfAddress: FormOfAddress;
  accountId: string | null;
};

export class PersonRepository extends ArangoRepository<'persons', PersonBase> {
  protected readonly collectionName = 'persons';
}