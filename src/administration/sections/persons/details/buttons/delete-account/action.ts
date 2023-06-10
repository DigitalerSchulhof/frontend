'use server';

import { requireLogin } from '#/auth/action';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { wrapAction } from '#/utils/action';
import { v } from 'vality';

export default wrapAction([v.string], async (personId) => {
  const context = await requireLogin();

  await context.services.account.filterDelete(
    new AccountPersonIdFilter(new EqFilterOperator(personId))
  );
});
