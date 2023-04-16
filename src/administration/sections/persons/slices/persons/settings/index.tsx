import { PersonSettings } from '#/backend/repositories/content/person';
import { MAX_SESSION_TIMEOUT } from '#/backend/validators/content/person';
import { SettingsForm } from './form';

export type SettingsProps = {
  isOwnProfile?: boolean;
  person: {
    id: string;
    settings: PersonSettings;
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
