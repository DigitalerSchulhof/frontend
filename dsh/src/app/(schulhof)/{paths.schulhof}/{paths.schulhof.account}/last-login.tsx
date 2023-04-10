import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { SessionBase } from '#/backend/repositories/content/session';
import { T, makeLink } from '#/i18n';
import React from 'react';

export function getLastLoginAndSetCookie(
  account: WithId<AccountBase>,
  session: WithId<SessionBase>
): React.ReactNode {
  if (session.didShowLastLogin) return null;
  if (!account.secondLastLogin) return null;

  return (
    <T
      t='schulhof.account.last-login'
      args={{
        last_login: account.secondLastLogin,
        TheftLink: makeLink([
          'paths.schulhof',
          'paths.schulhof.account',
          'paths.schulhof.account.profile',
          'paths.schulhof.account.profile.theft',
        ]),
      }}
    />
  );
}
