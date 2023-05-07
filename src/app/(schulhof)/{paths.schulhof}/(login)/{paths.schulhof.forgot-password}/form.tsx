'use client';

import { forgotPassword } from './action';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import { useCallback, useRef } from 'react';

export const ForgotPasswordForm = () => {
  const usernameRef = useRef<{ value: string }>(null);
  const emailRef = useRef<{ value: string }>(null);

  const [sendForgotPassword, modal] = useSubmit(usernameRef, emailRef);

  return (
    <Form onSubmit={sendForgotPassword}>
      {modal}
      <Table>
        <TextFormRow
          label='schulhof.login.actions.forgot-password.form.username'
          autoComplete='username'
          ref={usernameRef}
        />
        <TextFormRow
          label='schulhof.login.actions.forgot-password.form.email'
          autoComplete='email'
          ref={emailRef}
        />
      </Table>
      <Alert
        variant={Variant.Information}
        title='schulhof.login.actions.forgot-password.info.title'
      >
        <p>
          <T t='schulhof.login.actions.forgot-password.info.content' />
        </p>
      </Alert>
      <ButtonGroup>
        <Button
          type='submit'
          variant={Variant.Success}
          t='schulhof.login.actions.forgot-password.form.buttons.send'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.login']}
          t='schulhof.login.actions.forgot-password.form.buttons.login'
        />
      </ButtonGroup>
    </Form>
  );
};

function mapError(err: string) {
  switch (err) {
    case 'INVALID_CREDENTIALS':
      return 'invalid-credentials';
    default:
      return 'internal-error';
  }
}

function useSubmit(
  usernameRef: React.RefObject<{ value: string }>,
  emailRef: React.RefObject<{ value: string }>
) {
  const { t } = useT();

  return useSend(
    useCallback(
      () =>
        unwrapAction(
          forgotPassword(usernameRef.current!.value, emailRef.current!.value)
        ),
      [usernameRef, emailRef]
    ),
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.login.actions.forgot-password.modals.loading.title'
          description='schulhof.login.actions.forgot-password.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, errors) => {
        const errorReasons = errors.flatMap((err) =>
          t(
            `schulhof.login.actions.forgot-password.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <Modal onClose={close}>
            <Alert
              variant={Variant.Error}
              title='schulhof.login.actions.forgot-password.modals.error.title'
            >
              <p>
                <T t='schulhof.login.actions.forgot-password.modals.error.description' />
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
      },
      [t]
    ),
    useCallback(
      (close, { email, formOfAddress }) => (
        <Modal onClose={close}>
          <Alert
            variant={Variant.Success}
            title='schulhof.login.actions.forgot-password.modals.success.title'
          >
            <p>
              <T
                t='schulhof.login.actions.forgot-password.modals.success.description'
                args={{
                  email,
                  form_of_address: formOfAddress,
                }}
              />
            </p>
          </Alert>
          <ButtonGroup>
            <Button
              href={['paths.schulhof', 'paths.schulhof.login']}
              t='schulhof.login.actions.forgot-password.modals.success.button'
            />
          </ButtonGroup>
        </Modal>
      ),
      []
    )
  );
}
