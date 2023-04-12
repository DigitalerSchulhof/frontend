import { LoggedInBackendContext } from '#/backend/context';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { PersonDetailsProps } from '..';
import { MessagePersonButton } from '../buttons/message';
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
        formOfAddress={context.account.formOfAddress}
        personName={formatName(person)}
      />
    );
  }

  if (!hasAccount) {
    <NoAccountButton personName={formatName(person)} />;
  }

  return <MessagePersonButton personId={person.id} />;
}

export function mayMessagePerson(
  _context: LoggedInBackendContext,
  _person: { id: string }
) {
  // TODO: Check permission
  return true;
}
