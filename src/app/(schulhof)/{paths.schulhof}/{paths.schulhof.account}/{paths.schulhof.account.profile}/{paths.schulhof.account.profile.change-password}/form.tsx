'use client';

import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { Table } from '#/ui/Table';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import { useCallback, useRef } from 'react';
import { changePassword } from './action';

export const ChangePasswordForm = ({ accountRev }: { accountRev: string }) => {
  const oldPasswordRef = useRef<{ value: string }>(null);
  const newPasswordRef = useRef<{ value: string }>(null);
  const newPasswordAgainRef = useRef<{ value: string }>(null);

  const [sendChangePassword, modal] = useSubmit(
    accountRev,
    oldPasswordRef,
    newPasswordRef,
    newPasswordAgainRef
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
          variant='success'
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

function mapError(err: string) {
  switch (err) {
    case 'INVALID_CREDENTIALS':
      return 'invalid-credentials';
    case 'PASSWORD_MISMATCH':
      return 'password-mismatch';
    default:
      return 'internal-error';
  }
}

function useSubmit(
  accountRev: string,
  oldPasswordRef: React.RefObject<{ value: string }>,
  newPasswordRef: React.RefObject<{ value: string }>,
  newPasswordAgainRef: React.RefObject<{ value: string }>
) {
  const { t } = useT();

  return useSend(
    useCallback(
      () =>
        unwrapAction(
          changePassword(
            accountRev,
            oldPasswordRef.current!.value,
            newPasswordRef.current!.value,
            newPasswordAgainRef.current!.value
          )
        ),
      [accountRev, oldPasswordRef, newPasswordRef, newPasswordAgainRef]
    ),
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.account.profile.change-password.modals.loading.title'
          description='schulhof.account.profile.change-password.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.account.profile.change-password.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.account.profile.change-password.modals.error.title'
            description='schulhof.account.profile.change-password.modals.error.description'
            reasons={reasons}
          />
        );
      },
      [t]
    ),
    useCallback(
      () => (
        <Modal onClose={close}>
          <Alert
            variant='success'
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
      ),
      []
    )
  );
}
