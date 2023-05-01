'use client';

import {
  LoginInput,
  LoginOutputNotOk,
  LoginOutputOk,
} from '#/app/api/schulhof/auth/login/route';
import { FormOfAddress } from '#/backend/repositories/content/account';
import { T, makeLink } from '#/i18n';
import { useT } from '#/i18n/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Note } from '#/ui/Note';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { FormState, useSend } from '#/utils/form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

type FormError = 'internal-error' | 'invalid-credentials' | 'password-expired';

export const LoginForm = () => {
  const { t } = useT();
  const router = useRouter();

  const [formState, setFormState] = useState(FormState.Idle);

  const [formOfAddress, setFormOfAddress] = useState<FormOfAddress>();

  const usernameRef = useRef<{ value: string }>(null);
  const passwordRef = useRef<{ value: string }>(null);

  const [sendLogin, formErrors] = useSend<
    LoginInput,
    LoginOutputOk,
    LoginOutputNotOk,
    FormError
  >(
    '/api/schulhof/auth/login',
    setFormState,
    useCallback(
      () => ({
        username: usernameRef.current!.value,
        password: passwordRef.current!.value,
      }),
      [usernameRef, passwordRef]
    ),
    useMemo(
      () => ({
        INVALID_CREDENTIALS: 'invalid-credentials',
        PASSWORD_EXPIRED: 'password-expired',
      }),
      []
    ),
    useCallback(
      (res: LoginOutputOk) => {
        Cookies.set('jwt', res.jwt);
        router.push(
          `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
        );
      },
      [router, t]
    ),
    useCallback(
      (res: LoginOutputNotOk) => {
        for (const err of res.errors) {
          if (err.code === 'PASSWORD_EXPIRED') {
            setFormOfAddress(err.formOfAddress);
          }
        }
      },
      [setFormOfAddress]
    ),
    useMemo(
      () => ({
        editInput: ({ password: _, ...inputWithoutPassword }) =>
          inputWithoutPassword,
      }),
      []
    )
  );

  const modal = useLoginStateModal(
    formOfAddress,
    formState,
    formErrors,
    setFormState
  );

  return (
    <Form onSubmit={sendLogin}>
      {modal}
      <Table>
        <TextFormRow
          label='schulhof.login.actions.login.form.username'
          autoComplete='username'
          ref={usernameRef}
        />
        <TextFormRow
          label='schulhof.login.actions.login.form.password'
          autoComplete='current-password'
          type='password'
          ref={passwordRef}
        />
      </Table>
      {t('schulhof.login.actions.login.privacy', {
        PrivacyLink: makeLink(['paths.privacy']),
      }).map((s, i) => (
        <Note key={i}>{s}</Note>
      ))}
      <ButtonGroup>
        <Button
          type='submit'
          variant={Variant.Success}
          t='schulhof.login.actions.login.form.buttons.login'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.forgot-password']}
          t='schulhof.login.actions.login.form.buttons.forgot-password'
        />
        <Button
          href={['paths.schulhof', 'paths.schulhof.register']}
          t='schulhof.login.actions.login.form.buttons.register'
        />
      </ButtonGroup>
    </Form>
  );
};

function useLoginStateModal(
  formOfAddress: FormOfAddress | undefined,
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
      // We redirect on success, so we let keep the loading animation until the redirect is completed
      case FormState.Success:
      case FormState.Loading:
        return (
          <LoadingModal
            title='schulhof.login.actions.login.modals.loading.title'
            description='schulhof.login.actions.login.modals.loading.description'
          />
        );
      case FormState.Error: {
        const errorReasons = formErrors.flatMap((err) =>
          t(`schulhof.login.actions.login.modals.error.reasons.${err}`, {
            form_of_address: formOfAddress!,
            ForgotPasswordLink: makeLink([
              'paths.schulhof',
              'paths.schulhof.forgot-password',
            ]),
          })
        );

        return (
          <Modal onClose={setIdle}>
            <Alert
              variant={Variant.Error}
              title='schulhof.login.actions.login.modals.error.title'
            >
              <p>
                <T t='schulhof.login.actions.login.modals.error.description' />
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
    }
  }, [formOfAddress, state, formErrors, setIdle, t]);
}
