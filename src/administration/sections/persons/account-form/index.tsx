import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { PersonBase } from '#/backend/repositories/content/person';
import { ButtonGroup, Button } from '#/ui/Button';
import { HiddenInput, TextFormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { ClientAccountForm } from './form';

export const AccountForm = ({
  isOwnProfile = false,
  person,
  account,
}: {
  isOwnProfile?: boolean;
  person: WithId<PersonBase>;
  account: WithId<AccountBase> | null;
}) => {
  const mode = account === null ? 'create' : 'edit';
  const own = isOwnProfile ? 'own' : 'other';

  const { username = '', email = '' } = account ?? {};

  return (
    <ClientAccountForm personId={person.id} own={own} mode={mode}>
      <HiddenInput name='personId' value={person.id} />
      <HiddenInput name='personRev' value={person.rev} />
      <HiddenInput name='accountRev' value={account?.rev} />
      <Table>
        <TextFormRow
          label={`schulhof.administration.sections.persons.${mode}-account.form.username`}
          name='username'
          autoComplete='username'
          defaultValue={username}
        />
        <TextFormRow
          label={`schulhof.administration.sections.persons.${mode}-account.form.email`}
          name='email'
          autoComplete='email'
          defaultValue={email}
        />
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant='success'
          t={`schulhof.administration.sections.persons.${mode}-account.form.buttons.save`}
        />
        <Button
          href={
            isOwnProfile
              ? [
                  'paths.schulhof',
                  'paths.schulhof.account',
                  'paths.schulhof.account.profile',
                ]
              : [
                  'paths.schulhof',
                  'paths.schulhof.administration',
                  'paths.schulhof.administration.persons',
                  `{${person.id}}`,
                ]
          }
          t={`schulhof.administration.sections.persons.${mode}-account.form.buttons.back.${own}`}
        />
      </ButtonGroup>
    </ClientAccountForm>
  );
};
