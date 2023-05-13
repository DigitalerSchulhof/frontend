'use server';

import { requireLogin } from '#/auth/action';
import { InvalidInputError, wrapAction } from '#/utils/action';
import { ClientError } from '#/utils/server';

export const identityTheft = wrapAction<
  [oldPassword: string, newPassword: string, newPasswordAgain: string]
>(async (oldPassword, newPassword, newPasswordAgain) => {
  if (
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

  await context.services.identityTheft.report(context.person.id);

  await context.services.account.changePassword(
    context.account.id,
    newPassword,
    null
  );
});
