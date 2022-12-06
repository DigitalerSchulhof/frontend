import { useT } from '@dsh/core';
import { Breadcrumbs } from '@dsh/ui/Breadcrumbs';
import { NextPage } from 'next';
import React from 'react';
import { useRequireLogin } from '../../..';

const Page: NextPage = () => {
  const { t, T } = useT();
  useRequireLogin(false);

  return (
    <>
      <Breadcrumbs path={[t('paths.index'), t('paths.login')]} />
      <Heading size="1">{t('login.welcome')}</Heading>
      <Cols n="3">
        <Col>
          <Heading size="2">{t('login.title')}</Heading>
          <T as="p">login.description</T>
          <Form></Form>
          <T
            as={Note}
            vars={{
              PrivacyLink: (c) => <Link href="/privacy">{c}</Link>,
            }}
          >
            login.privacy
          </T>
          <Button variant="yes">{t('login.buttons.login')}</Button>
          <Button>{t('login.buttons.password')}</Button>
          <Button>{t('login.buttons.register')}</Button>
        </Col>
      </Cols>
    </>
  );
};

export default Page;

const Heading = (...args: any) => args[0].children;
const Cols = (...args: any) => args[0].children;
const Col = (...args: any) => args[0].children;
const Form = (...args: any) => args[0].children;
const Note = (...args: any) => args[0].children;
const Button = (...args: any) => args[0].children;
const Link = (...args: any) => args[0].children;