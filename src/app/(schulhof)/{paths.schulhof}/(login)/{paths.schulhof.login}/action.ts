'use server';

import { requireNoLogin } from '#/auth/action';
import { wrapAction } from '#/utils/action';
import { ClientError } from '#/utils/server';
import { v } from 'vality';

export default wrapAction([v.string, v.string], async (username, password) => {
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
});
