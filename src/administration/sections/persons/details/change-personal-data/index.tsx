import { FormOfAddress } from '#/backend/repositories/content/account';
import { LoggedInBackendContext } from '#/context';
import { ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Note } from '#/ui/Note';
import { formatName } from '#/utils';
import { PersonDetailsProps } from '..';
import {
  ChangePasswordButton,
  CreateAccountButton,
  DeleteAccountButton,
  DeletePersonButton,
  EditAccountButton,
  EditPersonButton,
  IdentityTheftButton,
  PermissionsButton,
  SettingsButton,
} from './buttons';

export type PersonDetailsChangePersonalDataSectionProps = Pick<
  PersonDetailsProps,
  'person' | 'account'
> & {
  context: LoggedInBackendContext;
  isOwnProfile: boolean;
};

export const PersonDetailsChangePersonalDataSection = ({
  context,
  isOwnProfile,
  person,
  account,
}: PersonDetailsChangePersonalDataSectionProps) => {
  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.details.change-personal-data.title'
      />
      <UserButtons
        formOfAddress={context.account.formOfAddress}
        isOwnProfile={isOwnProfile}
        person={person}
        account={account}
      />
      <AdminButtons
        formOfAddress={context.account.formOfAddress}
        person={person}
        account={account}
      />
      {!isOwnProfile ? (
        <Note t='schulhof.administration.sections.persons.details.change-personal-data.actions.change-password.note' />
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

  // Since these are the user's buttons, all of these must in some way or another depend on `isOwnProfile`.

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
