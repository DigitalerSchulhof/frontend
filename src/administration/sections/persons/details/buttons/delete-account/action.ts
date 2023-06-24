'use server';

import { requireLogin } from '#/auth/action';
import { AccountFilter } from '#/services/interfaces/account';
import { AndFilter } from '#/services/interfaces/base';
import { PersonFilter } from '#/services/interfaces/person';
import { wrapAction } from '#/utils/action';
import { v } from 'vality';

export default wrapAction([v.string], async (personId) => {
  const context = await requireLogin();

  await context.services.account.deleteWhere(
    new AndFilter(
      new AccountFilter('personId', 'eq', personId),
      new PersonFilter('accountId', 'eq', personId)
    )
  );
});
