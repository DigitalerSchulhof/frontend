'use server';

import { requireNoLogin } from '#/auth/action';
import { Filter } from '#/services/interfaces/base';
import { wrapFormAction } from '#/utils/action';
import { doPasswordsMatch, hashPassword, signJwt } from '#/utils/password';
import { ClientError } from '#/utils/server';
import { cookies } from 'next/dist/client/components/headers';
import { v } from 'vality';

export default wrapFormAction(
  { username: v.string, password: v.string },
  async ({ username, password }) => {
    const context = await requireNoLogin();

    const {
      items: [account],
      total: accountsTotal,
    } = await context.services.account.search({
      filter: new Filter('username', 'eq', username),
    });

    if (!accountsTotal) {
      throw new ClientError('INVALID_CREDENTIALS');
    }

    const hashedPassword = await hashPassword(password, account.salt);

    if (!doPasswordsMatch(hashedPassword, account.password)) {
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

    const now = Date.now();

    const session = await context.services.session.create({
      personId: account.personId,
      didShowLastLogin: false,
      issuedAt: now,
    });

    const jwt = await signJwt(now, session.id, account.id);

    await context.services.account.update(account.id, {
      secondLastLogin: account.lastLogin,
      lastLogin: new Date().getTime(),
    });

    cookies().set('jwt', jwt);
  }
);
