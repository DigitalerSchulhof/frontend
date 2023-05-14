import { AccountSettings } from '#/backend/repositories/content/account';
import { MAX_SESSION_TIMEOUT } from '#/backend/validators/content/account';
import { EditAccountSettingsForm } from './form';

export type SettingsProps = {
  isOwnProfile?: boolean;
  person: {
    id: string;
  };
  account: {
    settings: AccountSettings;
  };
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
