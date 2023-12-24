import type { Person } from '#/services/interfaces/person';
import { Button, ButtonGroup } from '#/ui/Button';
import { HiddenInput, TextFormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { ClientAccountForm } from './form';

export const AccountForm = ({
  isOwnProfile = false,
  person,
}: {
  isOwnProfile?: boolean;
  person: Person;
}) => {
  const mode = person.account === null ? 'create' : 'edit';
  const own = isOwnProfile ? 'own' : 'other';

  const { username = '', email = '' } = person.account ?? {};

  return (
    <ClientAccountForm personId={person.id} own={own} mode={mode}>
      <HiddenInput name='personId' value={person.id} />
      <HiddenInput name='personRev' value={person.rev} />
      <HiddenInput name='mode' value={mode} />
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
