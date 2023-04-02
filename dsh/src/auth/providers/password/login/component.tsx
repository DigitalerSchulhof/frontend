'use client';

import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button } from '#/ui/Button';
import { Form, FormRow } from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import { Link } from '#/ui/Link';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Note } from '#/ui/Note';
import { Table } from '#/ui/Table';
import { sleep } from '#/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';

export const LoginForm = () => {
  const { t } = useT();
  const router = useRouter();
  const log = useLog();

  const [isFetching, setFetching] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  async function doLogin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    setFetching(true);

    const [res] = await Promise.all([
      fetch('/api/schulhof/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'password',
          username,
          password,
        }),
      }),
      // Avoid flashing the loading dialogue
      sleep(500),
    ]);

    if (!res.ok) {
      setFetching(false);
      setErrorStatus(res.status);
      return;
    }

    const body = await res.json();

    Cookies.set('jwt', body.jwt);
    router.refresh();
  }

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const loadingComponent = useMemo(() => {
    if (!isFetching) return null;

    return (
      <LoadingModal
        title={'schulhof.login.modal.loading.title'}
        description={'schulhof.login.modal.loading.description'}
      />
    );
  }, [isFetching]);

  const errorComponent = useMemo(() => {
    if (errorStatus === null) return null;

    let errorReasons: string[];
    if (errorStatus === 401) {
      errorReasons = t('schulhof.login.modal.error.codes.invalid-credentials');
    } else {
      log.error('Login error', {
        username: usernameRef.current?.value,
        errorStatus,
      });

      errorReasons = t('schulhof.login.modal.error.codes.internal');
    }

    return (
      <Modal onClose={() => setErrorStatus(null)}>
        <Alert variant='error'>
          <Heading size='4'>
            <T t='schulhof.login.modal.error.title' />
          </Heading>
          <p>
            <T t='schulhof.login.modal.error.description' />
          </p>
          <ul>
            {errorReasons.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Alert>
        <Button onClick={() => setErrorStatus(null)}>
          <T t='generic.back' />
        </Button>
      </Modal>
    );
  }, [errorStatus, log, t]);

  return (
    <Form onSubmit={() => void doLogin()}>
      {loadingComponent ?? errorComponent}
      <Table>
        <Table.Body>
          <FormRow
            label='schulhof.login.login.providers.password.username'
            autoComplete='username'
            ref={usernameRef}
          />
          <FormRow
            label='schulhof.login.login.providers.password.password'
            autoComplete='current-password'
            type='password'
            ref={passwordRef}
          />
        </Table.Body>
      </Table>
      {t('schulhof.login.login.privacy', {
        PrivacyLink: (c) =>
          // eslint-disable-next-line react/jsx-key
          c.map((e) => <Link href={['paths.privacy']}>{e}</Link>),
      }).map((s, i) => (
        <Note key={i}>{s}</Note>
      ))}
      <div>
        <Button type='submit' variant='success'>
          <T t='schulhof.login.login.buttons.login' />
        </Button>
        <Button href={['paths.schulhof', 'paths.schulhof.forgot-password']}>
          <T t='schulhof.login.login.buttons.forgot-password' />
        </Button>
        <Button href={['paths.schulhof', 'paths.schulhof.register']}>
          <T t='schulhof.login.login.buttons.register' />
        </Button>
      </div>
    </Form>
  );
};
