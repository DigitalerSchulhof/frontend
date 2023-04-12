'use client';

import { FormOfAddress } from '#/backend/repositories/content/account';
import { T } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Modal } from '#/ui/Modal';
import { Variant } from '#/ui/variants';
import { useToggle } from '#/utils';

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
      <Button onClick={setIsOpenTrue} disabled>
        <T t='schulhof.account.profile.actions.write-message.button' />
      </Button>
      {isOpen && (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant={Variant.Error}>
            <Heading size='4'>
              <T
                t='schulhof.account.profile.actions.write-message.title'
                args={{
                  name: personName,
                }}
              />
            </Heading>
            <T
              t='schulhof.account.profile.actions.write-message.errors.no-permission'
              args={{
                form_of_address: formOfAddress,
                name: personName,
              }}
            />
          </Alert>
          <Button onClick={setIsOpenFalse}>
            <T t='generic.back' />
          </Button>
        </Modal>
      )}
    </>
  );
};
