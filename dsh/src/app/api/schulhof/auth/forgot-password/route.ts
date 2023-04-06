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
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { username, email } = body;

  const context = getContext(req);

  const account = await getAccountFromUsernameAndEmail(
    context,
    username,
    email
  );

  if (!account) {
    return NextResponse.json(
      {
        error: 'Username and email do not match',
      },
      {
        status: 401,
      }
    );
  }

  await sendPasswordResetEmail(context, account);

  return NextResponse.json({
    formOfAddress: account.formOfAddress,
  });
}

async function getAccountFromUsernameAndEmail(
  context: BackendContext,
  username: unknown,
  email: unknown
): Promise<WithId<AccountBase> | null> {
  if (!username || !email) {
    return null;
  }

  if (typeof username !== 'string' || typeof email !== 'string') {
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
}
