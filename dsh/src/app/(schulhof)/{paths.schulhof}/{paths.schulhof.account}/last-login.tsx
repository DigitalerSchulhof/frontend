import { LoggedInBackendContext } from '#/backend/context';
import { T, makeLink } from '#/i18n';
import React from 'react';

export async function getLastLoginAndUpdateDidShow(
  context: LoggedInBackendContext
): Promise<React.ReactNode> {
  if (context.session.didShowLastLogin) return null;
  if (!context.account.secondLastLogin) return null;

  await context.services.session.update(context.session.id, {
    didShowLastLogin: true,
  });

  return (
    <T
      t='schulhof.account.last-login'
      args={{
        last_login: new Date(context.account.secondLastLogin),
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
