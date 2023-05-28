'use client';

import { T } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Modal } from '#/ui/Modal';
import { useToggle } from '#/utils/client';

export const NoAccountButton = ({ personName }: { personName: string }) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();

  return (
    <>
      <Button
        onClick={setIsOpenTrue}
        variant='disabled'
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
                t='schulhof.administration.sections.persons.details.personal-data.actions.write-message.errors.no-account'
                args={{
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
