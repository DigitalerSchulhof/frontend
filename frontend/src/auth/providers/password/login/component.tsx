'use client';

import { T } from '#/i18n';
import { Button } from '#/ui/Button';
import { Form, FormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { useRef } from 'react';
import { PrivacyNote } from './privacy-note';

export const LoginForm = () => {
  function doLogin() {
    console.log('YO');
    console.log(usernameRef.current?.value);
    console.log(passwordRef.current?.value);
  }

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <Form onSubmit={doLogin}>
      {/* {loadingComponent ?? errorComponent} */}
      <Table>
        <Table.Body>
          <FormRow
            label='{schulhof.login.login.providers.password.username}'
            autoComplete='username'
            ref={usernameRef}
          />
          <FormRow
            label='{schulhof.login.login.providers.password.password}'
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
        <Button href={['{paths.schulhof}', '{paths.schulhof.forgot-password}']}>
          <T t='schulhof.login.login.buttons.forgot-password' />
        </Button>
        <Button href={['{paths.schulhof}', '{paths.schulhof.register}']}>
          <T t='schulhof.login.login.buttons.register' />
        </Button>
      </div>
    </Form>
  );
};
