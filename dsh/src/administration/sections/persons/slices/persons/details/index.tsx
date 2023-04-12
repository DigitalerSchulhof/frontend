import { LoggedInBackendContext } from '#/backend/context';
import {
  PersonGender,
  PersonType,
} from '#/backend/repositories/content/person';
import { T } from '#/i18n';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { MessagePersonButton } from './buttons/message';
import { NoAccountButton } from './buttons/no-account';
import { MayNotMessagePersonButton } from './buttons/no-permission';
import { PersonDetailsTable } from './table';

export type PersonDetailsProps = {
  context: LoggedInBackendContext;
  person: {
    id: string;
    type: PersonType;
    firstname: string;
    lastname: string;
    gender: PersonGender;
    teacherCode: string | null;
  };
  account: {
    username: string;
    email: string;
    lastLogin: number | null;
    secondLastLogin: number | null;
  } | null;
};

export const PersonDetails = async ({
  context,
  person,
  account,
}: PersonDetailsProps) => {
  const writeMessageButton = getWriteMessageButton(context, person, !!account);

  return (
    <Col w='6'>
      <Heading size='2'>
        <T t='schulhof.account.profile.data.title' />
      </Heading>
      <PersonDetailsTable
        person={person}
        account={account}
        buttons={<>{writeMessageButton}</>}
      />
    </Col>
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
