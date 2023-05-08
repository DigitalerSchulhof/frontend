'use client';

import { FormOfAddress } from '#/backend/repositories/content/account';
import { makeLink, useT } from '#/i18n';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, TextFormRow } from '#/ui/Form';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { Note } from '#/ui/Note';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { login } from './action';

export const LoginForm = () => {
  const { t } = useT();

  const usernameRef = useRef<{ value: string }>(null);
  const passwordRef = useRef<{ value: string }>(null);

  const [sendLogin, modal] = useSubmit(usernameRef, passwordRef);

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

function mapError(err: string) {
  switch (err) {
    case 'INVALID_CREDENTIALS':
      return 'invalid-credentials';
    case 'PASSWORD_EXPIRED':
      return 'password-expired';
    default:
      return 'internal-error';
  }
}

function useSubmit(
  usernameRef: React.RefObject<{ value: string }>,
  passwordRef: React.RefObject<{ value: string }>
) {
  const { t } = useT();
  const router = useRouter();

  const makeLoading = useCallback(
    () => (
      <LoadingModal
        title='schulhof.login.actions.login.modals.loading.title'
        description='schulhof.login.actions.login.modals.loading.description'
      />
    ),
    []
  );

  return useSend(
    useCallback(async () => {
      const jwt = await unwrapAction(
        login(usernameRef.current!.value, passwordRef.current!.value)
      );

      Cookies.set('jwt', jwt);
      router.push(
        `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
      );
    }, [usernameRef, passwordRef, router, t]),
    makeLoading,
    useCallback(
      (close, _, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.login.actions.login.modals.error.reasons.${mapError(
              err.code
            )}`,
            {
              form_of_address: err.baggage?.formOfAddress as FormOfAddress,
              ForgotPasswordLink: makeLink([
                'paths.schulhof',
                'paths.schulhof.forgot-password',
              ]),
            }
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.login.actions.login.modals.error.title'
            description='schulhof.login.actions.login.modals.error.description'
            reasons={reasons}
          />
        );
      },
      [t]
    ),
    makeLoading
  );
}
