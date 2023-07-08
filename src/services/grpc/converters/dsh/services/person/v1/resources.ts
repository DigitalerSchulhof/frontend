import { WithId } from '#/services/interfaces/base';
import * as js from '#/services/interfaces/person';
import * as grpc from '@dsh/protocols/dsh/services/person/v1/resources';
import {
  timestampFromJs,
  timestampToJs,
} from '../../../../google/protobuf/timestamp';

export function personToJs(person: grpc.Person): WithId<js.Person> {
  return {
    id: person.id,
    rev: person.rev,
    updatedAt: timestampToJs(person.updated_at),
    createdAt: timestampToJs(person.created_at),
    firstname: person.firstname,
    lastname: person.lastname,
    type: personTypeToJs(person.type),
    gender: personGenderToJs(person.gender),
    teacherCode: person.has_teacher_code ? person.teacher_code : null,
    accountId: person.has_account_id ? person.account_id : null,
  };
}

function personTypeToJs(personType: grpc.PersonType): js.PersonType {
  switch (personType) {
    case grpc.PersonType.PERSON_TYPE_UNSPECIFIED:
      throw new Error('PERSON_TYPE_UNSPECIFIED is not supported.');
    case grpc.PersonType.PERSON_TYPE_STUDENT:
      return 'student';
    case grpc.PersonType.PERSON_TYPE_TEACHER:
      return 'teacher';
    case grpc.PersonType.PERSON_TYPE_PARENT:
      return 'parent';
    case grpc.PersonType.PERSON_TYPE_ADMIN:
      return 'admin';
    case grpc.PersonType.PERSON_TYPE_OTHER:
      return 'other';
  }
}

function personGenderToJs(
  personGender: grpc.PersonGender
): js.PersonGender {
  switch (personGender) {
    case grpc.PersonGender.PERSON_GENDER_UNSPECIFIED:
      throw new Error('PERSON_GENDER_UNSPECIFIED is not supported.');
    case grpc.PersonGender.PERSON_GENDER_MALE:
      return 'male';
    case grpc.PersonGender.PERSON_GENDER_FEMALE:
      return 'female';
    case grpc.PersonGender.PERSON_GENDER_OTHER:
      return 'other';
  }
}

export function personFromJs(
  person: Partial<WithId<js.Person>> | undefined
): grpc.Person | undefined {
  if (!person) return undefined;

  return new grpc.Person({
    id: person.id,
    rev: person.rev,
    updated_at: timestampFromJs(person.updatedAt),
    created_at: timestampFromJs(person.createdAt),
    firstname: person.firstname,
    lastname: person.lastname,
    type: personTypeFromJs(person.type),
    gender: personGenderFromJs(person.gender),
    teacher_code: person.teacherCode === null ? undefined : person.teacherCode,
    account_id: person.accountId === null ? undefined : person.accountId,
  });
}

function personTypeFromJs(
  personType: js.PersonType | undefined
): grpc.PersonType | undefined {
  if (!personType) return undefined;

  switch (personType) {
    case 'student':
      return grpc.PersonType.PERSON_TYPE_STUDENT;
    case 'teacher':
      return grpc.PersonType.PERSON_TYPE_TEACHER;
    case 'parent':
      return grpc.PersonType.PERSON_TYPE_PARENT;
    case 'admin':
      return grpc.PersonType.PERSON_TYPE_ADMIN;
    case 'other':
      return grpc.PersonType.PERSON_TYPE_OTHER;
  }
}

function personGenderFromJs(
  personGender: js.PersonGender | undefined
): grpc.PersonGender | undefined {
  if (!personGender) return undefined;

  switch (personGender) {
    case 'male':
      return grpc.PersonGender.PERSON_GENDER_MALE;
    case 'female':
      return grpc.PersonGender.PERSON_GENDER_FEMALE;
    case 'other':
      return grpc.PersonGender.PERSON_GENDER_OTHER;
  }
}
