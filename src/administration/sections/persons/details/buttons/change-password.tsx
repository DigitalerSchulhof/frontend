import { Button } from '#/ui/Button';

export const ChangePasswordButton = ({
  isOwnProfile,
  personId,
}: {
  isOwnProfile: boolean;
  personId: string;
}) => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.buttons.actions.change-password'
      href={
        isOwnProfile
          ? [
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
              'paths.schulhof.account.profile.change-password',
            ]
          : [
              'paths.schulhof',
              'paths.schulhof.administration',
              'paths.schulhof.administration.persons',
              `{${personId}}`,
              'paths.schulhof.administration.persons.change-password',
            ]
      }
    />
  );
};
