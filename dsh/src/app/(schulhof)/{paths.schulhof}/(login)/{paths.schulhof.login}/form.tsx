'use client';

import { T, makeLink } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button } from '#/ui/Button';
import { Form, FormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Note } from '#/ui/Note';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { sleep } from '#/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

enum LoginState {
  Idle = 'idle',
  Loading = 'loading',
  InternalError = 'internal-error',
  InvalidCredentials = 'invalid-credentials',
}

export const LoginForm = () => {
  const { t } = useT();
  const router = useRouter();

  const [loginState, setLoginState] = useState<LoginState>(LoginState.Idle);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const sendLogin = useSendLogin(
    usernameRef,
    passwordRef,
    setLoginState,
    useCallback(
      (jwt: string) => {
        Cookies.set('jwt', jwt);
        router.refresh();
      },
      [router]
    )
  );

  const modal = useLoginStateModal(loginState, setLoginState);

  return (
    <Form onSubmit={sendLogin}>
      {modal}
      <Table>
        <Table.Body>
          <FormRow
            label='schulhof.login.action.login.form.username'
            autoComplete='username'
            ref={usernameRef}
          />
          <FormRow
            label='schulhof.login.action.login.form.password'
            autoComplete='current-password'
            type='password'
            ref={passwordRef}
          />
        </Table.Body>
      </Table>
      {t('schulhof.login.action.login.privacy', {
        PrivacyLink: makeLink(['paths.privacy']),
      }).map((s, i) => (
        <Note key={i}>{s}</Note>
      ))}
      <div>
        <Button
          type='submit'
          variant={Variant.Success}
          t='schulhof.login.action.login.buttons.login'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.forgot-password']}
          t='schulhof.login.action.login.buttons.forgot-password'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.register']}
          t='schulhof.login.action.login.buttons.register'
        />
      </div>
    </Form>
  );
};

function useSendLogin(
  usernameRef: React.RefObject<HTMLInputElement>,
  passwordRef: React.RefObject<HTMLInputElement>,
  setLoginState: (s: LoginState) => void,
  onLoginSuccess: (jwt: string) => void
) {
  const log = useLog();

  return useCallback(
    async function sendLogin() {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      setLoginState(LoginState.Loading);

      const [res] = await Promise.all([
        fetch('/api/schulhof/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        if (res.status === 401) {
          setLoginState(LoginState.InvalidCredentials);
          return;
        }

        log.error('Error while logging in', {
          username,
          status: res.status,
          body: await res.text(),
        });

        setLoginState(LoginState.InternalError);
        return;
      }

      const body = await res.json();

      onLoginSuccess(body.jwt);
    },
    [usernameRef, passwordRef, setLoginState, onLoginSuccess, log]
  );
}

function useLoginStateModal(
  state: LoginState,
  setLoginState: (s: LoginState) => void
) {
  const { t } = useT();

  const setIdle = useCallback(
    () => setLoginState(LoginState.Idle),
    [setLoginState]
  );

  return useMemo(() => {
    switch (state) {
      case LoginState.Idle:
        return null;
      case LoginState.Loading:
        return (
          <LoadingModal
            title='schulhof.login.action.forgot-password.modal.loading.title'
            description='schulhof.login.action.forgot-password.modal.loading.description'
          />
        );
      case LoginState.InternalError:
      case LoginState.InvalidCredentials: {
        const errorReasons = t(
          `schulhof.login.action.forgot-password.modal.error.reasons.${state}`
        );

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Error}
              title='schulhof.login.action.forgot-password.modal.error.title'
            >
              <p>
                <T t='schulhof.login.action.forgot-password.modal.error.description' />
              </p>
              <ul>
                {errorReasons.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Alert>
            <Button onClick={setIdle} t='generic.back' />
          </Modal>
        );
      }
    }
  }, [state, setIdle, t]);
}
