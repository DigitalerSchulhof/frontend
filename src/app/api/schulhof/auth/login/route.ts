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
import { aql } from 'arangojs';
import { NextResponse } from 'next/server';

export type LoginInput = {
  username: string;
  password: string;
};

export type LoginOutputOk = {
  code: 'OK';
  jwt: string;
};

export type LoginOutputNotOk = {
  code: 'NOT_OK';
  errors: {
    code: 'INVALID_INPUT' | 'INVALID_CREDENTIALS';
  }[];
};

export async function POST(req: Request) {
  const body = await req.json();

  const { username, password } = body;

  const context = getContext(req);

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json(
      {
        code: 'NOT_OK',
        errors: [{ code: 'INVALID_INPUT' }],
      },
      { status: 400 }
    );
  }

  const account = await getAccountFromUsernameAndPassword(
    context,
    username,
    password
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

  const jwt = await context.services.session.createJwt(account.id);

  await context.services.account.updateLastLogin(account.id);

  return NextResponse.json({
    code: 'OK',
    jwt,
  });
}

async function getAccountFromUsernameAndPassword(
  context: BackendContext,
  username: string,
  password: string
): Promise<WithId<AccountBase> | null> {
  // Short-circuit if username or password is not provided
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

  return accounts.nodes[0];
}
