import { BackendContext, getContext } from '#/backend/context';
import { WithId } from '#/backend/repositories/arango';
import {
  AccountEmailFilter,
  AccountPasswordFilter,
} from '#/backend/repositories/content/account/filters';
import { PersonBase } from '#/backend/repositories/content/person';
import { PersonAccountFilter } from '#/backend/repositories/content/person/filters';
import { AndFilter } from '#/backend/repositories/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { createInternalErrorResponse } from '#/utils';
import { aql } from 'arangojs';
import { NextResponse } from 'next/server';

export async function doLogin(req: Request): Promise<Response> {
  const { email, password } = await req.json();

  const context = getContext(req);

  const persons = await getPersonsFromEmailAndPassword(
    context,
    email,
    password
  );

  if (!persons.length) {
    return NextResponse.json(
      {
        error: 'Invalid email or password',
      },
      {
        status: 401,
      }
    );
  }

  if (persons.length > 1) {
    context.logger.error('Multiple persons found for account with email', {
      email,
    });

    return createInternalErrorResponse();
  }

  const [person] = persons;

  const session = await context.services.session.createJwt({
    personId: person.id,
  });

  return NextResponse.json({
    session,
  });
}

async function getPersonsFromEmailAndPassword(
  context: BackendContext,
  email: string,
  password: string
): Promise<WithId<PersonBase>[]> {
  if (!email || !password) {
    return [];
  }

  const accountFilter = new AndFilter(
    new AccountEmailFilter(new EqFilterOperator(email)),
    new AccountPasswordFilter(
      (variableName) =>
        new EqFilterOperator<string>(
          aql`
            MD5(CONCAT(${password}, ${variableName}.salt))
          `
        )
    )
  );

  const personFilter = new PersonAccountFilter(accountFilter);

  const persons = await context.services.person.search({
    filter: personFilter,
  });

  return persons.nodes;
}
