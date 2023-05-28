import { IconButton } from '#/ui/Button';
import { IconPersonActionEditPerson } from '#/ui/Icon';

export const EditPersonButton = ({ personId }: { personId: string }) => {
  return (
    <IconButton
      title='schulhof.administration.sections.persons.page.table.actions.edit.person'
      icon={
        <IconPersonActionEditPerson alt='schulhof.administration.sections.persons.page.table.actions.edit.person' />
      }
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${personId}}`,
        'paths.schulhof.administration.persons.edit-person',
      ]}
    />
  );
};
