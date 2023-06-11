import { requireNoLogin } from '#/auth/component';
import { T } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { TextFormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { ForgotPasswordForm } from './form';

export default async function Page() {
  await requireNoLogin();

  return (
    <ForgotPasswordForm>
      <Table>
        <TextFormRow
          label='schulhof.login.actions.forgot-password.form.username'
          name='username'
          autoComplete='username'
        />
        <TextFormRow
          label='schulhof.login.actions.forgot-password.form.email'
          name='email'
          autoComplete='email'
        />
      </Table>
      <Alert
        variant='information'
        title='schulhof.login.actions.forgot-password.info.title'
      >
        <p>
          <T t='schulhof.login.actions.forgot-password.info.content' />
        </p>
      </Alert>
      <ButtonGroup>
        <Button
          type='submit'
          variant='success'
          t='schulhof.login.actions.forgot-password.form.buttons.send'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.login']}
          t='schulhof.login.actions.forgot-password.form.buttons.login'
        />
      </ButtonGroup>
    </ForgotPasswordForm>
  );
}
