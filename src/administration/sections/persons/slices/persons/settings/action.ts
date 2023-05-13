'use server';

import { requireLogin } from '#/auth/action';
import { AccountSettings } from '#/backend/repositories/content/account';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { wrapAction } from '#/utils/action';

export const settings = wrapAction(
  async (personId: string, settings: AccountSettings) => {
    const context = await requireLogin();

    const account = await context.services.account.searchOne({
      filter: new AccountPersonIdFilter(new EqFilterOperator(personId)),
    });

    if (!account) {
      throw new Error('ACCOUNT_NOT_FOUND');
    }

    await context.services.account.update(account.id, { settings });
  }
);
