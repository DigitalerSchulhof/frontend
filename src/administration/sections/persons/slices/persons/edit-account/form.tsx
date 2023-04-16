'use client';

import {
  EditAccountInput,
  EditAccountOutputNotOk,
} from '#/app/api/schulhof/administration/persons/persons/edit-account/route';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, FormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { sleep } from '#/utils';
import { useCallback, useMemo, useRef, useState } from 'react';

enum FormState {
  Idle,
  Loading,
  Error,
  Success,
}

export enum FormError {
  InternalError = 'internal-error',
}

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
  const [formState, setFormState] = useState<FormState>(FormState.Idle);
  const [formErrors, setFormErrors] = useState<readonly FormError[]>([]);

  const own = isOwnProfile ? 'own' : 'other';

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const sendEditAccount = useSendEditAccount(
    personId,
    usernameRef,
    emailRef,
    setFormState,
    setFormErrors
  );

  const modal = useEditAccountStateModal(
    isOwnProfile,
    personId,
    formState,
    formErrors,
    setFormState
  );

  return (
    <Form onSubmit={sendEditAccount}>
      {modal}
      <Table>
        <Table.Body>
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.edit-account.form.username'
            autoComplete='username'
            defaultValue={username}
            ref={usernameRef}
          />
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.edit-account.form.email'
            autoComplete='email'
            defaultValue={email}
            ref={emailRef}
          />
        </Table.Body>
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

function useSendEditAccount(
  personId: string,
  usernameRef: React.RefObject<HTMLInputElement>,
  emailRef: React.RefObject<HTMLInputElement>,
  setFormState: (s: FormState) => void,
  setFormErrors: (e: readonly FormError[]) => void
) {
  const log = useLog();

  return useCallback(
    async function sendEditAccount() {
      const username = usernameRef.current!.value;
      const email = emailRef.current!.value;

      setFormState(FormState.Loading);

      const [res] = await Promise.all([
        fetch('/api/schulhof/administration/persons/persons/edit-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personId,
            username,
            email,
          } satisfies EditAccountInput),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        const bodyString = await res.text();
        setFormState(FormState.Error);
        let body: EditAccountOutputNotOk;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          setFormErrors([FormError.InternalError]);
          if (e instanceof SyntaxError) {
            log.error('Unknown error while editing account', {
              personId,
              username,
              email,
              status: res.status,
              body: bodyString,
            });
            return;
          }

          throw e;
        }

        const errors: FormError[] = [];
        for (const error of body.errors) {
          switch (error.code) {
            default:
              if (!errors.includes(FormError.InternalError)) {
                errors.push(FormError.InternalError);
              }

              log.error('Unknown error while editing account', {
                personId,
                username,
                email,
                status: res.status,
                body,
                code: error.code,
              });
              break;
          }
        }

        setFormErrors(errors);
        return;
      }

      setFormState(FormState.Success);
    },
    [personId, usernameRef, emailRef, setFormState, setFormErrors, log]
  );
}

function useEditAccountStateModal(
  isOwnProfile: boolean,
  personId: string,
  state: FormState,
  formErrors: readonly FormError[],
  setFormState: (s: FormState) => void
) {
  const { t } = useT();

  const setIdle = useCallback(
    () => setFormState(FormState.Idle),
    [setFormState]
  );

  return useMemo(() => {
    switch (state) {
      case FormState.Idle:
        return null;
      case FormState.Loading:
        return (
          <LoadingModal
            title='schulhof.administration.sections.persons.slices.persons.edit-account.modals.loading.title'
            description='schulhof.administration.sections.persons.slices.persons.edit-account.modals.loading.description'
          />
        );
      case FormState.Error: {
        const errorReasons = formErrors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.slices.persons.edit-account.modals.error.reasons.${err}`
          )
        );

        return (
          <Modal onClose={setIdle}>
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
              <Button onClick={setIdle} t='generic.back' />
            </ButtonGroup>
          </Modal>
        );
      }
      case FormState.Success: {
        const own = isOwnProfile ? 'own' : 'other';

        return (
          <Modal onClose={setIdle}>
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
  }, [isOwnProfile, personId, state, formErrors, setIdle, t]);
}
