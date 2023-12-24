import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup, IconButton } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { IconPersonActionDeletePerson } from '#/ui/Icon';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import type { SimpleAction } from '#/utils/action';
import type { ClientFormOfAddress } from '#/utils/client';
import { useToggle } from '#/utils/client';
import { useSend } from '#/utils/form';
import { useCallback } from 'react';
import action from './action';

export const DeletePersonButton = ({
  personId,
  personRev,
  formOfAddress,
  personName,
  hasAccount,
}: {
  personId: string;
  personRev: string;
  formOfAddress: ClientFormOfAddress;
  personName: string;
  hasAccount: boolean;
}) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();
  const { t } = useT();

  const only = hasAccount ? 'with' : 'only';
  const [submit, submitModal] = useSubmit(
    action.bind(null, personId, personRev),
    only
  );

  return (
    <>
      <IconButton
        title={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.button`}
        variant='error'
        icon={
          <IconPersonActionDeletePerson
            alt={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.button`}
          />
        }
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant='warning'>
            <Heading
              size='4'
              t={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.confirm.title`}
            />
            {t(
              `schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.confirm.description`,
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
              t={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.confirm.action`}
            />
          </ButtonGroup>
        </Modal>
      ) : null}
      {submitModal}
    </>
  );
};

function useSubmit(a: SimpleAction, only: 'with' | 'only') {
  const { t } = useT();

  return useSend(
    a,
    useCallback(
      () => (
        <LoadingModal
          title={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.loading.title`}
          description={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.loading.description`}
        />
      ),
      [only]
    ),
    useCallback(
      (close, _, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.error.reasons.${mapError(
              err.code
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.error.title`}
            description={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.error.description`}
            reasons={reasons}
          />
        );
      },
      [t, only]
    ),
    useCallback(() => {
      return (
        <Modal onClose={close}>
          <Alert
            variant='success'
            title={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.success.title`}
          >
            <T
              t={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.success.description`}
            />
          </Alert>
          <ButtonGroup>
            <Button
              onClick={close}
              t={`schulhof.administration.sections.persons.page.table.actions.delete-person.${only}.modals.success.button`}
            />
          </ButtonGroup>
        </Modal>
      );
    }, [only])
  );
}

function mapError(err: string) {
  switch (err) {
    default:
      return 'internal-error' as const;
  }
}
