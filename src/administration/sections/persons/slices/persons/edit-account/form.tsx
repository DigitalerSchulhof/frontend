'use client';

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

enum EditAccountState {
  Idle = 'idle',
  Loading = 'loading',
  InternalError = 'internal-error',
  Success = 'success',
}

export const EditAccountForm = ({
  accountId,
  username,
  email,
}: {
  accountId: string;
  username: string;
  email: string;
}) => {
  const [editAccountState, setEditAccountState] = useState<EditAccountState>(
    EditAccountState.Idle
  );

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const sendForgotPassword = useSendEditAccount(
    accountId,
    usernameRef,
    emailRef,
    setEditAccountState
  );

  const modal = useEditAccountStateModal(editAccountState, setEditAccountState);

  return (
    <Form onSubmit={sendForgotPassword}>
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
          href={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
          ]}
          t='schulhof.administration.sections.persons.slices.persons.edit-account.form.buttons.back'
        />
      </ButtonGroup>
    </Form>
  );
};

function useSendEditAccount(
  accountId: string,
  usernameRef: React.RefObject<HTMLInputElement>,
  emailRef: React.RefObject<HTMLInputElement>,
  setEditAccountState: (s: EditAccountState) => void
) {
  const log = useLog();

  return useCallback(
    async function sendForgotPassword() {
      const username = usernameRef.current!.value;
      const email = emailRef.current!.value;

      setEditAccountState(EditAccountState.Loading);

      const [res] = await Promise.all([
        fetch('/api/schulhof/auth/edit-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountId,
            username,
            email,
          }),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        const bodyString = await res.text();
        let body;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          if (e instanceof SyntaxError) {
            setEditAccountState(EditAccountState.InternalError);
            log.error('Unknown error while editing account', {
              username,
              email,
              status: res.status,
              body: bodyString,
            });
            return;
          }

          throw e;
        }

        switch (body.code) {
          default:
            setEditAccountState(EditAccountState.InternalError);
            log.error('Unknown error while editing account', {
              username,
              email,
              status: res.status,
              body,
            });
            return;
        }
      }

      setEditAccountState(EditAccountState.Success);
    },
    [accountId, usernameRef, emailRef, setEditAccountState, log]
  );
}

function useEditAccountStateModal(
  state: EditAccountState,
  setEditAccountState: (s: EditAccountState) => void
) {
  const { t } = useT();

  const setIdle = useCallback(
    () => setEditAccountState(EditAccountState.Idle),
    [setEditAccountState]
  );

  return useMemo(() => {
    switch (state) {
      case EditAccountState.Idle:
        return null;
      case EditAccountState.Loading:
        return (
          <LoadingModal
            title='schulhof.administration.sections.persons.slices.persons.edit-account.modals.loading.title'
            description='schulhof.administration.sections.persons.slices.persons.edit-account.modals.loading.description'
          />
        );
      case EditAccountState.InternalError: {
        const errorReasons = t(
          `schulhof.administration.sections.persons.slices.persons.edit-account.modals.error.reasons.${state}`
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
      case EditAccountState.Success:
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
                href={[
                  'paths.schulhof',
                  'paths.schulhof.account',
                  'paths.schulhof.account.profile',
                ]}
                t='schulhof.administration.sections.persons.slices.persons.edit-account.modals.success.button'
              />
            </ButtonGroup>
          </Modal>
        );
    }
  }, [state, setIdle, t]);
}
