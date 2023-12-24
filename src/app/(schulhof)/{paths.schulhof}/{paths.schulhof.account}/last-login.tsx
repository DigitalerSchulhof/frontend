import type { LoggedInBackendContext } from '#/context';
import { T, makeLink } from '#/i18n';
import type { Account, Person } from '#/services/interfaces/person';

export async function getLastLoginAndUpdateDidShow(
  context: LoggedInBackendContext,
  person: Person & { account: Account }
): Promise<JSX.Element | null> {
  if (context.session.didShowLastLogin) return null;
  if (!person.account.secondLastLogin) return null;

  void context.services.session.setDidShowLastLogin(context.session.id);

  return (
    <p>
      <T
        t='schulhof.account.last-login'
        args={{
          last_login: new Date(person.account.secondLastLogin),
          TheftLink: makeLink([
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.identity-theft',
          ]),
        }}
      />
    </p>
  );
}
