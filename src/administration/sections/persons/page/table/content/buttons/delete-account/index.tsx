import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup, IconButton } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { IconPersonActionDeleteAccount } from '#/ui/Icon';
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
  personName,
}: {
  personId: string;
  personRev: string;
  formOfAddress: ClientFormOfAddress;
  personName: string;
}) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();
  const { t } = useT();

  const [submit, submitModal] = useSubmit(
    action.bind(null, personId, personRev)
  );

  return (
    <>
      <IconButton
        title='schulhof.administration.sections.persons.page.table.actions.delete-account.button'
        variant='error'
        icon={
          <IconPersonActionDeleteAccount alt='schulhof.administration.sections.persons.page.table.actions.delete-account.button' />
        }
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant='warning'>
            <Heading
              size='4'
              t='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.confirm.title'
            />
            {t(
              `schulhof.administration.sections.persons.page.table.actions.delete-account.modals.confirm.description`,
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
              t='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.confirm.action'
            />
          </ButtonGroup>
        </Modal>
      ) : null}
      {submitModal}
    </>
  );
};

function useSubmit(a: SimpleAction) {
  const { t } = useT();

  return useSend(
    a,
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.loading.title'
          description='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, _, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.page.table.actions.delete-account.modals.error.reasons.${mapError(
              err.code
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.error.title'
            description='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.error.description'
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
            title='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.success.title'
          >
            <T t='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.success.description' />
          </Alert>
          <ButtonGroup>
            <Button
              onClick={close}
              t='schulhof.administration.sections.persons.page.table.actions.delete-account.modals.success.button'
            />
          </ButtonGroup>
        </Modal>
      );
    }, [])
  );
}

function mapError(err: string) {
  switch (err) {
    default:
      return 'internal-error' as const;
  }
}
