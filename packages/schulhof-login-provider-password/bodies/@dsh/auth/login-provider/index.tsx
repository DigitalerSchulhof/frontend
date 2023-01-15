import { LoginProvider, useAuth } from '@dsh/auth/frontend';
import { useMutation, useQuery, useT } from '@dsh/core/frontend';
import { Alert } from '@dsh/ui/Alert';
import { Button } from '@dsh/ui/Button';
import { Form, FormRow } from '@dsh/ui/Form';
import { Heading } from '@dsh/ui/Heading';
import { LoadingModal, Modal } from '@dsh/ui/Modal';
import { Table, Tbody } from '@dsh/ui/Table';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LoginDocument, LoginErrorCode } from './login.query';

const PasswordLoginProvider: LoginProvider = ({ privacyNote }) => {
  const t = useT();

  const { setJWT } = useAuth();
  const [{ fetching: isLoading }, doLoginMutation] = useMutation(LoginDocument);

  const [errorCode, setError] = useState<LoginErrorCode | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const doLogin = useCallback(async () => {
    try {
      const res = await doLoginMutation({
        username: usernameRef.current!.value,
        password: passwordRef.current!.value,
      });

      if (!res.data) throw res;
      if (res.data.login.__typename === 'LoginResponseError') {
        setError(res.data.login.code);
        return;
      }

      setError(null);
      setJWT(res.data.login.jwt);
    } catch (e) {
      setError(LoginErrorCode.InternalError);
      return;
    }
  }, [doLoginMutation, usernameRef, passwordRef, setJWT]);

  const loadingComponent = useMemo(() => {
    if (!isLoading) return null;

    return (
      <LoadingModal
        title={t('@dsh/schulhof:login.modal.loading.title')}
        description={t('@dsh/schulhof:login.modal.loading.description')}
      />
    );
  }, [isLoading, t]);

  const errorComponent = useMemo(() => {
    if (!errorCode) return null;

    return (
      <Modal onClose={() => setError(null)}>
        <Alert variant="error">
          <Heading size="4">{t('@dsh/schulhof:login.modal.error.title')}</Heading>
          <p>{t('@dsh/schulhof:login.modal.error.description')}</p>
          <ul>
            {errorCode === LoginErrorCode.InternalError
              ? t('@dsh/core:errors.list.internal').map((s, i) => (
                  <li key={i}>{s}</li>
                ))
              : t('errors.invalidCredentials').map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
          </ul>
        </Alert>
        <Button onClick={() => setError(null)}>
          {t('@dsh/core:generic.back')}
        </Button>
      </Modal>
    );
  }, [errorCode, t]);

  return (
    <Form onSubmit={doLogin}>
      {loadingComponent ?? errorComponent}
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
