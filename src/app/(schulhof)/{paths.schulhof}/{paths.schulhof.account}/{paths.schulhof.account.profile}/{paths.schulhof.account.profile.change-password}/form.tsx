'use client';

import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, FormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { sleep } from '#/utils';
import { useCallback, useMemo, useRef, useState } from 'react';

enum ChangePasswordState {
  Idle = 'idle',
  Loading = 'loading',
  InternalError = 'internal-error',
  InvalidCredentials = 'invalid-credentials',
  PasswordMismatch = 'password-mismatch',
  Success = 'success',
}

export const ChangePasswordForm = () => {
  const [changePasswordState, setChangePasswordState] =
    useState<ChangePasswordState>(ChangePasswordState.Idle);

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordAgainRef = useRef<HTMLInputElement>(null);

  const sendChangePassword = useSendChangePassword(
    oldPasswordRef,
    newPasswordRef,
    newPasswordAgainRef,
    setChangePasswordState
  );

  const modal = useChangePasswordStateModal(
    changePasswordState,
    setChangePasswordState
  );

  return (
    <Form onSubmit={sendChangePassword}>
      {modal}
      <Table>
        <Table.Body>
          <FormRow
            label='schulhof.account.profile.change-password.form.old-password'
            autoComplete='current-password'
            type='password'
            ref={oldPasswordRef}
          />
          <FormRow
            label='schulhof.account.profile.change-password.form.new-password'
            autoComplete='new-password'
            type='password'
            ref={newPasswordRef}
          />
          <FormRow
            label='schulhof.account.profile.change-password.form.new-password-again'
            autoComplete='new-password'
            type='password'
            ref={newPasswordAgainRef}
          />
        </Table.Body>
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          t='schulhof.account.profile.change-password.buttons.submit'
        />
        <Button
          href={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
          ]}
          t='schulhof.account.profile.change-password.buttons.back'
        />
      </ButtonGroup>
    </Form>
  );
};

function useSendChangePassword(
  oldPasswordRef: React.RefObject<HTMLInputElement>,
  newPasswordRef: React.RefObject<HTMLInputElement>,
  newPasswordAgainRef: React.RefObject<HTMLInputElement>,
  setChangePasswordState: (s: ChangePasswordState) => void
) {
  const log = useLog();

  return useCallback(
    async function sendChangePassword() {
      const oldPassword = oldPasswordRef.current?.value;
      const newPassword = newPasswordRef.current?.value;
      const newPasswordAgain = newPasswordAgainRef.current?.value;

      setChangePasswordState(ChangePasswordState.Loading);

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
          }),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        if (res.status === 401) {
          const body = await res.json();

          switch (body) {
            case 'invalid-credentials':
              setChangePasswordState(ChangePasswordState.InvalidCredentials);
              return;
            case 'password-mismatch':
              setChangePasswordState(ChangePasswordState.PasswordMismatch);
              return;
            default:
              log.error('Unknown error while changing password', {
                status: res.status,
                body,
              });
              return;
          }
        }

        log.error('Error while changing password', {
          status: res.status,
          body: await res.text(),
        });

        setChangePasswordState(ChangePasswordState.InternalError);
        return;
      }

      setChangePasswordState(ChangePasswordState.Success);
    },
    [
      oldPasswordRef,
      newPasswordRef,
      newPasswordAgainRef,
      setChangePasswordState,
      log,
    ]
  );
}

function useChangePasswordStateModal(
  state: ChangePasswordState,
  setChangePasswordState: (s: ChangePasswordState) => void
) {
  const { t } = useT();

  const setIdle = useCallback(
    () => setChangePasswordState(ChangePasswordState.Idle),
    [setChangePasswordState]
  );

  return useMemo(() => {
    switch (state) {
      case ChangePasswordState.Idle:
        return null;
      case ChangePasswordState.Loading:
        return (
          <LoadingModal
            title='schulhof.account.profile.change-password.modal.loading.title'
            description='schulhof.account.profile.change-password.modal.loading.description'
          />
        );
      case ChangePasswordState.InternalError:
      case ChangePasswordState.InvalidCredentials:
      case ChangePasswordState.PasswordMismatch: {
        const errorReasons = t(
          `schulhof.account.profile.change-password.modal.error.reasons.${state}`
        );

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Error}
              title='schulhof.account.profile.change-password.modal.error.title'
            >
              <p>
                <T t='schulhof.account.profile.change-password.modal.error.description' />
              </p>
              <ul>
                {errorReasons.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Alert>
            <div>
              <Button onClick={setIdle} t='generic.back' />
            </div>
          </Modal>
        );
      }
      case ChangePasswordState.Success:
        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Success}
              title='schulhof.account.profile.change-password.modal.success.title'
            >
              <p>
                <T t='schulhof.account.profile.change-password.modal.success.description' />
              </p>
            </Alert>
            <div>
              <Button
                href={[
                  'paths.schulhof',
                  'paths.schulhof.account',
                  'paths.schulhof.account.profile',
                ]}
                t='schulhof.account.profile.change-password.modal.success.button'
              />
            </div>
          </Modal>
        );
    }
  }, [state, setIdle, t]);
}
