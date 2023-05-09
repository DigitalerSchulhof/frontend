'use client';

import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import { useCallback, useRef } from 'react';
import { identityTheft } from './action';

export const IdentityTheftForm = () => {
  const oldPasswordRef = useRef<{ value: string }>(null);
  const newPasswordRef = useRef<{ value: string }>(null);
  const newPasswordAgainRef = useRef<{ value: string }>(null);

  const [sendIdentityTheft, modal] = useSubmit(
    oldPasswordRef,
    newPasswordRef,
    newPasswordAgainRef
  );

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
  oldPasswordRef: React.RefObject<{ value: string }>,
  newPasswordRef: React.RefObject<{ value: string }>,
  newPasswordAgainRef: React.RefObject<{ value: string }>
) {
  const { t } = useT();

  return useSend(
    useCallback(
      () =>
        unwrapAction(
          identityTheft(
            oldPasswordRef.current!.value,
            newPasswordRef.current!.value,
            newPasswordAgainRef.current!.value
          )
        ),
      [oldPasswordRef, newPasswordRef, newPasswordAgainRef]
    ),
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.account.profile.identity-theft.modals.loading.title'
          description='schulhof.account.profile.identity-theft.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.account.profile.identity-theft.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.account.profile.identity-theft.modals.error.title'
            description='schulhof.account.profile.identity-theft.modals.error.description'
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
      ),
      []
    )
  );
}
