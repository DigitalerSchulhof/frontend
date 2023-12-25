import type { LoggedInBackendContext } from '#/context';
import { useT } from '#/i18n';
import type { Person } from '#/services/interfaces/person';
import { Button } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { NoAccountButton } from './buttons/no-account';
import { MayNotMessagePersonButton } from './buttons/no-permission';
import { PersonDetailsPersonalDataSectionTable } from './table';

export type PersonDetailsPersonalDataSectionProps = {
  person: Person;
  context: LoggedInBackendContext;
};

export const PersonDetailsPersonalDataSection = async ({
  context,
  person,
}: PersonDetailsPersonalDataSectionProps) => {
  const writeMessageButton = await useGetWriteMessageButton(context, person);

  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.details.personal-data.title'
      />
      <PersonDetailsPersonalDataSectionTable
        person={person}
        buttons={writeMessageButton}
      />
    </>
  );
};

async function useGetWriteMessageButton(
  context: LoggedInBackendContext,
  person: Person
): Promise<JSX.Element | null> {
  const { t } = useT();

  if (person.id === context.personId) return null;

  // eslint-disable-next-line no-constant-condition -- TODO: Permission for messaging
  if (1 === 1) {
    return (
      <MayNotMessagePersonButton
        formOfAddress={context.formOfAddress}
        personName={formatName(person)}
      />
    );
  }

  if (!person.account) {
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
