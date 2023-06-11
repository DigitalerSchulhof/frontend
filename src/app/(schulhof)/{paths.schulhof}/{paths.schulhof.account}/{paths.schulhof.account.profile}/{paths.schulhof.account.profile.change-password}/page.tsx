import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { ButtonGroup, Button } from '#/ui/Button';
import { Col } from '#/ui/Col';
import { HiddenInput, TextFormRow } from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import { Table } from '#/ui/Table';
import { ChangePasswordForm } from './form';

export default async function Page() {
  const context = await requireLogin();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.change-password',
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.change-password.title' />
      </Col>
      <Col w='12'>
        <ChangePasswordForm>
          <HiddenInput name='rev' value={context.account.rev} />
          <Table>
            <TextFormRow
              label='schulhof.account.profile.change-password.form.old-password'
              name='oldPassword'
              autoComplete='current-password'
              type='password'
            />
            <TextFormRow
              label='schulhof.account.profile.change-password.form.new-password'
              name='newPassword'
              autoComplete='new-password'
              type='password'
            />
            <TextFormRow
              label='schulhof.account.profile.change-password.form.new-password-again'
              name='newPasswordAgain'
              autoComplete='new-password'
              type='password'
            />
          </Table>
          <ButtonGroup>
            <Button
              type='submit'
              variant='success'
              t='schulhof.account.profile.change-password.form.buttons.submit'
            />
            <Button
              href={[
                'paths.schulhof',
                'paths.schulhof.account',
                'paths.schulhof.account.profile',
              ]}
              t='schulhof.account.profile.change-password.form.buttons.back'
            />
          </ButtonGroup>
        </ChangePasswordForm>
      </Col>
    </>
  );
}
