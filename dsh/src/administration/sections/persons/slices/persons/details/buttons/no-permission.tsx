'use client';

import { FormOfAddress } from '#/backend/repositories/content/account';
import { T } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Modal } from '#/ui/Modal';
import { Variant } from '#/ui/variants';
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
        t='schulhof.administration.sections.persons.slices.persons.details.personal-data.actions.write-message.button'
      />
      {isOpen && (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant={Variant.Error}>
            <Heading size='4'>
              <T
                t='schulhof.administration.sections.persons.slices.persons.details.personal-data.actions.write-message.title'
                args={{
                  name: personName,
                }}
              />
            </Heading>
            <p>
              <T
                t='schulhof.administration.sections.persons.slices.persons.details.personal-data.actions.write-message.errors.no-permission'
                args={{
                  form_of_address: formOfAddress,
                  name: personName,
                }}
              />
            </p>
          </Alert>
          <Button onClick={setIsOpenFalse} t='generic.back' />
        </Modal>
      )}
    </>
  );
};
