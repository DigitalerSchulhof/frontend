'use server';

import { requireLogin } from '#/auth/action';
import { InvalidInputError, wrapAction } from '#/utils/action';

export const editAccount = wrapAction<
  [personId: string, ifRev: string, username: string, email: string]
>(async (personId, ifRev, username, email) => {
  if (
    typeof personId !== 'string' ||
    typeof ifRev !== 'string' ||
    typeof username !== 'string' ||
    typeof email !== 'string'
  ) {
    throw new InvalidInputError();
  }

  const context = await requireLogin();

  const person = await context.services.person.getById(personId);

  if (!person) {
    throw new InvalidInputError();
  }

  const accountId = person.accountId;

  if (!accountId) {
    throw new InvalidInputError();
  }

  await context.services.account.update(
    accountId,
    {
      username,
      email,
    },
    {
      ifRev,
    }
  );
});
