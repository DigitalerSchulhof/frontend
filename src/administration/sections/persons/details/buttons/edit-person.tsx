import { Button } from '#/ui/Button';

export const EditPersonButton = ({ personId }: { personId: string }) => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.buttons.actions.edit-person'
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
