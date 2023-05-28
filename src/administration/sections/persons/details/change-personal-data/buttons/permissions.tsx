import { Button } from '#/ui/Button';

export const PermissionsButton = ({ personId }: { personId: string }) => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.change-personal-data.actions.permissions'
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${personId}}`,
        'paths.schulhof.administration.persons.permissions',
      ]}
    />
  );
};
