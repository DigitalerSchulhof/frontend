import {
  BackendContext,
  LoggedInBackendContext,
  getContext,
} from '#/backend/context';
import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { PersonBase } from '#/backend/repositories/content/person';
import { SessionBase } from '#/backend/repositories/content/session';
import { JwtPayload } from '#/backend/services/content/session';
import { useT } from '#/i18n';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function useRequireLogin(): Promise<{
  context: LoggedInBackendContext;
  jwtPayload: JwtPayload;
}> {
  const { t } = useT();
  const context = getContext();

  try {
    const { jwtPayload, ...personEtc } = await getCurrentPerson(context);

    return {
      context: {
        ...context,
        ...personEtc,
      },
      jwtPayload,
    };
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      redirect(
        `/${[t('paths.schulhof'), t('paths.schulhof.login')].join('/')}`
      );
    }

    throw err;
  }
}

export async function useRequireNoLogin(): Promise<void> {
  const { t } = useT();
  const context = getContext();

  try {
    await getCurrentSession(context);

    redirect(
      `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
    );
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      return;
    }

    throw err;
  }
}

export async function getCurrentSession(
  context: BackendContext
): Promise<{ jwtPayload: JwtPayload; session: WithId<SessionBase> }> {
  const token = cookies().get('jwt')?.value;

  if (!token) throw new NotLoggedInError();

  const content = context.services.session.verifyJwt(token);

  if (!content) throw new NotLoggedInError();

  // Session expired
  if (content.exp < Date.now() / 1000) {
    throw new NotLoggedInError();
  }

  const session = await context.services.session.getById(content.sessionId);

  // Session revoked
  if (!session) throw new NotLoggedInError();

  return { jwtPayload: content, session };
}

export async function getCurrentPerson(context: BackendContext): Promise<{
  jwtPayload: JwtPayload;
  session: WithId<SessionBase>;
  person: WithId<PersonBase>;
  account: WithId<AccountBase>;
}> {
  const { jwtPayload, session } = await getCurrentSession(context);

  const account = (await context.services.account.getById(session.accountId))!;
  const person = (await context.services.person.getById(account.personId))!;

  return {
    jwtPayload,
    session,
    person,
    account,
  };
}

export class NotLoggedInError extends Error {
  constructor() {
    super('Not logged in');
  }
}
