'use server';

import { requireLogin } from '#/auth/action';
import { InvalidInputError, wrapAction } from '#/utils/action';
import { ClientError } from '#/utils/server';

export const changePassword = wrapAction<
  [
    ifRev: string,
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string
  ]
>(async (ifRev, oldPassword, newPassword, newPasswordAgain) => {
  if (
    typeof ifRev !== 'string' ||
    typeof oldPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    typeof newPasswordAgain !== 'string'
  ) {
    throw new InvalidInputError();
  }

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

  await context.services.account.changePassword(
    context.account.id,
    newPassword,
    null,
    ifRev
  );
});
