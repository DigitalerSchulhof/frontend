'use server';

import { AccountSettings } from '#/backend/repositories/content/account';
import { wrapAction } from '#/utils/action';

export const settings = wrapAction(
  async (personId: string, settings: AccountSettings) => {
    console.log('HO');
  }
);
