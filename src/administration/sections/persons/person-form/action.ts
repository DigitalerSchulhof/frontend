'use server';

import { requireLogin } from '#/auth/action';
import {
  PERSON_GENDERS,
  PERSON_TYPES,
} from '#/backend/repositories/content/person';
import { LoggedInBackendContext } from '#/context';
import { InvalidInputError, wrapAction } from '#/utils/action';
import { Parse, v, validate } from 'vality';

const personSchema = {
  type: PERSON_TYPES,
  firstname: v.string,
  lastname: v.string,
  gender: PERSON_GENDERS,
  teacherCode: [v.string, null],
};

export type PersonInput = Parse<typeof personSchema>;

export default wrapAction<
  [personId: string | null, ifRev: string | null, data: PersonInput]
>(async (personId, _ifRev, data) => {
  if (
    (typeof personId !== 'string' && personId !== null) ||
    typeof personId !== typeof _ifRev
  ) {
    throw new InvalidInputError();
  }
  const ifRev = _ifRev as string | null;

  const validatedData = validate(personSchema, data);

  if (!validatedData.valid) {
    throw new InvalidInputError();
  }

  const context = await requireLogin();

  if (personId === null) {
    return createPerson(context, validatedData.data);
  } else {
    return editPerson(context, personId, ifRev!, validatedData.data);
  }
});

async function createPerson(
  context: LoggedInBackendContext,
  data: PersonInput
) {
  await context.services.person.create({
    ...data,
    accountId: null,
  });
}

async function editPerson(
  context: LoggedInBackendContext,
  personId: string,
  ifRev: string,
  data: PersonInput
) {
  const person = await context.services.person.getById(personId);

  if (!person) {
    throw new InvalidInputError();
  }

  await context.services.person.update(personId, data, {
    ifRev,
  });
}

export const generateTeacherCode = wrapAction<[base: string], string>(
  async (base) => {
    if (typeof base !== 'string') {
      throw new InvalidInputError();
    }

    const context = await requireLogin();

    return (
      (await context.services.person.generateTeacherCodeSuggestion(base)) ?? ''
    );
  }
);
