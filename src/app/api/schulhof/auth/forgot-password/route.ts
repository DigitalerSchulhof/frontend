import { BackendContext, getContext } from '#/backend/context';
import { WithId } from '#/backend/repositories/arango';
import {
  AccountBase,
  FormOfAddress,
} from '#/backend/repositories/content/account';
import {
  AccountEmailFilter,
  AccountUsernameFilter,
} from '#/backend/repositories/content/account/filters';
import { AndFilter } from '#/backend/repositories/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { ErrorWithPayload } from '#/utils';
import { NextResponse } from 'next/server';

export type ForgotPasswordInput = {
  username: string;
  email: string;
};

export type ForgotPasswordOutputOk = {
  code: 'OK';
  formOfAddress: FormOfAddress;
  email: string;
};

export type ForgotPasswordOutputNotOk = {
  code: 'NOT_OK';
  errors: {
    code: 'INVALID_CREDENTIALS';
  }[];
};

export async function POST(req: Request) {
  const body = await req.json();

  const { username, email } = body;

  const context = getContext(req);

  if (typeof username !== 'string' || typeof email !== 'string') {
    return NextResponse.json(
      {
        code: 'NOT_OK',
        errors: [{ code: 'INVALID_INPUT' }],
      },
      { status: 400 }
    );
  }

  const account = await getPersonAndAccountFromUsernameAndEmail(
    context,
    username,
    email
  );

  if (!account) {
    return NextResponse.json(
      {
        code: 'NOT_OK',
        errors: [{ code: 'INVALID_CREDENTIALS' }],
      },
      { status: 401 }
    );
  }

  await sendPasswordResetEmail(context, account);

  return NextResponse.json({
    code: 'OK',
    formOfAddress: account.formOfAddress,
    email: account.email,
  });
}

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
