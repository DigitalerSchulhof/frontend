import { Button } from '#/ui/Button';

export const CreateAccountButton = ({ personId }: { personId: string }) => {
  return (
    <Button
      t='schulhof.administration.sections.persons.details.change-personal-data.actions.create-account'
      variant='success'
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
