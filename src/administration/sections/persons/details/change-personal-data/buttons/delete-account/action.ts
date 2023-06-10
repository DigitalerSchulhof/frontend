'use server';

import { requireLogin } from '#/auth/action';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { InvalidInputError, wrapAction } from '#/utils/action';

export default wrapAction<[personId: string]>(async (personId) => {
  if (typeof personId !== 'string') {
    throw new InvalidInputError();
  }

  const context = await requireLogin();

  await context.services.account.filterDelete(
    new AccountPersonIdFilter(new EqFilterOperator(personId))
  );
});
