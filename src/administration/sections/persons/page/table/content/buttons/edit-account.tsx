import { IconButton } from '#/ui/Button';
import { IconPersonActionEditAccount } from '#/ui/Icon';

export const EditAccountButton = ({ personId }: { personId: string }) => {
  return (
    <IconButton
      title='schulhof.administration.sections.persons.page.table.actions.edit.account'
      icon={
        <IconPersonActionEditAccount alt='schulhof.administration.sections.persons.page.table.actions.edit.account' />
      }
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${personId}}`,
        'paths.schulhof.administration.persons.edit-account',
      ]}
    />
  );
};
