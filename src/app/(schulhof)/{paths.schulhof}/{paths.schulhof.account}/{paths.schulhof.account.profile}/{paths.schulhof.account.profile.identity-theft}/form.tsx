'use client';

import {
  IdentityTheftInput,
  IdentityTheftOutputNotOk,
  IdentityTheftOutputOk,
} from '#/app/api/schulhof/account/profile/identity-theft/route';
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

export const IdentityTheftForm = () => {
  const [formState, setFormState] = useState(FormState.Idle);

  const oldPasswordRef = useRef<{ value: string }>(null);
  const newPasswordRef = useRef<{ value: string }>(null);
  const newPasswordAgainRef = useRef<{ value: string }>(null);

  const [sendIdentityTheft, formErrors] = useSend<
    IdentityTheftInput,
    IdentityTheftOutputOk,
    IdentityTheftOutputNotOk,
    FormError
  >(
    '/api/schulhof/account/profile/identity-theft',
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

  const modal = useIdentityTheftStateModal(formState, formErrors, setFormState);

  return (
    <Form onSubmit={sendIdentityTheft}>
      {modal}
      <Table>
        <TextFormRow
          label='schulhof.account.profile.identity-theft.form.old-password'
          autoComplete='current-password'
          type='password'
          ref={oldPasswordRef}
        />
        <TextFormRow
          label='schulhof.account.profile.identity-theft.form.new-password'
          autoComplete='new-password'
          type='password'
          ref={newPasswordRef}
        />
        <TextFormRow
          label='schulhof.account.profile.identity-theft.form.new-password-again'
          autoComplete='new-password'
          type='password'
          ref={newPasswordAgainRef}
        />
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
          href={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
          ]}
          t='schulhof.account.profile.identity-theft.form.buttons.back'
        />
      </ButtonGroup>
    </Form>
  );
};

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
                href={[
                  'paths.schulhof',
                  'paths.schulhof.account',
                  'paths.schulhof.account.profile',
                ]}
                t='schulhof.account.profile.identity-theft.modals.success.button'
              />
            </ButtonGroup>
          </Modal>
        );
    }
  }, [state, formErrors, setIdle, t]);
}
