import { Button } from '#/ui/Button';

export const EditAccountButton = ({
  isOwnProfile,
  personId,
}: {
  isOwnProfile: boolean;
  personId: string;
}) => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.change-personal-data.actions.edit-account'
      href={
        isOwnProfile
          ? [
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
              'paths.schulhof.account.profile.edit-account',
            ]
          : [
              'paths.schulhof',
              'paths.schulhof.administration',
              'paths.schulhof.administration.persons',
              `{${personId}}`,
              'paths.schulhof.administration.persons.edit-account',
            ]
      }
    />
  );
};
