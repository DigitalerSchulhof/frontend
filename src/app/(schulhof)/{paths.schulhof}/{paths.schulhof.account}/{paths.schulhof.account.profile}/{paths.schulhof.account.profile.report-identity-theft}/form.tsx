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

export const ClientReportIdentityTheftForm = ({
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
          title='schulhof.account.profile.report-identity-theft.modals.loading.title'
          description='schulhof.account.profile.report-identity-theft.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.account.profile.report-identity-theft.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.account.profile.report-identity-theft.modals.error.title'
            description='schulhof.account.profile.report-identity-theft.modals.error.description'
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
            title='schulhof.account.profile.report-identity-theft.modals.success.title'
          >
            <p>
              <T t='schulhof.account.profile.report-identity-theft.modals.success.description' />
            </p>
          </Alert>
          <ButtonGroup>
            <Button
              href={[
                'paths.schulhof',
                'paths.schulhof.account',
                'paths.schulhof.account.profile',
              ]}
              t='schulhof.account.profile.report-identity-theft.modals.success.button'
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
    case 'PASSWORD_MISMATCH':
      return 'password-mismatch';
    default:
      return 'internal-error';
  }
}
