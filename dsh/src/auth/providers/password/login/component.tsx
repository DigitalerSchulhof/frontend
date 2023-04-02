'use client';

import Cookies from 'js-cookie';
import { T, useT } from '#/i18n/t';
import { Button } from '#/ui/Button';
import { Form, FormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { useRef } from 'react';
import { PrivacyNote } from './privacy-note';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const { t } = useT();
  const router = useRouter();

  async function doLogin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const res = await fetch('/api/schulhof/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'password',
        username,
        password,
      }),
    });

    if (!res.ok) {
      console.log('NOT OK');
      return;
    }

    const body = await res.json();

    Cookies.set('jwt', body.jwt);
    router.refresh();
  }

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <Form onSubmit={() => void doLogin()}>
      {/* {loadingComponent ?? errorComponent} */}
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
      <PrivacyNote />
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
