import { AccountSettings } from '#/backend/repositories/content/account';
import { MAX_SESSION_TIMEOUT } from '#/backend/validators/content/account';
import { SettingsForm } from './form';

export type SettingsProps = {
  isOwnProfile?: boolean;
  person: {
    id: string;
    settings: AccountSettings;
  };
};

export const Settings = async ({
  isOwnProfile = false,
  person,
}: SettingsProps) => {
  return (
    <SettingsForm
      isOwnProfile={isOwnProfile}
      personId={person.id}
      settings={person.settings}
      maxSessionTimeout={MAX_SESSION_TIMEOUT}
    />
  );
};
