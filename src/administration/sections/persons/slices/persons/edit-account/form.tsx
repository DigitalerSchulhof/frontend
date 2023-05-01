'use client';

import {
  EditAccountInput,
  EditAccountOutputNotOk,
  EditAccountOutputOk,
} from '#/app/api/schulhof/administration/persons/persons/edit-account/route';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { FormState, useSend } from '#/utils/form';
import { useCallback, useMemo, useRef } from 'react';

export const EditAccountForm = ({
  isOwnProfile,
  personId,
  username,
  email,
}: {
  isOwnProfile: boolean;
  personId: string;
  username: string;
  email: string;
}) => {
  const own = isOwnProfile ? 'own' : 'other';

  const usernameRef = useRef<{ value: string }>(null);
  const emailRef = useRef<{ value: string }>(null);

  const [sendEditAccount, modal] = useSubmit(
    isOwnProfile,
    personId,
    usernameRef,
    emailRef
  );

  return (
    <Form onSubmit={sendEditAccount}>
      {modal}
      <Table>
        <TextFormRow
          label='schulhof.administration.sections.persons.slices.persons.edit-account.form.username'
          autoComplete='username'
          defaultValue={username}
          ref={usernameRef}
        />
        <TextFormRow
          label='schulhof.administration.sections.persons.slices.persons.edit-account.form.email'
          autoComplete='email'
          defaultValue={email}
          ref={emailRef}
        />
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant={Variant.Success}
          t='schulhof.administration.sections.persons.slices.persons.edit-account.form.buttons.save'
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
                  'paths.schulhof.administration.persons.persons',
                  `{${personId}}`,
                ]
          }
          t={`schulhof.administration.sections.persons.slices.persons.edit-account.form.buttons.back.${own}`}
        />
      </ButtonGroup>
    </Form>
  );
};

type FormError = 'internal-error';

function useSubmit(
  isOwnProfile: boolean,
  personId: string,
  usernameRef: React.RefObject<{ value: string }>,
  emailRef: React.RefObject<{ value: string }>
) {
  const { t } = useT();

  return useSend<
    EditAccountInput,
    EditAccountOutputOk,
    EditAccountOutputNotOk,
    FormError
  >(
    '/api/schulhof/administration/persons/persons/edit-account',
    useCallback(
      () => ({
        personId,
        username: usernameRef.current!.value,
        email: emailRef.current!.value,
      }),
      [personId, usernameRef, emailRef]
    ),
    useMemo(() => ({}), []),
    useCallback(
      (state, errors, close) => {
        switch (state) {
          case FormState.Loading:
            return (
              <LoadingModal
                title='schulhof.administration.sections.persons.slices.persons.edit-account.modals.loading.title'
                description='schulhof.administration.sections.persons.slices.persons.edit-account.modals.loading.description'
              />
            );
          case FormState.Error: {
            const errorReasons = errors.flatMap((err) =>
              t(
                `schulhof.administration.sections.persons.slices.persons.edit-account.modals.error.reasons.${err}`
              )
            );

            return (
              <Modal onClose={close}>
                <Alert
                  variant={Variant.Error}
                  title='schulhof.administration.sections.persons.slices.persons.edit-account.modals.error.title'
                >
                  <p>
                    <T t='schulhof.administration.sections.persons.slices.persons.edit-account.modals.error.description' />
                  </p>
                  <ul>
                    {errorReasons.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </Alert>
                <ButtonGroup>
                  <Button onClick={close} t='generic.back' />
                </ButtonGroup>
              </Modal>
            );
          }
          case FormState.Success: {
            const own = isOwnProfile ? 'own' : 'other';

            return (
              <Modal onClose={close}>
                <Alert
                  variant={Variant.Success}
                  title='schulhof.administration.sections.persons.slices.persons.edit-account.modals.success.title'
                >
                  <p>
                    <T t='schulhof.administration.sections.persons.slices.persons.edit-account.modals.success.description' />
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
                            'paths.schulhof.administration.persons.persons',
                            `{${personId}}`,
                          ]
                    }
                    t={`schulhof.administration.sections.persons.slices.persons.edit-account.modals.success.button.${own}`}
                  />
                </ButtonGroup>
              </Modal>
            );
          }
        }
      },
      [t, isOwnProfile, personId]
    )
  );
}
