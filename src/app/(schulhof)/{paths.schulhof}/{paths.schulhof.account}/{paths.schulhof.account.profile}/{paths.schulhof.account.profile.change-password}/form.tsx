'use client';

import {
  ChangePasswordInput,
  ChangePasswordOutputNotOk,
} from '#/app/api/schulhof/account/profile/change-password/route';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { sleep } from '#/utils';
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
  PasswordMismatch = 'password-mismatch',
}

export const ChangePasswordForm = () => {
  const [formState, setFormState] = useState<FormState>(FormState.Idle);
  const [formErrors, setFormErrors] = useState<readonly FormError[]>([]);

  const oldPasswordRef = useRef<{ value: string }>(null);
  const newPasswordRef = useRef<{ value: string }>(null);
  const newPasswordAgainRef = useRef<{ value: string }>(null);

  const sendChangePassword = useSendChangePassword(
    oldPasswordRef,
    newPasswordRef,
    newPasswordAgainRef,
    setFormState,
    setFormErrors
  );

  const modal = useChangePasswordStateModal(
    formState,
    formErrors,
    setFormState
  );

  return (
    <Form onSubmit={sendChangePassword}>
      {modal}
      <Table>
        <TextFormRow
          label='schulhof.account.profile.change-password.form.old-password'
          autoComplete='current-password'
          type='password'
          ref={oldPasswordRef}
        />
        <TextFormRow
          label='schulhof.account.profile.change-password.form.new-password'
          autoComplete='new-password'
          type='password'
          ref={newPasswordRef}
        />
        <TextFormRow
          label='schulhof.account.profile.change-password.form.new-password-again'
          autoComplete='new-password'
          type='password'
          ref={newPasswordAgainRef}
        />
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          t='schulhof.account.profile.change-password.form.buttons.submit'
        />
        <Button
          href={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
          ]}
          t='schulhof.account.profile.change-password.form.buttons.back'
        />
      </ButtonGroup>
    </Form>
  );
};

function useSendChangePassword(
  oldPasswordRef: React.RefObject<{ value: string }>,
  newPasswordRef: React.RefObject<{ value: string }>,
  newPasswordAgainRef: React.RefObject<{ value: string }>,
  setFormState: (s: FormState) => void,
  setFormErrors: (e: readonly FormError[]) => void
) {
  const log = useLog();

  return useCallback(
    async function sendChangePassword() {
      setFormState(FormState.Loading);

      const oldPassword = oldPasswordRef.current!.value;
      const newPassword = newPasswordRef.current!.value;
      const newPasswordAgain = newPasswordAgainRef.current!.value;

      const [res] = await Promise.all([
        fetch('/api/schulhof/account/profile/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            newPasswordAgain,
          } satisfies ChangePasswordInput),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        const bodyString = await res.text();
        setFormState(FormState.Error);
        let body: ChangePasswordOutputNotOk;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          setFormErrors([FormError.InternalError]);
          if (e instanceof SyntaxError) {
            log.error('Unknown error while changing password', {
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
            case 'PASSWORD_MISMATCH':
              errors.push(FormError.PasswordMismatch);
              break;
            default:
              if (!errors.includes(FormError.InternalError)) {
                errors.push(FormError.InternalError);
              }

              log.error('Unknown error while reporting identity theft', {
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

      setFormState(FormState.Success);
    },
    [
      oldPasswordRef,
      newPasswordRef,
      newPasswordAgainRef,
      setFormState,
      setFormErrors,
      log,
    ]
  );
}

function useChangePasswordStateModal(
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
            title='schulhof.account.profile.change-password.modals.loading.title'
            description='schulhof.account.profile.change-password.modals.loading.description'
          />
        );
      case FormState.Error: {
        const errorReasons = formErrors.flatMap((err) =>
          t(
            `schulhof.account.profile.change-password.modals.error.reasons.${err}`
          )
        );

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Error}
              title='schulhof.account.profile.change-password.modals.error.title'
            >
              <p>
                <T t='schulhof.account.profile.change-password.modals.error.description' />
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
        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Success}
              title='schulhof.account.profile.change-password.modals.success.title'
            >
              <p>
                <T t='schulhof.account.profile.change-password.modals.success.description' />
              </p>
            </Alert>
            <ButtonGroup>
              <Button
                href={[
                  'paths.schulhof',
                  'paths.schulhof.account',
                  'paths.schulhof.account.profile',
                ]}
                t='schulhof.account.profile.change-password.modals.success.button'
              />
            </ButtonGroup>
          </Modal>
        );
    }
  }, [state, formErrors, setIdle, t]);
}
