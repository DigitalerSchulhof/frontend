'use client';

import { FormOfAddress } from '#/backend/repositories/content/person';
import { useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Modal } from '#/ui/Modal';
import { Variant } from '#/ui/variants';
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

  const sendDelete = useSendDelete(personId);

  return (
    <>
      <Button
        variant={Variant.Error}
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.delete-account'
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant={Variant.Warning}>
            <Heading
              size='4'
              t='schulhof.administration.sections.persons.slices.persons.page.table.actions.delete.account.title'
            />
            {t(
              'schulhof.administration.sections.persons.slices.persons.page.table.actions.delete.account.description',
              {
                form_of_address: formOfAddress,
                person_name: personName,
              }
            ).map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </Alert>
          <Button onClick={setIsOpenFalse} t='generic.back' />
          <Button
            onClick={sendDelete}
            t='schulhof.administration.sections.persons.slices.persons.page.table.actions.delete.account.action'
          />
        </Modal>
      ) : null}
    </>
  );
};

function useSendDelete(personId: string) {
  return useCallback(
    async function sendDelete() {
      alert(personId);
    },
    [personId]
  );
}
