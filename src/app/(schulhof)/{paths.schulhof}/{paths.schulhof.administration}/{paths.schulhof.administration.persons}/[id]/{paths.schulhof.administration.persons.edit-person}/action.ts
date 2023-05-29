'use server';

import { requireLogin } from '#/auth/action';
import {
  PersonType,
  PersonGender,
  PERSON_TYPES,
  PERSON_GENDERS,
} from '#/backend/repositories/content/person';
import { InvalidInputError, wrapAction } from '#/utils/action';
import { v, validate } from 'vality';

const personSchema = {
  type: PERSON_TYPES,
  firstname: v.string,
  lastname: v.string,
  gender: PERSON_GENDERS,
  teacherCode: v.optional(v.string),
};

export const editPerson = wrapAction<
  [
    personId: string,
    ifRev: string,
    data: {
      type: PersonType;
      firstname: string;
      lastname: string;
      gender: PersonGender;
      teacherCode: string | null;
    }
  ]
>(async (personId, ifRev, data) => {
  if (typeof personId !== 'string' || typeof ifRev !== 'string') {
    throw new InvalidInputError();
  }

  const validatedData = validate(personSchema, data);

  if (!validatedData.valid) {
    throw new InvalidInputError();
  }

  const context = await requireLogin();

  const person = await context.services.person.getById(personId);

  if (!person) {
    throw new InvalidInputError();
  }

  await context.services.person.update(personId, validatedData.data, {
    ifRev,
  });
});
