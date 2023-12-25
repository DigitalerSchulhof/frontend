import { Button } from '#/ui/Button';

export const IdentityTheftButton = ({
  isOwnProfile,
  personId,
}: {
  isOwnProfile: boolean;
  personId: string;
}) => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.buttons.actions.report-identity-theft'
      variant='warning'
      href={
        isOwnProfile
          ? [
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
              'paths.schulhof.account.profile.report-identity-theft',
            ]
          : [
              'paths.schulhof',
              'paths.schulhof.administration',
              'paths.schulhof.administration.persons',
              `{${personId}}`,
              'paths.schulhof.administration.persons.report-identity-theft',
            ]
      }
    />
  );
};
