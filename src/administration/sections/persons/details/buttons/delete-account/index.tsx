'use client';

import { useT } from '#/i18n';
import { FormOfAddress } from '#/services/interfaces/account';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Modal } from '#/ui/Modal';
import { useToggle } from '#/utils/client';
import { useCallback } from 'react';
import action from './action';

export const DeleteAccountButton = ({
  formOfAddress,
  isOwnProfile,
  personId,
  personName,
}: {
  formOfAddress: FormOfAddress;
  isOwnProfile: boolean;
  personId: string;
  personName: string;
}) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();
  const { t } = useT();

  const own = isOwnProfile ? 'own' : 'other';
  const sendDelete = useSendDelete(personId);

  return (
    <>
      <Button
        variant='error'
        t={`schulhof.administration.sections.persons.details.buttons.actions.delete-account.${own}`}
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant='warning'>
            <Heading
              size='4'
              t={`schulhof.administration.sections.persons.page.table.actions.delete.account.${own}.title`}
            />
            {t(
              `schulhof.administration.sections.persons.page.table.actions.delete.account.${own}.description`,
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
              t={`schulhof.administration.sections.persons.page.table.actions.delete.account.${own}.action`}
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
      await action(personId);

      // TODO: Open modal
      // TODO: Log out if own account
    },
    [personId]
  );
}
