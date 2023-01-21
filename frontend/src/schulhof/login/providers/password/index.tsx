import { useCallback, useMemo, useRef, useState } from 'react';
import { useMutation } from 'urql';
import { useT } from '../../../../i18n';
import { LoginProvider } from '../../../../pages/{paths.schulhof}/{paths.schulhof.login}';
import { Alert } from '../../../../ui/Alert';
import { Button } from '../../../../ui/Button';
import { Form, FormRow } from '../../../../ui/Form';
import { Heading } from '../../../../ui/Heading';
import { LoadingModal, Modal } from '../../../../ui/Modal';
import { Table, Tbody } from '../../../../ui/Table';
import { useAuth } from '../../../auth';
import { LoginPasswordDocument, LoginPasswordErrorCode } from './login.query';

export const PasswordLoginProvider: LoginProvider = ({ privacyNote }) => {
  const t = useT();

  const { setJWT } = useAuth();
  const [{ fetching: isLoading }, doLoginMutation] = useMutation(LoginPasswordDocument);

  const [errorCode, setError] = useState<LoginPasswordErrorCode | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const doLogin = useCallback(async () => {
    try {
      const res = await doLoginMutation({
        username: usernameRef.current!.value,
        password: passwordRef.current!.value,
      });

      if (!res.data) throw res;
      if (res.data.login.__typename === 'LoginPasswordResponseError') {
        setError(res.data.login.code);
        return;
      }

      setError(null);
      setJWT(res.data.login.jwt);
    } catch (e) {
      setError(LoginPasswordErrorCode.InternalError);
      return;
    }
  }, [doLoginMutation, usernameRef, passwordRef, setJWT]);

  const loadingComponent = useMemo(() => {
    if (!isLoading) return null;

    return (
      <LoadingModal
        title={t('schulhof.login.modal.loading.title')}
        description={t('schulhof.login.modal.loading.description')}
      />
    );
  }, [isLoading, t]);

  const errorComponent = useMemo(() => {
    if (!errorCode) return null;

    return (
      <Modal onClose={() => setError(null)}>
        <Alert variant="error">
          <Heading size="4">{t('schulhof.login.modal.error.title')}</Heading>
          <p>{t('schulhof.login.modal.error.description')}</p>
          <ul>
            {errorCode === LoginPasswordErrorCode.InternalError
              ? t('schulhof.login.modal.error.codes.internal').map((s, i) => (
                  <li key={i}>{s}</li>
                ))
              : t('schulhof.login.modal.error.codes.invalidCredentials').map(
                  (s, i) => <li key={i}>{s}</li>
                )}
          </ul>
        </Alert>
        <Button onClick={() => setError(null)}>{t('generic.back')}</Button>
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
        {t('schulhof.login.login.buttons.login')}
      </Button>
      <Button>{t('schulhof.login.login.buttons.password')}</Button>
      <Button>{t('schulhof.login.login.buttons.register')}</Button>
    </Form>
  );
};
