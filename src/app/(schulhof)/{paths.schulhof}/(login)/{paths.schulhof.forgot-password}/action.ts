'use server';

import { BackendContext, getContext } from '#/backend/context';
import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import {
  AccountEmailFilter,
  AccountUsernameFilter,
} from '#/backend/repositories/content/account/filters';
import { AndFilter } from '#/backend/repositories/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { ErrorWithPayload } from '#/utils';
import { wrapAction } from '#/utils/action';
import { ClientError } from '#/utils/server';

export const forgotPassword = wrapAction(
  async (username: string, email: string) => {
    const context = getContext();

    const account = await getPersonAndAccountFromUsernameAndEmail(
      context,
      username,
      email
    );

    if (!account) {
      throw new ClientError('INVALID_CREDENTIALS');
    }

    await sendPasswordResetEmail(context, account);

    return {
      formOfAddress: account.formOfAddress,
      email: account.email,
    };
  }
);

async function getPersonAndAccountFromUsernameAndEmail(
  context: BackendContext,
  username: string,
  email: string
): Promise<WithId<AccountBase> | null> {
  // Short-circuit if username or email is not provided
  if (!username || !email) {
    return null;
  }

  const accountFilter = new AndFilter(
    new AccountUsernameFilter(new EqFilterOperator(username)),
    new AccountEmailFilter(new EqFilterOperator(email))
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

  return accounts.nodes[0];
}

async function sendPasswordResetEmail(
  _context: BackendContext,
  account: WithId<AccountBase>
): Promise<void> {
  console.log(`Sent email to ${account.email}`);
  // TODO: Send email
}
