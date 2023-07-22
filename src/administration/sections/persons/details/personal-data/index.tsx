import type { LoggedInBackendContext } from '#/context';
import { useT } from '#/i18n';
import type { Account } from '#/services/interfaces/account';
import type { WithId } from '#/services/interfaces/base';
import type { Person } from '#/services/interfaces/person';
import { Button } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { NoAccountButton } from './buttons/no-account';
import { MayNotMessagePersonButton } from './buttons/no-permission';
import { PersonDetailsPersonalDataSectionTable } from './table';

export type PersonDetailsPersonalDataSectionProps = {
  person: WithId<Person>;
  account: WithId<Account> | null;
  context: LoggedInBackendContext;
};

export const PersonDetailsPersonalDataSection = ({
  context,
  person,
  account,
}: PersonDetailsPersonalDataSectionProps) => {
  const writeMessageButton = useGetWriteMessageButton(
    context,
    person,
    !!account
  );

  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.details.personal-data.title'
      />
      <PersonDetailsPersonalDataSectionTable
        person={person}
        account={account}
        buttons={writeMessageButton}
      />
    </>
  );
};

function useGetWriteMessageButton(
  context: LoggedInBackendContext,
  person: { id: string; firstname: string; lastname: string },
  hasAccount: boolean
): JSX.Element | null {
  const { t } = useT();

  if (person.id === context.person.id) return null;

  if (!mayMessagePerson(context, person)) {
    return (
      <MayNotMessagePersonButton
        formOfAddress={context.account.settings.profile.formOfAddress}
        personName={formatName(person)}
      />
    );
  }

  if (!hasAccount) {
    return <NoAccountButton personName={formatName(person)} />;
  }

  return (
    <Button
      href={`/${[
        t('paths.schulhof'),
        t('paths.schulhof.account'),
        t('paths.schulhof.account.mailbox'),
        t('paths.schulhof.account.mailbox.compose'),
      ].join('/')}?${t('paths.schulhof.account.mailbox.compose.query.to')}=${
        person.id
      }`}
      t={
        'schulhof.administration.sections.persons.details.personal-data.actions.write-message.button'
      }
    />
  );
}

export function mayMessagePerson(
  _context: LoggedInBackendContext,
  _person: { id: string }
) {
  // TODO: Check permission
  return true;
}
