'use client';

import { T } from '#/i18n';
import { FormOfAddress } from '#/services/interfaces/account';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Modal } from '#/ui/Modal';
import { useToggle } from '#/utils/client';

export const MayNotMessagePersonButton = ({
  formOfAddress,
  personName,
}: {
  formOfAddress: FormOfAddress;
  personName: string;
}) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();

  return (
    <>
      <Button
        onClick={setIsOpenTrue}
        disabled
        t='schulhof.administration.sections.persons.details.personal-data.actions.write-message.button'
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert
            variant='information'
            title='schulhof.administration.sections.persons.details.personal-data.actions.write-message.title'
          >
            <p>
              <T
                t='schulhof.administration.sections.persons.details.personal-data.actions.write-message.errors.no-permission'
                args={{
                  form_of_address: formOfAddress,
                  name: personName,
                }}
              />
            </p>
          </Alert>
          <ButtonGroup>
            <Button onClick={setIsOpenFalse} t='generic.back' />
          </ButtonGroup>
        </Modal>
      ) : null}
    </>
  );
};
