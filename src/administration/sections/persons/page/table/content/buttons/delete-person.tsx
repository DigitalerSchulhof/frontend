'use client';

import { useT } from '#/i18n';
import { FormOfAddress } from '#/services/interfaces/account';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup, IconButton } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { IconPersonActionDeletePerson } from '#/ui/Icon';
import { Modal } from '#/ui/Modal';
import { useToggle } from '#/utils/client';
import { useCallback } from 'react';

export const DeletePersonButton = ({
  formOfAddress,
  personId,
  personName,
  hasAccount,
}: {
  formOfAddress: FormOfAddress;
  personId: string;
  personName: string;
  hasAccount: boolean;
}) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();
  const { t } = useT();

  const only = hasAccount ? 'with' : 'only';
  const sendDelete = useSendDelete(personId);

  return (
    <>
      <IconButton
        title='schulhof.administration.sections.persons.page.table.actions.delete.person.with.action'
        variant='error'
        icon={
          <IconPersonActionDeletePerson alt='schulhof.administration.sections.persons.page.table.actions.delete.person.with.action' />
        }
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant='warning'>
            <Heading
              size='4'
              t={`schulhof.administration.sections.persons.page.table.actions.delete.person.${only}.title`}
            />
            {t(
              `schulhof.administration.sections.persons.page.table.actions.delete.person.${only}.description`,
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
              t={`schulhof.administration.sections.persons.page.table.actions.delete.person.${only}.action`}
            />
          </ButtonGroup>
        </Modal>
      ) : null}
    </>
  );
};

function useSendDelete(personId: string) {
  return useCallback(
    async function sendDelete() {
      alert(personId);

      // TODO: Log out if own person
    },
    [personId]
  );
}
