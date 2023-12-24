'use client';

import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { DisplayContentsForm } from '#/ui/Form';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { useSend } from '#/utils/form';
import React, { useCallback } from 'react';
import action from './action';

export const EditAccountSettingsForm = ({
  own,
  personId,
  children,
}: {
  own: 'own' | 'other';
  personId: string;
  children: React.ReactNode;
}) => {
  const submit = useSubmit(own, personId);

  return <DisplayContentsForm submit={submit}>{children}</DisplayContentsForm>;
};

function useSubmit(own: 'own' | 'other', personId: string) {
  const { t } = useT();

  return useSend(
    action,
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.administration.sections.persons.account-settings.modals.loading.title'
          description='schulhof.administration.sections.persons.account-settings.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.account-settings.modals.error.reasons.${mapError(
              err
            )}`,
            {
              max_session_timeout: 300,
            }
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.administration.sections.persons.account-settings.modals.error.title'
            description='schulhof.administration.sections.persons.account-settings.modals.error.description'
            reasons={reasons}
          />
        );
      },
      [t]
    ),
    useCallback(() => {
      return (
        <Modal onClose={close}>
          <Alert
            variant='success'
            title='schulhof.administration.sections.persons.account-settings.modals.success.title'
          >
            <p>
              <T t='schulhof.administration.sections.persons.account-settings.modals.success.description' />
            </p>
          </Alert>
          <ButtonGroup>
            <Button
              href={
                own === 'own'
                  ? [
                      'paths.schulhof',
                      'paths.schulhof.account',
                      'paths.schulhof.account.profile',
                    ]
                  : [
                      'paths.schulhof',
                      'paths.schulhof.administration',
                      'paths.schulhof.administration.persons',
                      `{${personId}}`,
                    ]
              }
              t={`schulhof.administration.sections.persons.account-settings.modals.success.button.${own}`}
            />
          </ButtonGroup>
        </Modal>
      );
    }, [own, personId])
  );
}

function mapError(err: string) {
  switch (err) {
    case 'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID':
      return 'invalid-mailbox-delete-after-in-bin';
    case 'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID':
      return 'invalid-mailbox-delete-after';
    case 'ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID':
      return 'invalid-session-timeout';
    default:
      return 'internal-error';
  }
}
