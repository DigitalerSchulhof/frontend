'use client';

import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button } from '#/ui/Button';
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
      <div>
        <Button type='submit' variant={Variant.Warning}>
          <T t='schulhof.account.profile.identity-theft.buttons.submit' />
        </Button>
        <Button
          href={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.change-password',
          ]}
        >
          <T t='schulhof.account.profile.identity-theft.buttons.change-password' />
        </Button>
        <Button href={['paths.schulhof', 'paths.schulhof.account']}>
          <T t='schulhof.account.profile.identity-theft.buttons.back' />
        </Button>
      </div>
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
      const oldPassword = oldPasswordRef.current?.value;
      const newPassword = newPasswordRef.current?.value;
      const newPasswordAgain = newPasswordAgainRef.current?.value;

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
        if (res.status === 401) {
          const body = await res.json();

          switch (body) {
            case 'invalid-credentials':
              setIdentityTheftState(IdentityTheftState.InvalidCredentials);
              return;
            case 'password-mismatch':
              setIdentityTheftState(IdentityTheftState.PasswordMismatch);
          }
        }

        log.error('Error while reporting identity theft', {
          status: res.status,
          body: await res.text(),
        });

        setIdentityTheftState(IdentityTheftState.InternalError);
        return;
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
            title='schulhof.account.profile.identity-theft.modal.loading.title'
            description='schulhof.account.profile.identity-theft.modal.loading.description'
          />
        );
      case IdentityTheftState.InternalError:
      case IdentityTheftState.InvalidCredentials:
      case IdentityTheftState.PasswordMismatch: {
        const errorReasons = t(
          `schulhof.account.profile.identity-theft.modal.error.reasons.${state}`
        );

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Error}
              title='schulhof.account.profile.identity-theft.modal.error.title'
            >
              <p>
                <T t='schulhof.account.profile.identity-theft.modal.error.description' />
              </p>
              <ul>
                {errorReasons.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Alert>
            <Button onClick={setIdle}>
              <T t='generic.back' />
            </Button>
          </Modal>
        );
      }
      case IdentityTheftState.Success:
        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Success}
              title='schulhof.account.profile.identity-theft.modal.success.title'
            >
              <p>
                <T t='schulhof.account.profile.identity-theft.modal.success.description' />
              </p>
            </Alert>
            <Button href={['paths.schulhof', 'paths.schulhof.account']}>
              <T t='schulhof.account.profile.identity-theft.modal.success.button' />
            </Button>
          </Modal>
        );
    }
  }, [state, setIdle, t]);
}
