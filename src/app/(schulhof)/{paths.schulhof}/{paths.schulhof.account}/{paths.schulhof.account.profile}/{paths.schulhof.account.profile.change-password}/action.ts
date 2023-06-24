'use server';

import { requireLogin } from '#/auth/action';
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

    const oldPasswordHashed = hashPassword(oldPassword, context.account.salt);

    const isOldPasswordValid = doPasswordsMatch(
      context.account.password,
      oldPasswordHashed
    );

    if (!isOldPasswordValid) {
      throw new ClientError('INVALID_CREDENTIALS');
    }

    const newSalt = generateSalt();

    const newPasswordHashed = hashPassword(newPassword, newSalt);

    await context.services.account.update(
      context.account.id,
      {
        password: newPasswordHashed,
        salt: newSalt,
        passwordExpiresAt: null,
      },
      {
        ifRev: rev,
      }
    );
  }
);
