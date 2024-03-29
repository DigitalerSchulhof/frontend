import { Button } from '#/ui/Button';

export const IdentityTheftButton = () => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.buttons.actions.report-identity-theft'
      variant='warning'
      href={[
        'paths.schulhof',
        'paths.schulhof.account',
        'paths.schulhof.account.profile',
        'paths.schulhof.account.profile.report-identity-theft',
      ]}
    />
  );
};
