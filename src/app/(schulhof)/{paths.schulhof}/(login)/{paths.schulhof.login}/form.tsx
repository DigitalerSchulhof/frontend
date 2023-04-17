'use client';

import {
  LoginInput,
  LoginOutputNotOk,
  LoginOutputOk,
} from '#/app/api/schulhof/auth/login/route';
import { T, makeLink } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, FormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Note } from '#/ui/Note';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { sleep } from '#/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

enum FormState {
  Idle,
  Loading,
  Error,
}

export enum FormError {
  InternalError = 'internal-error',
  InvalidCredentials = 'invalid-credentials',
}

export const LoginForm = () => {
  const { t } = useT();
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>(FormState.Idle);
  const [formErrors, setFormErrors] = useState<readonly FormError[]>([]);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const sendLogin = useSendLogin(
    usernameRef,
    passwordRef,
    setFormState,
    setFormErrors,
    useCallback(
      (res: LoginOutputOk) => {
        Cookies.set('jwt', res.jwt);
        router.push(
          `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
        );
      },
      [router, t]
    )
  );

  const modal = useLoginStateModal(formState, formErrors, setFormState);

  return (
    <Form onSubmit={sendLogin}>
      {modal}
      <Table>
        <FormRow
          label='schulhof.login.actions.login.form.username'
          autoComplete='username'
          ref={usernameRef}
        />
        <FormRow
          label='schulhof.login.actions.login.form.password'
          autoComplete='current-password'
          type='password'
          ref={passwordRef}
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
          variant={Variant.Success}
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
    </Form>
  );
};

function useSendLogin(
  usernameRef: React.RefObject<HTMLInputElement>,
  passwordRef: React.RefObject<HTMLInputElement>,
  setFormState: (s: FormState) => void,
  setFormErrors: (e: readonly FormError[]) => void,
  onSuccess: (jwt: LoginOutputOk) => void
) {
  const log = useLog();

  return useCallback(
    async function sendLogin() {
      const username = usernameRef.current!.value;
      const password = passwordRef.current!.value;

      setFormState(FormState.Loading);

      const [res] = await Promise.all([
        fetch('/api/schulhof/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          } satisfies LoginInput),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        const bodyString = await res.text();
        setFormState(FormState.Error);
        let body: LoginOutputNotOk;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          setFormErrors([FormError.InternalError]);
          if (e instanceof SyntaxError) {
            log.error('Unknown error while logging in', {
              username,
              status: res.status,
              body: bodyString,
            });
            return;
          }

          throw e;
        }

        const errors: FormError[] = [];
        for (const error of body.errors) {
          switch (error.code) {
            case 'INVALID_CREDENTIALS':
              errors.push(FormError.InvalidCredentials);
              break;
            default:
              if (!errors.includes(FormError.InternalError)) {
                errors.push(FormError.InternalError);
              }

              log.error('Unknown error while logging in', {
                username,
                status: res.status,
                body,
                code: error.code,
              });
              break;
          }
        }

        setFormErrors(errors);
        return;
      }

      onSuccess(await res.json());
    },
    [usernameRef, passwordRef, setFormState, setFormErrors, onSuccess, log]
  );
}

function useLoginStateModal(
  state: FormState,
  formErrors: readonly FormError[],
  setFormState: (s: FormState) => void
) {
  const { t } = useT();

  const setIdle = useCallback(
    () => setFormState(FormState.Idle),
    [setFormState]
  );

  return useMemo(() => {
    switch (state) {
      case FormState.Idle:
        return null;
      case FormState.Loading:
        return (
          <LoadingModal
            title='schulhof.login.actions.login.modals.loading.title'
            description='schulhof.login.actions.login.modals.loading.description'
          />
        );
      case FormState.Error: {
        const errorReasons = formErrors.flatMap((err) =>
          t(`schulhof.login.actions.login.modals.error.reasons.${err}`)
        );

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Error}
              title='schulhof.login.actions.login.modals.error.title'
            >
              <p>
                <T t='schulhof.login.actions.login.modals.error.description' />
              </p>
              <ul>
                {errorReasons.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Alert>
            <ButtonGroup>
              <Button onClick={setIdle} t='generic.back' />
            </ButtonGroup>
          </Modal>
        );
      }
    }
  }, [state, formErrors, setIdle, t]);
}
