import { Button } from '#/ui/Button';
import { Variant } from '#/ui/variants';

export const IdentityTheftButton = () => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.change-personal-data.actions.identity-theft'
      variant={Variant.Warning}
      href={[
        'paths.schulhof',
        'paths.schulhof.account',
        'paths.schulhof.account.profile',
        'paths.schulhof.account.profile.identity-theft',
      ]}
    />
  );
};
