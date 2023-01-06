import type { LoginProvider } from '@dsh/auth/frontend';
import { useT } from '@dsh/core';
import { Button } from '@dsh/ui/Button';
import { Form, FormRow } from '@dsh/ui/Form';
import { Table, Tbody } from '@dsh/ui/Table';
import React, { useCallback, useRef } from 'react';

const PasswordLoginProvider: LoginProvider = ({ submitJwt, privacyNote }) => {
  const { t } = useT();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const doLogin = useCallback(() => {
    if (!usernameRef.current?.value || !passwordRef.current?.value)
      return alert('invalid sth');

      submitJwt(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5MCwiaWF0IjoxNTE2MjM5MDIyfQ.8GgICY6THm6B1FR-zwd3Z6nsVMPVFeupuks_Jy8lqNw'
    );
  }, [submitJwt, usernameRef, passwordRef]);

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
