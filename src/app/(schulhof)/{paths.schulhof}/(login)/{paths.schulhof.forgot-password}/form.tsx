'use client';

import { FormOfAddress } from '#/backend/repositories/content/person';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, FormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { ErrorWithPayload, sleep } from '#/utils';
import { useCallback, useMemo, useRef, useState } from 'react';

enum ForgotPasswordState {
  Idle = 'idle',
  Loading = 'loading',
  InternalError = 'internal-error',
  InvalidCredentials = 'invalid-credentials',
  Success = 'success',
}

export const ForgotPasswordForm = () => {
  const [forgotPasswordState, setForgotPasswordState] =
    useState<ForgotPasswordState>(ForgotPasswordState.Idle);

  const [formOfAddress, setFormOfAddress] = useState<
    FormOfAddress | undefined
  >();

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const sendForgotPassword = useSendForgotPassword(
    usernameRef,
    emailRef,
    setForgotPasswordState,
    setFormOfAddress
  );

  const modal = useForgotPasswordStateModal(
    forgotPasswordState,
    setForgotPasswordState,
    emailRef,
    formOfAddress
  );

  return (
    <Form onSubmit={sendForgotPassword}>
      {modal}
      <Table>
        <Table.Body>
          <FormRow
            label='schulhof.login.action.forgot-password.form.username'
            autoComplete='username'
            ref={usernameRef}
          />
          <FormRow
            label='schulhof.login.action.forgot-password.form.email'
            autoComplete='email'
            ref={emailRef}
          />
        </Table.Body>
      </Table>
      <Alert
        variant={Variant.Information}
        title='schulhof.login.action.forgot-password.info.title'
      >
        <p>
          <T t='schulhof.login.action.forgot-password.info.content' />
        </p>
      </Alert>
      <ButtonGroup>
        <Button
          type='submit'
          variant={Variant.Success}
          t='schulhof.login.action.forgot-password.buttons.send'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.login']}
          t='schulhof.login.action.forgot-password.buttons.login'
        />
      </ButtonGroup>
    </Form>
  );
};

function useSendForgotPassword(
  usernameRef: React.RefObject<HTMLInputElement>,
  emailRef: React.RefObject<HTMLInputElement>,
  setForgotPasswordState: (s: ForgotPasswordState) => void,
  setFormOfAddress: (s: FormOfAddress | undefined) => void
) {
  const log = useLog();

  return useCallback(
    async function sendForgotPassword() {
      const username = usernameRef.current!.value;
      const email = emailRef.current!.value;

      setForgotPasswordState(ForgotPasswordState.Loading);

      const [res] = await Promise.all([
        fetch('/api/schulhof/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
          }),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        const bodyString = await res.text();
        let body;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          if (e instanceof SyntaxError) {
            setForgotPasswordState(ForgotPasswordState.InternalError);
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

        switch (body.code) {
          case 'invalid-credentials':
            setForgotPasswordState(ForgotPasswordState.InvalidCredentials);
            return;
          default:
            setForgotPasswordState(ForgotPasswordState.InternalError);
            log.error('Unknown error while sending forgot password link', {
              username,
              email,
              status: res.status,
              body,
            });
            return;
        }
      }

      const body = await res.json();

      setFormOfAddress(body.formOfAddress);
      setForgotPasswordState(ForgotPasswordState.Success);
    },
    [usernameRef, emailRef, setFormOfAddress, setForgotPasswordState, log]
  );
}

function useForgotPasswordStateModal(
  state: ForgotPasswordState,
  setForgotPasswordState: (s: ForgotPasswordState) => void,
  emailRef: React.RefObject<HTMLInputElement>,
  formOfAddress: FormOfAddress | undefined
) {
  const { t } = useT();

  const setIdle = useCallback(
    () => setForgotPasswordState(ForgotPasswordState.Idle),
    [setForgotPasswordState]
  );

  return useMemo(() => {
    switch (state) {
      case ForgotPasswordState.Idle:
        return null;
      case ForgotPasswordState.Loading:
        return (
          <LoadingModal
            title='schulhof.login.action.forgot-password.modal.loading.title'
            description='schulhof.login.action.forgot-password.modal.loading.description'
          />
        );
      case ForgotPasswordState.InternalError:
      case ForgotPasswordState.InvalidCredentials: {
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
            <ButtonGroup>
              <Button onClick={setIdle} t='generic.back' />
            </ButtonGroup>
          </Modal>
        );
      }
      case ForgotPasswordState.Success:
        if (!formOfAddress) {
          throw new ErrorWithPayload(
            'ForgotPasswordState.Success but formOfAddress is undefined',
            {
              formOfAddress,
            }
          );
        }

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Success}
              title='schulhof.login.action.forgot-password.modal.success.title'
            >
              <p>
                <T
                  t='schulhof.login.action.forgot-password.modal.success.description'
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
                t='schulhof.login.action.forgot-password.buttons.login'
              />
            </ButtonGroup>
          </Modal>
        );
    }
  }, [state, setIdle, emailRef, formOfAddress, t]);
}
