import type { Person } from '#/services/interfaces/person';
import { Button, ButtonGroup } from '#/ui/Button';
import { HiddenInput, TextFormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { ClientChangePasswordForm } from './form';

export const ChangePasswordForm = ({
  isOwnProfile = false,
  person,
}: {
  isOwnProfile?: boolean;
  person: Person;
}) => {
  const own = isOwnProfile ? 'own' : 'other';

  return (
    <ClientChangePasswordForm personId={person.id} own={own}>
      <HiddenInput name='personId' value={person.id} />
      <HiddenInput name='personRev' value={person.rev} />
      <Table>
        <TextFormRow
          label='schulhof.administration.sections.persons.change-password.form.old-password'
          name='oldPassword'
          autoComplete='current-password'
          type='password'
        />
        <TextFormRow
          label='schulhof.administration.sections.persons.change-password.form.new-password'
          name='newPassword'
          autoComplete='new-password'
          type='password'
        />
        <TextFormRow
          label='schulhof.administration.sections.persons.change-password.form.new-password-again'
          name='newPasswordAgain'
          autoComplete='new-password'
          type='password'
        />
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant='success'
          t='schulhof.administration.sections.persons.change-password.form.buttons.submit'
        />
        <Button
          href={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
          ]}
          t='schulhof.administration.sections.persons.change-password.form.buttons.back'
        />
      </ButtonGroup>
    </ClientChangePasswordForm>
  );
};
