import { BackendContext, getContext } from '#/backend/context';
import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { PersonBase } from '#/backend/repositories/content/person';
import { SessionBase } from '#/backend/repositories/content/session';
import { JwtPayload } from '#/backend/services/content/session';
import { getServerT } from '#/i18n/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireLogin(): Promise<{
  context: BackendContext;
  jwtPayload: JwtPayload;
  session: WithId<SessionBase>;
  person: WithId<PersonBase>;
  account: WithId<AccountBase>;
}> {
  const { t } = getServerT();
  const context = getContext();

  const personEtc = await getCurrentPerson(context);

  if (!personEtc) {
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.login')}`);
  }

  return { ...personEtc, context };
}

export async function requireNoLogin(): Promise<void> {
  const { t } = getServerT();
  const context = getContext();

  const session = (await getCurrentSession(context)) !== null;

  if (session) {
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.account')}`);
  }
}

export async function getCurrentSession(
  context: BackendContext
): Promise<{ jwtPayload: JwtPayload; session: WithId<SessionBase> } | null> {
  const token = cookies().get('jwt')?.value;

  if (!token) return null;

  const content = context.services.session.verifyJwt(token);

  if (!content) return null;

  // Session expired
  if (content.exp < Date.now() / 1000) {
    return null;
  }

  const session = await context.services.session.getById(content.sessionId);

  // Session revoked
  if (!session) return null;

  return { jwtPayload: content, session };
}

export async function getCurrentPerson(context: BackendContext): Promise<{
  jwtPayload: JwtPayload;
  session: WithId<SessionBase>;
  person: WithId<PersonBase>;
  account: WithId<AccountBase>;
} | null> {
  const sessionAndPayload = await getCurrentSession(context);

  if (!sessionAndPayload) return null;

  const { jwtPayload, session } = sessionAndPayload;

  const account = (await context.services.account.getById(session.accountId))!;
  const person = (await context.services.person.getById(account.personId))!;

  return {
    jwtPayload,
    session,
    person,
    account,
  };
}
