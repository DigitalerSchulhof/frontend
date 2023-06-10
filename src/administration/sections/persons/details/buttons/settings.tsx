import { Button } from '#/ui/Button';

export const SettingsButton = ({
  isOwnProfile,
  personId,
}: {
  isOwnProfile: boolean;
  personId: string;
}) => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.buttons.actions.settings'
      href={
        isOwnProfile
          ? [
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
              'paths.schulhof.account.profile.settings',
            ]
          : [
              'paths.schulhof',
              'paths.schulhof.administration',
              'paths.schulhof.administration.persons',
              `{${personId}}`,
              'paths.schulhof.administration.persons.settings',
            ]
      }
    />
  );
};
