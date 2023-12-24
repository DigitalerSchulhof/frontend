'use client';

import { makeLink, useT } from '#/i18n';
import { Form } from '#/ui/Form';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { sleep } from '#/utils';
import { useSend } from '#/utils/form';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import action from './action';

export const LoginForm = ({ children }: { children: React.ReactNode }) => {
  const submit = useSubmit();

  return <Form submit={submit}>{children}</Form>;
};

function useSubmit() {
  const { t } = useT();
  const router = useRouter();

  return useSend(
    useCallback(async (formData: FormData) => {
      const [res] = await Promise.all([
        action(formData),
        // Because we don't show a dialog on success (we redirect immediately),
        // we intentionally put this delay here in order to not flash the login modal for a few milliseconds.
        sleep(500),
      ]);

      return res;
    }, []),
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.login.actions.login.modals.loading.title'
          description='schulhof.login.actions.login.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, _, errors) => {
        const forgotPasswordLink = makeLink([
          'paths.schulhof',
          'paths.schulhof.forgot-password',
        ]);

        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.login.actions.login.modals.error.reasons.${mapError(
              err.code
            )}`,
            {
              ForgotPasswordLink: forgotPasswordLink,
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
    useCallback(() => {
      // Redirect here instead so we keep the modal open while the new page is loading
      router.push(
        `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
      );

      return (
        <LoadingModal
          title='schulhof.login.actions.login.modals.loading.title'
          description='schulhof.login.actions.login.modals.loading.description'
        />
      );
    }, [router, t])
  );
}

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
