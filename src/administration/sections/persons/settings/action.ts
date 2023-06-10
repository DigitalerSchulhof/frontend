'use server';

import { requireLogin } from '#/auth/action';
import { FORMS_OF_ADDRESS } from '#/backend/repositories/content/account';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { InvalidInputError, wrapAction } from '#/utils/action';
import { v } from 'vality';

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
    formOfAddress: FORMS_OF_ADDRESS,
  },
};

export default wrapAction(
  [v.string, accountSettingsSchema],
  async (personId, settings) => {
    const context = await requireLogin();

    const account = await context.services.account.searchOne({
      filter: new AccountPersonIdFilter(new EqFilterOperator(personId)),
    });

    if (!account) {
      throw new InvalidInputError();
    }

    await context.services.account.update(account.id, {
      settings,
    });
  }
);
