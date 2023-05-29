'use server';

import { requireLogin } from '#/auth/action';
import {
  PersonType,
  PersonGender,
  PERSON_TYPES,
  PERSON_GENDERS,
} from '#/backend/repositories/content/person';
import { InvalidInputError, wrapAction } from '#/utils/action';

export const editPerson = wrapAction<
  [
    personId: string,
    ifRev: string,
    type: PersonType,
    firstname: string,
    lastname: string,
    gender: PersonGender,
    teacherCode: string | null
  ]
>(async (personId, ifRev, type, firstname, lastname, gender, teacherCode) => {
  if (
    typeof personId !== 'string' ||
    typeof ifRev !== 'string' ||
    !isPersonType(type) ||
    typeof firstname !== 'string' ||
    typeof lastname !== 'string' ||
    !isPersonGender(gender) ||
    (teacherCode !== null && typeof teacherCode !== 'string')
  ) {
    throw new InvalidInputError();
  }

  const context = await requireLogin();

  const person = await context.services.person.getById(personId);

  if (!person) {
    throw new InvalidInputError();
  }

  await context.services.person.update(
    personId,
    {
      type,
      firstname,
      lastname,
      gender,
      teacherCode,
    },
    {
      ifRev,
    }
  );
});

function isPersonType(type: unknown): type is PersonType {
  return typeof type === 'string' && PERSON_TYPES.has(type);
}

function isPersonGender(gender: unknown): gender is PersonGender {
  return typeof gender === 'string' && PERSON_GENDERS.has(gender);
}
