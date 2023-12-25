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

export const ClientCreateEditAccountForm = ({
  personId,
  own,
  mode,
  children,
}: {
  personId: string;
  own: 'own' | 'other';
  mode: 'create' | 'edit';
  children: React.ReactNode;
}) => {
  const submit = useSubmit(personId, own, mode);

  return <Form submit={submit}>{children}</Form>;
};

function useSubmit(
  personId: string,
  own: 'own' | 'other',
  mode: 'create' | 'edit'
) {
  const { t } = useT();

  return useSend(
    action,
    useCallback(
      () => (
        <LoadingModal
          title={`schulhof.administration.sections.persons.${mode}-account.modals.loading.title`}
          description={`schulhof.administration.sections.persons.${mode}-account.modals.loading.description`}
        />
      ),
      [mode]
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.${mode}-account.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title={`schulhof.administration.sections.persons.${mode}-account.modals.error.title`}
            description={`schulhof.administration.sections.persons.${mode}-account.modals.error.description`}
            reasons={reasons}
          />
        );
      },
      [t, mode]
    ),
    useCallback(() => {
      return (
        <Modal onClose={close}>
          <Alert
            variant='success'
            title={`schulhof.administration.sections.persons.${mode}-account.modals.success.title`}
          >
            <p>
              <T
                t={`schulhof.administration.sections.persons.${mode}-account.modals.success.description`}
              />
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
              t={`schulhof.administration.sections.persons.${mode}-account.modals.success.button.${own}`}
            />
          </ButtonGroup>
        </Modal>
      );
    }, [own, personId, mode])
  );
}

function mapError(err: string) {
  switch (err) {
    default:
      return 'internal-error' as const;
  }
}
