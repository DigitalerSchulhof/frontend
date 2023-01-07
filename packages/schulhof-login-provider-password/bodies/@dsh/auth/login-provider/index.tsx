import type { LoginProvider } from '@dsh/auth/frontend';
import { useMutation, useT } from '@dsh/core/frontend';
import { Button } from '@dsh/ui/Button';
import { Form, FormRow } from '@dsh/ui/Form';
import { Table, Tbody } from '@dsh/ui/Table';
import { useCallback, useRef } from 'react';
import { LoginDocument } from './login.query';

const PasswordLoginProvider: LoginProvider = ({ submitJwt, privacyNote }) => {
  const { t } = useT();

  const [, executeLoginMutation] = useMutation(LoginDocument);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const doLogin = useCallback(async () => {
    const res = await executeLoginMutation({
      username: usernameRef.current!.value,
      password: passwordRef.current!.value,
    });

    if (res.error || res.data?.login.__typename !== 'LoginResponseSuccess') {
      console.error(res.error ?? res.data);
      return;
    }

    submitJwt(res.data.login.jwt);
  }, [submitJwt, usernameRef, passwordRef, executeLoginMutation]);

  return (
    <Form onSubmit={doLogin}>
      <Table>
        <Tbody>
          <FormRow
            label="Benutzername:"
            autoComplete="username"
            ref={usernameRef}
          />
          <FormRow
            label="Passwort:"
            autoComplete="current-password"
            ref={passwordRef}
          />
        </Tbody>
      </Table>
      {privacyNote}
      <Button type="submit" variant="success">
        {t('@dsh/schulhof:login.buttons.login')}
      </Button>
      <Button>{t('@dsh/schulhof:login.buttons.password')}</Button>
      <Button>{t('@dsh/schulhof:login.buttons.register')}</Button>
    </Form>
  );
};

export default PasswordLoginProvider;
