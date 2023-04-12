import { LoggedInBackendContext } from '#/backend/context';
import { Button } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { PersonDetailsProps } from '..';
import { NoAccountButton } from '../buttons/no-account';
import { MayNotMessagePersonButton } from '../buttons/no-permission';
import { PersonDetailsPersonalDataSectionTable } from './table';

export type PersonDetailsPersonalDataSectionProps = Pick<
  PersonDetailsProps,
  'context' | 'person' | 'account'
>;

export const PersonDetailsPersonalDataSection = ({
  context,
  person,
  account,
}: PersonDetailsPersonalDataSectionProps) => {
  const writeMessageButton = getWriteMessageButton(context, person, !!account);

  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.slices.persons.details.personal-data.title'
      />
      <PersonDetailsPersonalDataSectionTable
        person={person}
        account={account}
        buttons={writeMessageButton}
      />
    </>
  );
};

function getWriteMessageButton(
  context: LoggedInBackendContext,
  person: { id: string; firstname: string; lastname: string },
  hasAccount: boolean
): React.ReactNode {
  if (person.id === context.person.id) return null;

  if (!mayMessagePerson(context, person)) {
    return (
      <MayNotMessagePersonButton
        formOfAddress={context.person.formOfAddress}
        personName={formatName(person)}
      />
    );
  }

  if (!hasAccount) {
    <NoAccountButton personName={formatName(person)} />;
  }

  return (
    <Button
      href={[
        'paths.schulhof',
        'paths.schulhof.account',
        'paths.schulhof.account.mailbox',
        'paths.schulhof.account.mailbox.compose',
        `{${person.id}}}`,
      ]}
      t={
        'schulhof.administration.sections.persons.slices.persons.details.personal-data.actions.write-message.button'
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
