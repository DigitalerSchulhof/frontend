'use server';

import { requireLogin } from '#/auth/action';
import { AccountSettings } from '#/backend/repositories/content/account';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { InvalidInputError, wrapAction } from '#/utils/action';
import { v, validate } from 'vality';

const accountSettingsSchema = {
  emailOn: {
    newMessage: v.boolean,
    newSubstitution: v.boolean,
    newNews: v.boolean,
  },
  pushOn: {
    newMessage: v.boolean,
    newSubstitution: v.boolean,
    newNews: v.boolean,
  },
  considerNews: {
    newEvent: v.boolean,
    newBlog: v.boolean,
    newGallery: v.boolean,
    fileChanged: v.boolean,
  },
  mailbox: {
    deleteAfter: [v.number, null],
    deleteAfterInBin: [v.number, null],
  },
  profile: {
    sessionTimeout: v.number,
  },
};

export const settings = wrapAction<
  [personId: string, settings: AccountSettings]
>(async (personId, settings) => {
  if (typeof personId !== 'string') {
    throw new InvalidInputError();
  }

  const validatedSettings = validate(accountSettingsSchema, settings);

  if (!validatedSettings.valid) {
    throw new InvalidInputError();
  }

  const context = await requireLogin();

  const account = await context.services.account.searchOne({
    filter: new AccountPersonIdFilter(new EqFilterOperator(personId)),
  });

  if (!account) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  await context.services.account.update(account.id, {
    settings: validatedSettings.data,
  });
});