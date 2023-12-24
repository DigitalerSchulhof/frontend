import { makeLink, useT } from '#/i18n';
import { Button, ButtonGroup } from '#/ui/Button';
import { TextFormRow } from '#/ui/Form';
import { Note } from '#/ui/Note';
import { Table } from '#/ui/Table';
import { LoginForm } from './form';

export default async function Page() {
  const { t } = useT();

  return (
    <LoginForm>
      <Table>
        <TextFormRow
          label='schulhof.login.actions.login.form.username'
          name='username'
          autoComplete='username'
        />
        <TextFormRow
          label='schulhof.login.actions.login.form.password'
          name='password'
          autoComplete='current-password'
          type='password'
        />
      </Table>
      {t('schulhof.login.actions.login.privacy', {
        PrivacyLink: makeLink(['paths.privacy']),
      }).map((s, i) => (
        <Note key={i}>{s}</Note>
      ))}
      <ButtonGroup>
        <Button
          type='submit'
          variant='success'
          t='schulhof.login.actions.login.form.buttons.login'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.forgot-password']}
          t='schulhof.login.actions.login.form.buttons.forgot-password'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.register']}
          t='schulhof.login.actions.login.form.buttons.register'
        />
      </ButtonGroup>
    </LoginForm>
  );
}
