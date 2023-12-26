import type { LoggedInBackendContext } from '#/context';
import type { Person } from '#/services/interfaces/person';
import { createButtonGroup } from '#/ui/Button';
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
        context={context}
        formOfAddress={context.formOfAddress}
        isOwnProfile={isOwnProfile}
        person={person}
      />
      <AdminButtons
        context={context}
        formOfAddress={context.formOfAddress}
        person={person}
      />
      {!isOwnProfile ? (
        <Note t='schulhof.administration.sections.persons.details.buttons.actions.change-password.note' />
      ) : null}
    </>
  );
};

/**
 * Buttons that a regular user can see on their own profile page.
 */
const UserButtons = async ({
  context,
  person,
  formOfAddress,
  isOwnProfile,
}: {
  context: LoggedInBackendContext;
  person: Person;
  formOfAddress: ClientFormOfAddress;
  isOwnProfile: boolean;
}) => {
  const mayEditAccountPromise = context.services.permission.hasPermission({
    checkIf: !!person.account,
    permission: 'schulhof.administration.edit-account',
    context: {
      person: person.id,
    },
  });

  const mayChangePasswordPromise = context.services.permission.hasPermission({
    checkIf: isOwnProfile,
    permission: 'schulhof.account.profile.change-password',
    context: {
      personId: person.id,
    },
  });

  const maySettingsPromise = context.services.permission.hasPermission({
    checkIf: !!person.account,
    permission: 'schulhof.administration.account-settings',
    context: {
      person: person.id,
    },
  });

  const mayReportIdentityTheftPromise =
    context.services.permission.hasPermission({
      checkIf: isOwnProfile,
      permission: 'schulhof.account.profile.report-identity-theft',
      context: {
        person: person.id,
      },
    });

  const mayDeleteAccountPromise = context.services.permission.hasPermission({
    checkIf: !!person.account,
    permission: 'schulhof.administration.persons.delete-account',
    context: {
      person: person.id,
    },
  });

  const [
    mayEditAccount,
    mayChangePassword,
    maySettings,
    mayReportIdentityTheft,
    mayDeleteAccount,
  ] = await Promise.all([
    mayEditAccountPromise,
    mayChangePasswordPromise,
    maySettingsPromise,
    mayReportIdentityTheftPromise,
    mayDeleteAccountPromise,
  ]);

  return createButtonGroup(
    mayEditAccount ? (
      <EditAccountButton
        key='edit-account'
        isOwnProfile={isOwnProfile}
        personId={person.id}
      />
    ) : null,
    mayChangePassword ? <ChangePasswordButton key='change-password' /> : null,
    maySettings ? (
      <SettingsButton
        key='settings'
        isOwnProfile={isOwnProfile}
        personId={person.id}
      />
    ) : null,
    mayReportIdentityTheft ? (
      <IdentityTheftButton key='report-identity-theft' />
    ) : null,
    mayDeleteAccount ? (
      <DeleteAccountButton
        key='delete-account'
        personId={person.id}
        personRev={person.rev}
        formOfAddress={formOfAddress}
        isOwnProfile={isOwnProfile}
        personName={formatName(person)}
      />
    ) : null
  );
};

/**
 * Buttons that an admin can see on any profile page.
 */
const AdminButtons = async ({
  context,
  person,
  formOfAddress,
}: {
  context: LoggedInBackendContext;
  person: Person;
  formOfAddress: ClientFormOfAddress;
}) => {
  const mayEditPersonPromise = context.services.permission.hasPermission({
    permission: 'schulhof.administration.persons.edit-person',
    context: {
      personId: person.id,
    },
  });

  // TODO
  const maySetPermissionsPromise = Promise.resolve(true);

  const mayCreateAccountPromise = context.services.permission.hasPermission({
    checkIf: !person.account,
    permission: 'schulhof.administration.persons.create-account',
    context: {
      personId: person.id,
    },
  });

  const mayDeletePersonPromise = context.services.permission.hasPermission({
    permission: 'schulhof.administration.persons.delete-person',
    context: {
      personId: person.id,
    },
  });

  const [mayEditPerson, maySetPermissions, mayCreateAccount, mayDeletePerson] =
    await Promise.all([
      mayEditPersonPromise,
      maySetPermissionsPromise,
      mayCreateAccountPromise,
      mayDeletePersonPromise,
    ]);

  return createButtonGroup(
    mayEditPerson ? (
      <EditPersonButton key='edit-person' personId={person.id} />
    ) : null,
    maySetPermissions ? (
      <PermissionsButton key='permissions' personId={person.id} />
    ) : null,
    mayCreateAccount ? (
      <CreateAccountButton key='create-account' personId={person.id} />
    ) : null,
    mayDeletePerson ? (
      <DeletePersonButton
        key='delete-person'
        personId={person.id}
        personRev={person.rev}
        formOfAddress={formOfAddress}
        personName={formatName(person)}
        hasAccount={!!person.account}
      />
    ) : null
  );
};
