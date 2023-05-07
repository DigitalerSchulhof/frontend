'use server';

import { BackendContext, getContext } from '#/backend/context';
import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import {
  AccountPasswordFilter,
  AccountUsernameFilter,
} from '#/backend/repositories/content/account/filters';
import { AndFilter } from '#/backend/repositories/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { ErrorWithPayload } from '#/utils';
import { wrapAction, ClientError } from '#/utils/server';
import { aql } from 'arangojs';

export const login = wrapAction(async (username: string, password: string) => {
  const context = getContext();

  const account = await getAccountFromUsernameAndPassword(
    context,
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
      formOfAddress: account.formOfAddress,
    });
  }

  const jwt = await context.services.session.createJwt(account.id);

  await context.services.account.updateLastLogin(account.id);

  return jwt;
});

async function getAccountFromUsernameAndPassword(
  context: BackendContext,
  username: string,
  password: string
): Promise<WithId<AccountBase> | null> {
  if (!username || !password) {
    return null;
  }

  const accountFilter = new AndFilter(
    new AccountUsernameFilter(new EqFilterOperator(username)),
    new AccountPasswordFilter(
      (variableName) =>
        new EqFilterOperator<string>(
          aql`
            SHA512(CONCAT(${password}, ${variableName}.salt))
          `
        )
    )
  );

  const accounts = await context.services.account.search({
    filter: accountFilter,
  });

  if (!accounts.nodes.length) {
    return null;
  }

  if (accounts.nodes.length > 1) {
    throw new ErrorWithPayload('Multiple accounts found with username', {
      username,
    });
  }

  const account = accounts.nodes[0];

  return account;
}
