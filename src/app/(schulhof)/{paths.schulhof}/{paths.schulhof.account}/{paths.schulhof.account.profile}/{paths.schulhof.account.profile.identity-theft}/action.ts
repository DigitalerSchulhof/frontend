'use server';

import { requireLogin } from '#/auth/action';
import type { LoggedInBackendContext } from '#/context';
import { wrapFormAction } from '#/utils/action';
import { doPasswordsMatch, generateSalt, hashPassword } from '#/utils/password';
import { ClientError } from '#/utils/server';
import { v } from 'vality';

export default wrapFormAction(
  {
    rev: v.string,
    oldPassword: v.string,
    newPassword: v.string,
    newPasswordAgain: v.string,
  },
  async ({ rev, oldPassword, newPassword, newPasswordAgain }) => {
    const context = await requireLogin();

    if (newPassword !== newPasswordAgain) {
      throw new ClientError('PASSWORD_MISMATCH');
    }

    const isOldPasswordValid = doPasswordsMatch(
      context.account.password,
      await hashPassword(oldPassword, context.account.salt)
    );

    if (!isOldPasswordValid) {
      throw new ClientError('INVALID_CREDENTIALS');
    }

    await context.services.identityTheft.report(context.person.id);

    await updatePassword(context, newPassword, rev);
  }
);

async function updatePassword(
  context: LoggedInBackendContext,
  newPassword: string,
  rev: string
): Promise<void> {
  const salt = generateSalt();

  await context.services.account.update(
    context.account.id,
    {
      password: await hashPassword(newPassword, salt),
      salt,
    },
    {
      ifRev: rev,
    }
  );
}
