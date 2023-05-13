'use server';

import { wrapAction } from '#/utils/action';

export const changePassword = wrapAction(
  async (
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string
  ) => {
    const context = requireActionLogin();
  }
);
