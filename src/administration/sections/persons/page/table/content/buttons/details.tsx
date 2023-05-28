import { IconButton } from '#/ui/Button';
import { IconPersonActionDetails } from '#/ui/Icon';

export const DetailsButton = ({ personId }: { personId: string }) => {
  return (
    <IconButton
      title='schulhof.administration.sections.persons.page.table.actions.details'
      icon={
        <IconPersonActionDetails alt='schulhof.administration.sections.persons.page.table.actions.details' />
      }
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${personId}}`,
      ]}
    />
  );
};
