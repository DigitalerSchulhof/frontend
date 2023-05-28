import { IconButton } from '#/ui/Button';
import { IconPersonActionCreateAccount } from '#/ui/Icon';

export const CreateAccountButton = ({ personId }: { personId: string }) => {
  return (
    <IconButton
      key='create-account'
      title='schulhof.administration.sections.persons.page.table.actions.create-account'
      variant='success'
      icon={
        <IconPersonActionCreateAccount alt='schulhof.administration.sections.persons.page.table.actions.create-account' />
      }
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${personId}}`,
        'paths.schulhof.administration.persons.create-account',
      ]}
    />
  );
};
