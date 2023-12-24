import type { LoggedInBackendContext } from '#/context';
import type { Person } from '#/services/interfaces/person';
import { ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Note } from '#/ui/Note';
import { formatName } from '#/utils';
import type { ClientFormOfAddress } from '#/utils/client';
import { ChangePasswordButton } from './change-password';
import { CreateAccountButton } from './create-account';
import { DeleteAccountButton } from './delete-account';
import { DeletePersonButton } from './delete-person';
import { EditAccountButton } from './edit-account';
import { EditPersonButton } from './edit-person';
import { IdentityTheftButton } from './identity-theft';
import { PermissionsButton } from './permissions';
import { SettingsButton } from './settings';

export const PersonDetailsButtonSection = ({
  context,
  isOwnProfile,
  person,
}: {
  context: LoggedInBackendContext;
  person: Person;
  isOwnProfile: boolean;
}) => {
  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.details.buttons.title'
      />
      <UserButtons
        formOfAddress={context.formOfAddress}
        isOwnProfile={isOwnProfile}
        person={person}
      />
      <AdminButtons formOfAddress={context.formOfAddress} person={person} />
      {!isOwnProfile ? (
        <Note t='schulhof.administration.sections.persons.details.buttons.actions.change-password.note' />
      ) : null}
    </>
  );
};

/**
 * Buttons that a regular user can see on their own profile page.
 */
const UserButtons = ({
  person,
  formOfAddress,
  isOwnProfile,
}: {
  person: Person;
  formOfAddress: ClientFormOfAddress;
  isOwnProfile: boolean;
}) => {
  const personName = formatName(person);

  const buttons = [];

  if (person.account) {
    buttons.push(
      <EditAccountButton
        key='edit-account'
        isOwnProfile={isOwnProfile}
        personId={person.id}
      />
    );
  }

  if (isOwnProfile) {
    buttons.push(<ChangePasswordButton key='change-password' />);
  }

  if (person.account) {
    buttons.push(
      <SettingsButton
        key='settings'
        isOwnProfile={isOwnProfile}
        personId={person.id}
      />
    );
  }

  if (isOwnProfile) {
    buttons.push(<IdentityTheftButton key='identity-theft' />);
  }

  if (person.account) {
    buttons.push(
      <DeleteAccountButton
        key='delete-account'
        personId={person.id}
        personRev={person.rev}
        formOfAddress={formOfAddress}
        isOwnProfile={isOwnProfile}
        personName={personName}
      />
    );
  }

  if (!buttons.length) return null;

  return <ButtonGroup>{buttons}</ButtonGroup>;
};

/**
 * Buttons that an admin can see on any profile page.
 */
const AdminButtons = ({
  person,
  formOfAddress,
}: {
  person: Person;
  formOfAddress: ClientFormOfAddress;
}) => {
  const buttons = [];

  buttons.push(<EditPersonButton key='edit-person' personId={person.id} />);

  buttons.push(<PermissionsButton key='permissions' personId={person.id} />);

  if (!person.account) {
    buttons.push(
      <CreateAccountButton key='create-account' personId={person.id} />
    );
  }

  buttons.push(
    <DeletePersonButton
      key='delete-person'
      personId={person.id}
      personRev={person.rev}
      formOfAddress={formOfAddress}
      personName={formatName(person)}
      hasAccount={!!person.account}
    />
  );

  if (!buttons.length) return null;

  return <ButtonGroup>{buttons}</ButtonGroup>;
};
