'use client';

import {
  ForgotPasswordInput,
  ForgotPasswordOutputNotOk,
  ForgotPasswordOutputOk,
} from '#/app/api/schulhof/auth/forgot-password/route';
import { FormOfAddress } from '#/backend/repositories/content/account';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { ErrorWithPayload, sleep } from '#/utils';
import { useCallback, useMemo, useRef, useState } from 'react';

enum FormState {
  Idle,
  Loading,
  Error,
  Success,
}

export enum FormError {
  InternalError = 'internal-error',
  InvalidCredentials = 'invalid-credentials',
}

export const ForgotPasswordForm = () => {
  const [formState, setFormState] = useState<FormState>(FormState.Idle);
  const [formErrors, setFormErrors] = useState<readonly FormError[]>([]);

  const [formOfAddress, setFormOfAddress] = useState<
    FormOfAddress | undefined
  >();

  const usernameRef = useRef<{ value: string }>(null);
  const emailRef = useRef<{ value: string }>(null);

  const sendForgotPassword = useSendForgotPassword(
    usernameRef,
    emailRef,
    setFormState,
    setFormErrors,
    useCallback(
      (res: ForgotPasswordOutputOk) => {
        setFormOfAddress(res.formOfAddress);
      },
      [setFormOfAddress]
    )
  );

  const modal = useForgotPasswordStateModal(
    formOfAddress,
    emailRef,
    formState,
    formErrors,
    setFormState
  );

  return (
    <Form onSubmit={sendForgotPassword}>
      {modal}
      <Table>
        <TextFormRow
          label='schulhof.login.actions.forgot-password.form.username'
          autoComplete='username'
          ref={usernameRef}
        />
        <TextFormRow
          label='schulhof.login.actions.forgot-password.form.email'
          autoComplete='email'
          ref={emailRef}
        />
      </Table>
      <Alert
        variant={Variant.Information}
        title='schulhof.login.actions.forgot-password.info.title'
      >
        <p>
          <T t='schulhof.login.actions.forgot-password.info.content' />
        </p>
      </Alert>
      <ButtonGroup>
        <Button
          type='submit'
          variant={Variant.Success}
          t='schulhof.login.actions.forgot-password.form.buttons.send'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.login']}
          t='schulhof.login.actions.forgot-password.form.buttons.login'
        />
      </ButtonGroup>
    </Form>
  );
};

function useSendForgotPassword(
  usernameRef: React.RefObject<{ value: string }>,
  emailRef: React.RefObject<{ value: string }>,
  setFormState: (s: FormState) => void,
  setFormErrors: (e: readonly FormError[]) => void,
  onSuccess: (jwt: ForgotPasswordOutputOk) => void
) {
  const log = useLog();

  return useCallback(
    async function sendForgotPassword() {
      setFormState(FormState.Loading);

      const username = usernameRef.current!.value;
      const email = emailRef.current!.value;

      const [res] = await Promise.all([
        fetch('/api/schulhof/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
          } satisfies ForgotPasswordInput),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        const bodyString = await res.text();
        setFormState(FormState.Error);
        let body: ForgotPasswordOutputNotOk;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          setFormErrors([FormError.InternalError]);
          if (e instanceof SyntaxError) {
            log.error('Unknown error while sending forgot password link', {
              username,
              email,
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

      const body: ForgotPasswordOutputOk = await res.json();

      setFormState(FormState.Success);
      onSuccess(body);
    },
    [usernameRef, emailRef, setFormState, setFormErrors, onSuccess, log]
  );
}

function useForgotPasswordStateModal(
  formOfAddress: FormOfAddress | undefined,
  emailRef: React.RefObject<{ value: string }>,
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
            title='schulhof.login.actions.forgot-password.modals.loading.title'
            description='schulhof.login.actions.forgot-password.modals.loading.description'
          />
        );
      case FormState.Error: {
        const errorReasons = formErrors.flatMap((err) =>
          t(
            `schulhof.login.actions.forgot-password.modals.error.reasons.${err}`
          )
        );

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Error}
              title='schulhof.login.actions.forgot-password.modals.error.title'
            >
              <p>
                <T t='schulhof.login.actions.forgot-password.modals.error.description' />
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
      case FormState.Success:
        if (!formOfAddress) {
          throw new ErrorWithPayload(
            'FormState.Success but formOfAddress is undefined',
            {
              formOfAddress,
            }
          );
        }

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Success}
              title='schulhof.login.actions.forgot-password.modals.success.title'
            >
              <p>
                <T
                  t='schulhof.login.actions.forgot-password.modals.success.description'
                  args={{
                    email: emailRef.current!.value,
                    form_of_address: formOfAddress,
                  }}
                />
              </p>
            </Alert>
            <ButtonGroup>
              <Button
                href={['paths.schulhof', 'paths.schulhof.login']}
                t='schulhof.login.actions.forgot-password.modals.success.button'
              />
            </ButtonGroup>
          </Modal>
        );
    }
  }, [formOfAddress, emailRef, state, formErrors, setIdle, t]);
}
