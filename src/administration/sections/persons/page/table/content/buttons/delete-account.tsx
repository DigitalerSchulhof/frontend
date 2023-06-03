import { FormOfAddress } from '#/backend/repositories/content/account';
import { useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup, IconButton } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { IconPersonActionDeleteAccount } from '#/ui/Icon';
import { Modal } from '#/ui/Modal';
import { useToggle } from '#/utils/client';
import { useCallback } from 'react';

export const DeleteAccountButton = ({
  formOfAddress,
  personId,
  personName,
}: {
  formOfAddress: FormOfAddress;
  personId: string;
  personName: string;
}) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();
  const { t } = useT();

  const sendDelete = useSendDeleteAccount(personId);

  return (
    <>
      <IconButton
        title='schulhof.administration.sections.persons.page.table.actions.delete.account.other.action'
        variant='error'
        icon={
          <IconPersonActionDeleteAccount alt='schulhof.administration.sections.persons.page.table.actions.delete.account.other.action' />
        }
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant='warning'>
            <Heading
              size='4'
              t={`schulhof.administration.sections.persons.page.table.actions.delete.account.other.title`}
            />
            {t(
              `schulhof.administration.sections.persons.page.table.actions.delete.account.other.description`,
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
              onClick={sendDelete}
              variant='error'
              t={`schulhof.administration.sections.persons.page.table.actions.delete.account.other.action`}
            />
          </ButtonGroup>
        </Modal>
      ) : null}
    </>
  );
};

function useSendDeleteAccount(personId: string) {
  return useCallback(
    async function sendDelete() {
      alert(personId);

      // TODO: Log out if own account
    },
    [personId]
  );
}
