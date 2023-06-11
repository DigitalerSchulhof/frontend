'use client';

import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form } from '#/ui/Form';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { useSend } from '#/utils/form';
import React, { useCallback } from 'react';
import action from './action';

export const ForgotPasswordForm = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const submit = useSubmit();

  return <Form submit={submit}>{children}</Form>;
};

function useSubmit() {
  const { t } = useT();

  return useSend(
    action,
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.login.actions.forgot-password.modals.loading.title'
          description='schulhof.login.actions.forgot-password.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.login.actions.forgot-password.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.login.actions.forgot-password.modals.error.title'
            description='schulhof.login.actions.forgot-password.modals.error.description'
            reasons={reasons}
          />
        );
      },
      [t]
    ),
    useCallback(
      (close, { email, formOfAddress }) => (
        <Modal onClose={close}>
          <Alert
            variant='success'
            title='schulhof.login.actions.forgot-password.modals.success.title'
          >
            <p>
              <T
                t='schulhof.login.actions.forgot-password.modals.success.description'
                args={{
                  email,
                  form_of_address: formOfAddress,
                }}
              />
            </p>
          </Alert>
          <ButtonGroup>
            <Button
              href={['paths.schulhof', 'paths.schulhof.login']}
              t='schulhof.login.actions.forgot-password.modals.success.button'
            />
          </ButtonGroup>
        </Modal>
      ),
      []
    )
  );
}

function mapError(err: string) {
  switch (err) {
    case 'INVALID_CREDENTIALS':
      return 'invalid-credentials';
    default:
      return 'internal-error';
  }
}
