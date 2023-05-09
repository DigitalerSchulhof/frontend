'use server';

import { wrapAction } from '#/utils/action';

export const identityTheft = wrapAction(
  async (
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string
  ) => {
    console.log('HE');
  }
);
