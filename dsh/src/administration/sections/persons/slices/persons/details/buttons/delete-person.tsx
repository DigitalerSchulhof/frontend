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

  const only = hasAccount ? 'only' : 'with';
  const sendDelete = useSendDelete(personId);

  return (
    <>
      <Button
        variant={Variant.Error}
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.delete-person'
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant={Variant.Warning}>
            <Heading
              size='4'
              t={`schulhof.administration.sections.persons.slices.persons.page.table.actions.delete.person.${only}.title`}
            />
            {t(
              `schulhof.administration.sections.persons.slices.persons.page.table.actions.delete.person.${only}.description`,
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
            t={`schulhof.administration.sections.persons.slices.persons.page.table.actions.delete.person.${only}.action`}
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
