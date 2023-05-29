'use server';

import { requireNoLogin } from '#/auth/action';
import { InvalidInputError, wrapAction } from '#/utils/action';
import { ClientError } from '#/utils/server';

export const login = wrapAction<[username: string, password: string], string>(
  async (username, password) => {
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new InvalidInputError();
    }

    const context = await requireNoLogin();

    const account = await context.services.account.getByUsernameAndPassword(
      username,
      password
    );

    if (!account) {
      throw new ClientError('INVALID_CREDENTIALS');
    }

    if (
      account.passwordExpiresAt !== null &&
      account.passwordExpiresAt < new Date().getTime()
    ) {
      throw new ClientError('PASSWORD_EXPIRED', {
        formOfAddress: account.settings.profile.formOfAddress,
      });
    }

    const jwt = await context.services.session.createJwt(account.id);

    await context.services.account.update(
      account.id,
      {
        secondLastLogin: account.lastLogin,
        lastLogin: new Date().getTime(),
      },
      {
        skipValidation: true,
      }
    );

    return jwt;
  }
);
