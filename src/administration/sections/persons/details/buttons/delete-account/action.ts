'use server';

import { requireLogin } from '#/auth/action';
import { Filter } from '#/services/interfaces/base';
import { wrapAction } from '#/utils/action';
import { v } from 'vality';

export default wrapAction([v.string], async (personId) => {
  const context = await requireLogin();

  await context.services.account.deleteWhere(
    new Filter('personId', 'eq', personId)
  );
});
