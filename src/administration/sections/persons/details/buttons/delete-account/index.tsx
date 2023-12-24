'use client';

import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import type { SimpleAction } from '#/utils/action';
import type { ClientFormOfAddress } from '#/utils/client';
import { useToggle } from '#/utils/client';
import { useSend } from '#/utils/form';
import { useCallback } from 'react';
import action from './action';

export const DeleteAccountButton = ({
  personId,
  personRev,
  formOfAddress,
  isOwnProfile,
  personName,
}: {
  personId: string;
  personRev: string;
  formOfAddress: ClientFormOfAddress;
  isOwnProfile: boolean;
  personName: string;
}) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();
  const { t } = useT();

  const own = isOwnProfile ? 'own' : 'other';

  const [submit, submitModal] = useSubmit(
    action.bind(null, personId, personRev),
    own
  );

  return (
    <>
      <Button
        variant='error'
        t={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.button`}
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant='warning'>
            <Heading
              size='4'
              t={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.confirm.title`}
            />
            {t(
              `schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.confirm.description`,
              {
                form_of_address: formOfAddress,
                person_name: personName,
              }
            ).map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </Alert>
          <ButtonGroup>
            <Button onClick={setIsOpenFalse} t='generic.back' />
            <Button
              onClick={() => {
                setIsOpenFalse();
                void submit();
              }}
              variant='error'
              t={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.confirm.action`}
            />
          </ButtonGroup>
        </Modal>
      ) : null}
      {submitModal}
    </>
  );
};

function useSubmit(a: SimpleAction, own: 'own' | 'other') {
  const { t } = useT();

  return useSend(
    a,
    useCallback(
      () => (
        <LoadingModal
          title={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.loading.title`}
          description={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.loading.description`}
        />
      ),
      [own]
    ),
    useCallback(
      (close, _, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.error.reasons.${mapError(
              err.code
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.error.title`}
            description={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.error.description`}
            reasons={reasons}
          />
        );
      },
      [t, own]
    ),
    useCallback(() => {
      return (
        <Modal onClose={close}>
          <Alert
            variant='success'
            title={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.success.title`}
          >
            <T
              t={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.success.description`}
            />
          </Alert>
          <ButtonGroup>
            <Button
              onClick={close}
              t={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}.modals.success.button`}
            />
          </ButtonGroup>
        </Modal>
      );
    }, [own])
  );
}

function mapError(err: string) {
  switch (err) {
    default:
      return 'internal-error' as const;
  }
}
