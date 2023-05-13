'use server';

import { requireLogin } from '#/auth/action';
import { wrapAction } from '#/utils/action';
import { ClientError } from '#/utils/server';

export const identityTheft = wrapAction(
  async (
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string
  ) => {
    const context = await requireLogin();

    if (newPassword !== newPasswordAgain) {
      throw new ClientError('PASSWORD_MISMATCH');
    }

    const isOldPasswordValid = await context.services.account.isPasswordValid(
      context.account.id,
      oldPassword
    );

    if (!isOldPasswordValid) {
      throw new ClientError('INVALID_CREDENTIALS');
    }

    await context.services.identityTheft.report(context.person.id);

    await context.services.account.changePassword(
      context.account.id,
      newPassword,
      null
    );
  }
);
