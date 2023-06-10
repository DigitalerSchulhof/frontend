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
import action from './action';

export type AccountFormPerson = {
  id: string;
  rev: string;
};

export type AccountFormAccount = {
  rev: string;
  username: string;
  email: string;
};

export const AccountForm = ({
  isOwnProfile = false,
  person,
  account,
}: {
  isOwnProfile?: boolean;
  person: AccountFormPerson;
  account: AccountFormAccount | null;
}) => {
  const mode = account === null ? 'create' : 'edit';
  const own = isOwnProfile ? 'own' : 'other';

  const { username = '', email = '' } = account ?? {};

  const usernameRef = useRef<{ value: string }>(null);
  const emailRef = useRef<{ value: string }>(null);

  const [send, modal] = useSubmit();

  return (
    <Form onSubmit={send}>
      {modal}
      <Table>
        <TextFormRow
          label={`schulhof.administration.sections.persons.${mode}-account.form.username`}
          autoComplete='username'
          defaultValue={username}
          ref={usernameRef}
        />
        <TextFormRow
          label={`schulhof.administration.sections.persons.${mode}-account.form.email`}
          autoComplete='email'
          defaultValue={email}
          ref={emailRef}
        />
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant='success'
          t={`schulhof.administration.sections.persons.${mode}-account.form.buttons.save`}
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
                  `{${person.id}}`,
                ]
          }
          t={`schulhof.administration.sections.persons.${mode}-account.form.buttons.back.${own}`}
        />
      </ButtonGroup>
    </Form>
  );

  function useSubmit() {
    const { t } = useT();

    return useSend(
      useCallback(
        () =>
          unwrapAction(
            action(person.id, person.rev, account?.rev ?? null, {
              username: usernameRef.current!.value,
              email: emailRef.current!.value,
            })
          ),
        [person, account]
      ),
      useCallback(
        () => (
          <LoadingModal
            title={`schulhof.administration.sections.persons.${mode}-account.modals.loading.title`}
            description={`schulhof.administration.sections.persons.${mode}-account.modals.loading.description`}
          />
        ),
        [mode]
      ),
      useCallback(
        (close, errors) => {
          const reasons = errors.flatMap((err) =>
            t(
              `schulhof.administration.sections.persons.${mode}-account.modals.error.reasons.${mapError(
                err
              )}`
            )
          );

          return (
            <ErrorModal
              close={close}
              title={`schulhof.administration.sections.persons.${mode}-account.modals.error.title`}
              description={`schulhof.administration.sections.persons.${mode}-account.modals.error.description`}
              reasons={reasons}
            />
          );
        },
        [t, mode]
      ),
      useCallback(() => {
        return (
          <Modal onClose={close}>
            <Alert
              variant='success'
              title={`schulhof.administration.sections.persons.${mode}-account.modals.success.title`}
            >
              <p>
                <T
                  t={`schulhof.administration.sections.persons.${mode}-account.modals.success.description`}
                />
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
                        `{${person.id}}`,
                      ]
                }
                t={`schulhof.administration.sections.persons.${mode}-account.modals.success.button.${own}`}
              />
            </ButtonGroup>
          </Modal>
        );
      }, [own, person, mode])
    );
  }
};

function mapError(err: string) {
  switch (err) {
    default:
      return 'internal-error' as const;
  }
}
