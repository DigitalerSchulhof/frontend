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

enum IdentityTheftState {
  Idle = 'idle',
  Loading = 'loading',
  InternalError = 'internal-error',
  InvalidCredentials = 'invalid-credentials',
  PasswordMismatch = 'password-mismatch',
  Success = 'success',
}

export const IdentityTheftForm = () => {
  const [identityTheftState, setIdentityTheftState] =
    useState<IdentityTheftState>(IdentityTheftState.Idle);

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordAgainRef = useRef<HTMLInputElement>(null);

  const sendIdentityTheft = useSendIdentityTheft(
    oldPasswordRef,
    newPasswordRef,
    newPasswordAgainRef,
    setIdentityTheftState
  );

  const modal = useIdentityTheftStateModal(
    identityTheftState,
    setIdentityTheftState
  );

  return (
    <Form onSubmit={sendIdentityTheft}>
      {modal}
      <Table>
        <Table.Body>
          <FormRow
            label='schulhof.account.profile.identity-theft.form.old-password'
            autoComplete='current-password'
            type='password'
            ref={oldPasswordRef}
          />
          <FormRow
            label='schulhof.account.profile.identity-theft.form.new-password'
            autoComplete='new-password'
            type='password'
            ref={newPasswordRef}
          />
          <FormRow
            label='schulhof.account.profile.identity-theft.form.new-password-again'
            autoComplete='new-password'
            type='password'
            ref={newPasswordAgainRef}
          />
        </Table.Body>
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant={Variant.Warning}
          t='schulhof.account.profile.identity-theft.form.buttons.submit'
        />
        <Button
          href={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.change-password',
          ]}
          t='schulhof.account.profile.identity-theft.form.buttons.change-password'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.account']}
          t='schulhof.account.profile.identity-theft.form.buttons.back'
        />
      </ButtonGroup>
    </Form>
  );
};

function useSendIdentityTheft(
  oldPasswordRef: React.RefObject<HTMLInputElement>,
  newPasswordRef: React.RefObject<HTMLInputElement>,
  newPasswordAgainRef: React.RefObject<HTMLInputElement>,
  setIdentityTheftState: (s: IdentityTheftState) => void
) {
  const log = useLog();

  return useCallback(
    async function sendIdentityTheft() {
      const oldPassword = oldPasswordRef.current!.value;
      const newPassword = newPasswordRef.current!.value;
      const newPasswordAgain = newPasswordAgainRef.current!.value;

      setIdentityTheftState(IdentityTheftState.Loading);

      const [res] = await Promise.all([
        fetch('/api/schulhof/account/profile/identity-theft', {
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
        const bodyString = await res.text();
        let body;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          if (e instanceof SyntaxError) {
            setIdentityTheftState(IdentityTheftState.InternalError);
            log.error('Unknown error while reporting identity theft', {
              status: res.status,
              body: bodyString,
            });
            return;
          }

          throw e;
        }

        switch (body.code) {
          case 'invalid-credentials':
            setIdentityTheftState(IdentityTheftState.InvalidCredentials);
            return;
          case 'password-mismatch':
            setIdentityTheftState(IdentityTheftState.PasswordMismatch);
            return;
          default:
            setIdentityTheftState(IdentityTheftState.InternalError);
            log.error('Unknown error while reporting identity theft', {
              status: res.status,
              body,
            });
            return;
        }
      }

      setIdentityTheftState(IdentityTheftState.Success);
    },
    [
      oldPasswordRef,
      newPasswordRef,
      newPasswordAgainRef,
      setIdentityTheftState,
      log,
    ]
  );
}

function useIdentityTheftStateModal(
  state: IdentityTheftState,
  setIdentityTheftState: (s: IdentityTheftState) => void
) {
  const { t } = useT();

  const setIdle = useCallback(
    () => setIdentityTheftState(IdentityTheftState.Idle),
    [setIdentityTheftState]
  );

  return useMemo(() => {
    switch (state) {
      case IdentityTheftState.Idle:
        return null;
      case IdentityTheftState.Loading:
        return (
          <LoadingModal
            title='schulhof.account.profile.identity-theft.modals.loading.title'
            description='schulhof.account.profile.identity-theft.modals.loading.description'
          />
        );
      case IdentityTheftState.InternalError:
      case IdentityTheftState.InvalidCredentials:
      case IdentityTheftState.PasswordMismatch: {
        const errorReasons = t(
          `schulhof.account.profile.identity-theft.modals.error.reasons.${state}`
        );

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Error}
              title='schulhof.account.profile.identity-theft.modals.error.title'
            >
              <p>
                <T t='schulhof.account.profile.identity-theft.modals.error.description' />
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
      case IdentityTheftState.Success:
        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Success}
              title='schulhof.account.profile.identity-theft.modals.success.title'
            >
              <p>
                <T t='schulhof.account.profile.identity-theft.modals.success.description' />
              </p>
            </Alert>
            <ButtonGroup>
              <Button
                href={['paths.schulhof', 'paths.schulhof.account']}
                t='schulhof.account.profile.identity-theft.modals.success.button'
              />
            </ButtonGroup>
          </Modal>
        );
    }
  }, [state, setIdle, t]);
}
