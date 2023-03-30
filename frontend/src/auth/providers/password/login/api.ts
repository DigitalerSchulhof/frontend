import { BackendContext, getContext } from '#/backend/context';
import { WithId } from '#/backend/repositories/arango';
import {
  AccountPasswordFilter,
  AccountUsernameFilter,
} from '#/backend/repositories/content/account/filters';
import { PersonBase } from '#/backend/repositories/content/person';
import { AndFilter } from '#/backend/repositories/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { DataError } from '#/backend/utils';
import { aql } from 'arangojs';
import { NextResponse } from 'next/server';

export async function doLogin(
  req: Request,
  body: Record<string, unknown>
): Promise<Response> {
  const { username, password } = body;

  const context = getContext(req);

  const person = await getPersonFromUsernameAndPassword(
    context,
    username,
    password
  );

  if (!person) {
    return NextResponse.json(
      {
        error: 'Invalid username or password',
      },
      {
        status: 401,
      }
    );
  }

  const jwt = await context.services.session.createJwt(context, person.id);

  return NextResponse.json({
    jwt,
  });
}

async function getPersonFromUsernameAndPassword(
  context: BackendContext,
  username: unknown,
  password: unknown
): Promise<WithId<PersonBase> | null> {
  if (!username || !password) {
    return null;
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
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
    throw new DataError('Multiple accounts found with username', {
      username,
    });
  }

  const person = await context.services.person.getById(
    accounts.nodes[0].personId
  );

  return person;
}
