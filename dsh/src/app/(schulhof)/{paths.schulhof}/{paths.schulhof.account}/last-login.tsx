import { BackendContext } from '#/backend/context';
import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { SessionBase } from '#/backend/repositories/content/session';
import { T, makeLink } from '#/i18n';
import React from 'react';

export async function getLastLoginAndUpdateDidShow(
  context: BackendContext,
  account: WithId<AccountBase>,
  session: WithId<SessionBase>
): Promise<React.ReactNode> {
  if (session.didShowLastLogin) return null;
  if (!account.secondLastLogin) return null;

  await context.services.session.update(session.id, {
    didShowLastLogin: true,
  });

  return (
    <T
      t='schulhof.account.last-login'
      args={{
        last_login: new Date(account.secondLastLogin * 1000),
        TheftLink: makeLink([
          'paths.schulhof',
          'paths.schulhof.account',
          'paths.schulhof.account.profile',
          'paths.schulhof.account.profile.identity-theft',
        ]),
      }}
    />
  );
}
