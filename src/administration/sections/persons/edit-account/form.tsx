'use client';

import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { Table } from '#/ui/Table';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import { useCallback, useRef } from 'react';
import { editAccount } from './action';

export const EditAccountForm = ({
  isOwnProfile,
  personId,
  personRev,
  username,
  email,
}: {
  isOwnProfile: boolean;
  personId: string;
  personRev: string;
  username: string;
  email: string;
}) => {
  const own = isOwnProfile ? 'own' : 'other';

  const usernameRef = useRef<{ value: string }>(null);
  const emailRef = useRef<{ value: string }>(null);

  const [sendEditAccount, modal] = useSubmit(
    isOwnProfile,
    personId,
    personRev,
    usernameRef,
    emailRef
  );

  return (
    <Form onSubmit={sendEditAccount}>
      {modal}
      <Table>
        <TextFormRow
          label='schulhof.administration.sections.persons.edit-account.form.username'
          autoComplete='username'
          defaultValue={username}
          ref={usernameRef}
        />
        <TextFormRow
          label='schulhof.administration.sections.persons.edit-account.form.email'
          autoComplete='email'
          defaultValue={email}
          ref={emailRef}
        />
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant='success'
          t='schulhof.administration.sections.persons.edit-account.form.buttons.save'
        />
        <Button
          href={
            isOwnProfile
              ? [
                  'paths.schulhof',
                  'paths.schulhof.account',
                  'paths.schulhof.account.profile',
                ]
              : [
                  'paths.schulhof',
                  'paths.schulhof.administration',
                  'paths.schulhof.administration.persons',
                  `{${personId}}`,
                ]
          }
          t={`schulhof.administration.sections.persons.edit-account.form.buttons.back.${own}`}
        />
      </ButtonGroup>
    </Form>
  );
};

function mapError(err: string) {
  switch (err) {
    default:
      return 'internal-error' as const;
  }
}

function useSubmit(
  isOwnProfile: boolean,
  personId: string,
  personRev: string,
  usernameRef: React.RefObject<{ value: string }>,
  emailRef: React.RefObject<{ value: string }>
) {
  const { t } = useT();

  return useSend(
    useCallback(
      () =>
        unwrapAction(
          editAccount(
            personId,
            personRev,
            usernameRef.current!.value,
            emailRef.current!.value
          )
        ),
      [personId, personRev, usernameRef, emailRef]
    ),
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.administration.sections.persons.edit-account.modals.loading.title'
          description='schulhof.administration.sections.persons.edit-account.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.edit-account.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.administration.sections.persons.edit-account.modals.error.title'
            description='schulhof.administration.sections.persons.edit-account.modals.error.description'
            reasons={reasons}
          />
        );
      },
      [t]
    ),
    useCallback(() => {
      const own = isOwnProfile ? 'own' : 'other';

      return (
        <Modal onClose={close}>
          <Alert
            variant='success'
            title='schulhof.administration.sections.persons.edit-account.modals.success.title'
          >
            <p>
              <T t='schulhof.administration.sections.persons.edit-account.modals.success.description' />
            </p>
          </Alert>
          <ButtonGroup>
            <Button
              href={
                isOwnProfile
                  ? [
                      'paths.schulhof',
                      'paths.schulhof.account',
                      'paths.schulhof.account.profile',
                    ]
                  : [
                      'paths.schulhof',
                      'paths.schulhof.administration',
                      'paths.schulhof.administration.persons',
                      `{${personId}}`,
                    ]
              }
              t={`schulhof.administration.sections.persons.edit-account.modals.success.button.${own}`}
            />
          </ButtonGroup>
        </Modal>
      );
    }, [personId, isOwnProfile])
  );
}
