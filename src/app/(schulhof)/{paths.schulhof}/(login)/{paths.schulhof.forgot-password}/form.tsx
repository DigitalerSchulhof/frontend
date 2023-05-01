'use client';

import {
  ForgotPasswordInput,
  ForgotPasswordOutputNotOk,
  ForgotPasswordOutputOk,
} from '#/app/api/schulhof/auth/forgot-password/route';
import { FormOfAddress } from '#/backend/repositories/content/account';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { ErrorWithPayload } from '#/utils';
import { FormState, useSend } from '#/utils/form';
import { useCallback, useMemo, useRef, useState } from 'react';

type FormError = 'internal-error' | 'invalid-credentials';

export const ForgotPasswordForm = () => {
  const [formState, setFormState] = useState(FormState.Idle);

  const [formOfAddress, setFormOfAddress] = useState<FormOfAddress>();
  const [email, setEmail] = useState<string>();

  const usernameRef = useRef<{ value: string }>(null);
  const emailRef = useRef<{ value: string }>(null);

  const [sendForgotPassword, formErrors] = useSend<
    ForgotPasswordInput,
    ForgotPasswordOutputOk,
    ForgotPasswordOutputNotOk,
    FormError
  >(
    '/api/schulhof/auth/forgot-password',
    setFormState,
    useCallback(
      () => ({
        username: usernameRef.current!.value,
        email: emailRef.current!.value,
      }),
      [usernameRef, emailRef]
    ),
    useMemo(
      () => ({
        INVALID_CREDENTIALS: 'invalid-credentials',
      }),
      []
    ),
    useCallback(
      (res: ForgotPasswordOutputOk) => {
        setEmail(res.email);
        setFormOfAddress(res.formOfAddress);
      },
      [setFormOfAddress]
    )
  );

  const modal = useForgotPasswordStateModal(
    formOfAddress,
    email,
    formState,
    formErrors,
    setFormState
  );

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

function useForgotPasswordStateModal(
  formOfAddress: FormOfAddress | undefined,
  email: string | undefined,
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
            title='schulhof.login.actions.forgot-password.modals.loading.title'
            description='schulhof.login.actions.forgot-password.modals.loading.description'
          />
        );
      case FormState.Error: {
        const errorReasons = formErrors.flatMap((err) =>
          t(
            `schulhof.login.actions.forgot-password.modals.error.reasons.${err}`
          )
        );

        return (
          <Modal onClose={setIdle}>
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
              <Button onClick={setIdle} t='generic.back' />
            </ButtonGroup>
          </Modal>
        );
      }
      case FormState.Success:
        if (!formOfAddress || !email) {
          throw new ErrorWithPayload(
            'FormState.Success but formOfAddress or email is undefined',
            {
              formOfAddress,
              email,
            }
          );
        }

        return (
          <Modal onClose={setIdle}>
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
        );
    }
  }, [formOfAddress, email, state, formErrors, setIdle, t]);
}
