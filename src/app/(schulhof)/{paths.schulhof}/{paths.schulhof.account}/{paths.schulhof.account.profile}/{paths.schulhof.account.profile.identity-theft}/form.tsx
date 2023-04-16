'use client';

import {
  IdentityTheftInput,
  IdentityTheftOutputNotOk,
} from '#/app/api/schulhof/auth/identity-theft/route';
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

export const IdentityTheftForm = () => {
  const [formState, setFormState] = useState<FormState>(FormState.Idle);
  const [formErrors, setFormErrors] = useState<readonly FormError[]>([]);

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordAgainRef = useRef<HTMLInputElement>(null);

  const sendIdentityTheft = useSendIdentityTheft(
    oldPasswordRef,
    newPasswordRef,
    newPasswordAgainRef,
    setFormState,
    setFormErrors
  );

  const modal = useIdentityTheftStateModal(formState, formErrors, setFormState);

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
  setFormState: (s: FormState) => void,
  setFormErrors: (e: readonly FormError[]) => void
) {
  const log = useLog();

  return useCallback(
    async function sendIdentityTheft() {
      const oldPassword = oldPasswordRef.current!.value;
      const newPassword = newPasswordRef.current!.value;
      const newPasswordAgain = newPasswordAgainRef.current!.value;

      setFormState(FormState.Loading);

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
          } satisfies IdentityTheftInput),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        setFormState(FormState.Error);

        const bodyString = await res.text();
        let body: IdentityTheftOutputNotOk;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          setFormErrors([FormError.InternalError]);
          if (e instanceof SyntaxError) {
            log.error('Unknown error while reporting identity theft', {
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

function useIdentityTheftStateModal(
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
            title='schulhof.account.profile.identity-theft.modals.loading.title'
            description='schulhof.account.profile.identity-theft.modals.loading.description'
          />
        );
      case FormState.Error: {
        const errorReasons = formErrors.flatMap((err) =>
          t(
            `schulhof.account.profile.identity-theft.modals.error.reasons.${err}`
          )
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
      case FormState.Success:
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
  }, [state, formErrors, setIdle, t]);
}
