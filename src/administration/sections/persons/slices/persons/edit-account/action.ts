'use server';

import { wrapAction } from '#/utils/action';

export const editAccount = wrapAction(
  async (personId: string, username: string, email: string) => {
    console.log('HI');
  }
);
