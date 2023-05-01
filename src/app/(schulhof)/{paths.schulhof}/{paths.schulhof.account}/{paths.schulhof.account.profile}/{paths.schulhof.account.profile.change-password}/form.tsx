'use client';

import {
  ChangePasswordInput,
  ChangePasswordOutputNotOk,
  ChangePasswordOutputOk,
} from '#/app/api/schulhof/account/profile/change-password/route';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { FormState, useSend } from '#/utils/form';
import { useCallback, useMemo, useRef, useState } from 'react';

type FormError = 'internal-error' | 'invalid-credentials' | 'password-mismatch';

export const ChangePasswordForm = () => {
  const [formState, setFormState] = useState(FormState.Idle);

  const oldPasswordRef = useRef<{ value: string }>(null);
  const newPasswordRef = useRef<{ value: string }>(null);
  const newPasswordAgainRef = useRef<{ value: string }>(null);

  const [sendChangePassword, formErrors] = useSend<
    ChangePasswordInput,
    ChangePasswordOutputOk,
    ChangePasswordOutputNotOk,
    FormError
  >(
    '/api/schulhof/account/profile/change-password',
    setFormState,
    useCallback(
      () => ({
        oldPassword: oldPasswordRef.current!.value,
        newPassword: newPasswordRef.current!.value,
        newPasswordAgain: newPasswordAgainRef.current!.value,
      }),
      [oldPasswordRef, newPasswordRef, newPasswordAgainRef]
    ),
    useMemo(
      () => ({
        INVALID_CREDENTIALS: 'invalid-credentials',
        PASSWORD_MISMATCH: 'password-mismatch',
      }),
      []
    ),
    undefined,
    undefined,
    useMemo(
      () => ({
        attachInput: false,
      }),
      []
    )
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
