'use server';

import { requireLogin } from '#/auth/action';
import { wrapAction } from '#/utils/action';

export const changePassword = wrapAction(
  async (
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string
  ) => {
    const context = requireLogin();
  }
);
