'use server';

import { requireLogin } from '#/auth/action';
import { InvalidInputError, wrapAction } from '#/utils/action';

export const editAccount = wrapAction<
  [personId: string, username: string, email: string]
>(async (personId, username, email) => {
  if (
    typeof personId !== 'string' ||
    typeof username !== 'string' ||
    typeof email !== 'string'
  ) {
    throw new InvalidInputError();
  }

  const context = await requireLogin();

  await context.services.account.update(context.account.id, {
    personId,
    username,
    email,
  });
});
