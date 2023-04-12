import { Button } from '#/ui/Button';

export const MessagePersonButton = ({ personId }: { personId: string }) => {
  return (
    <Button
      href={[
        'paths.schulhof',
        'paths.schulhof.account',
        'paths.schulhof.account.mailbox',
        'paths.schulhof.account.mailbox.compose',
        `{${personId}}}`,
      ]}
      t={
        'schulhof.administration.sections.persons.slices.persons.details.actions.write-message.button'
      }
    />
  );
};
