import { IconButton } from '#/ui/Button';
import { IconPersonActionPermissions } from '#/ui/Icon';

export const PermissionsButton = ({ personId }: { personId: string }) => {
  return (
    <IconButton
      title='schulhof.administration.sections.persons.page.table.actions.permissions'
      icon={
        <IconPersonActionPermissions alt='schulhof.administration.sections.persons.page.table.actions.permissions' />
      }
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
