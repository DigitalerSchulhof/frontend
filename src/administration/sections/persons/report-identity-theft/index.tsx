import type { Person } from '#/services/interfaces/person';
import { Button, ButtonGroup } from '#/ui/Button';
import { HiddenInput, TextFormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { ClientReportIdentityTheftForm } from './form';

export const ReportIdentityTheftForm = async ({
  isOwnProfile = false,
  person,
}: {
  isOwnProfile?: boolean;
  person: Person;
}) => {
  const own = isOwnProfile ? 'own' : 'other';

  return (
    <ClientReportIdentityTheftForm personId={person.id} own={own}>
      <HiddenInput name='personId' value={person.id} />
      <HiddenInput name='personRev' value={person.rev} />
      <Table>
        <TextFormRow
          label='schulhof.administration.sections.persons.report-identity-theft.form.old-password'
          name='oldPassword'
          autoComplete={isOwnProfile ? 'current-password' : undefined}
          type='password'
        />
        <TextFormRow
          label='schulhof.administration.sections.persons.report-identity-theft.form.new-password'
          name='newPassword'
          autoComplete={isOwnProfile ? 'new-password' : undefined}
          type='password'
        />
        <TextFormRow
          label='schulhof.administration.sections.persons.report-identity-theft.form.new-password-again'
          name='newPasswordAgain'
          autoComplete={isOwnProfile ? 'new-password' : undefined}
          type='password'
        />
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant='warning'
          t='schulhof.administration.sections.persons.report-identity-theft.form.buttons.submit'
        />
        {isOwnProfile ? (
          <Button
            href={[
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
              'paths.schulhof.account.profile.change-password',
            ]}
            t='schulhof.administration.sections.persons.report-identity-theft.form.buttons.change-password'
          />
        ) : null}
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
          t='schulhof.administration.sections.persons.report-identity-theft.form.buttons.back'
        />
      </ButtonGroup>
    </ClientReportIdentityTheftForm>
  );
};
