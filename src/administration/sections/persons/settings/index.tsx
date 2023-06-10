import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { PersonBase } from '#/backend/repositories/content/person';
import { MAX_SESSION_TIMEOUT } from '#/backend/validators/content/account';
import { EditAccountSettingsForm } from './form';

export type SettingsProps = {
  isOwnProfile?: boolean;
  person: WithId<PersonBase>;
  account: WithId<AccountBase>;
};

export const EditAccountSettings = async ({
  isOwnProfile = false,
  person,
  account,
}: SettingsProps) => {
  return (
    <EditAccountSettingsForm
      isOwnProfile={isOwnProfile}
      personId={person.id}
      settings={account.settings}
      maxSessionTimeout={MAX_SESSION_TIMEOUT}
    />
  );
};
