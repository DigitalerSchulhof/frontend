import type { LoggedInBackendContext } from '#/context';
import type { Account, FormOfAddress } from '#/services/interfaces/account';
import type { WithId } from '#/services/interfaces/base';
import type { Person } from '#/services/interfaces/person';
import { ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Note } from '#/ui/Note';
import { formatName } from '#/utils';
import type { PersonDetailsProps } from '..';
import { ChangePasswordButton } from './change-password';
import { CreateAccountButton } from './create-account';
import { DeleteAccountButton } from './delete-account';
import { DeletePersonButton } from './delete-person';
import { EditAccountButton } from './edit-account';
import { EditPersonButton } from './edit-person';
import { IdentityTheftButton } from './identity-theft';
import { PermissionsButton } from './permissions';
import { SettingsButton } from './settings';

export type PersonDetailsChangePersonalDataSectionProps = {
  person: WithId<Person>;
  account: WithId<Account> | null;
  context: LoggedInBackendContext;
  isOwnProfile: boolean;
};

export const PersonDetailsButtonSection = ({
  context,
  isOwnProfile,
  person,
  account,
}: PersonDetailsChangePersonalDataSectionProps) => {
  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.details.buttons.title'
      />
      <UserButtons
        formOfAddress={context.account.settings.profile.formOfAddress}
        isOwnProfile={isOwnProfile}
        person={person}
        account={account}
      />
      <AdminButtons
        formOfAddress={context.account.settings.profile.formOfAddress}
        person={person}
        account={account}
      />
      {!isOwnProfile ? (
        <Note t='schulhof.administration.sections.persons.details.buttons.actions.change-password.note' />
      ) : null}
    </>
  );
};

type AccountButtonsProps = Pick<PersonDetailsProps, 'person' | 'account'> & {
  formOfAddress: FormOfAddress;
  isOwnProfile: boolean;
};

const UserButtons = ({
  formOfAddress,
  isOwnProfile,
  person,
  account,
}: AccountButtonsProps) => {
  const personName = formatName(person);

  const buttons = [];

  if (account) {
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

  if (account) {
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

  if (account) {
    buttons.push(
      <DeleteAccountButton
        key='delete-account'
        formOfAddress={formOfAddress}
        isOwnProfile={isOwnProfile}
        personId={person.id}
        personName={personName}
      />
    );
  }

  if (!buttons.length) return null;

  return <ButtonGroup>{buttons}</ButtonGroup>;
};

type PersonButtonsProps = Pick<PersonDetailsProps, 'person' | 'account'> & {
  formOfAddress: FormOfAddress;
};

const AdminButtons = ({
  formOfAddress,
  person,
  account,
}: PersonButtonsProps) => {
  const buttons = [];

  buttons.push(<EditPersonButton key='edit-person' personId={person.id} />);

  buttons.push(<PermissionsButton key='permissions' personId={person.id} />);

  if (!account) {
    buttons.push(
      <CreateAccountButton key='create-account' personId={person.id} />
    );
  }

  buttons.push(
    <DeletePersonButton
      key='delete-person'
      formOfAddress={formOfAddress}
      personId={person.id}
      personName={formatName(person)}
      hasAccount={!!account}
    />
  );

  if (!buttons.length) return null;

  return <ButtonGroup>{buttons}</ButtonGroup>;
};
