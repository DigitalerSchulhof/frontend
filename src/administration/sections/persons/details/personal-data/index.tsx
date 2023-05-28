import { LoggedInBackendContext } from '#/context';
import { useT } from '#/i18n';
import { Button } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { PersonDetailsProps } from '..';
import { NoAccountButton } from './buttons/no-account';
import { MayNotMessagePersonButton } from './buttons/no-permission';
import { PersonDetailsPersonalDataSectionTable } from './table';

export type PersonDetailsPersonalDataSectionProps = Pick<
  PersonDetailsProps,
  'person' | 'account'
> & {
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
        formOfAddress={context.account.formOfAddress}
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
