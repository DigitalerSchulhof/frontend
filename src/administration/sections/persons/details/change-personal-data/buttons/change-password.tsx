import { Button } from '#/ui/Button';

export const ChangePasswordButton = () => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.change-personal-data.actions.change-password.button'
      href={[
        'paths.schulhof',
        'paths.schulhof.account',
        'paths.schulhof.account.profile',
        'paths.schulhof.account.profile.change-password',
      ]}
    />
  );
};
