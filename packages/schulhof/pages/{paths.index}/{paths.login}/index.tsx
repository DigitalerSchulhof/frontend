import { useT } from '@dsh/core';
import { Breadcrumbs } from '@dsh/ui/Breadcrumbs';
import { Button } from '@dsh/ui/Button';
import { Col } from '@dsh/ui/Col';
import { Flex } from '@dsh/ui/Flex';
import { Heading } from '@dsh/ui/Heading';
import { Link } from '@dsh/ui/Link';
import { Note } from '@dsh/ui/Note';
import { NextPage } from 'next';
import React from 'react';
import { useRequireLogin } from '../../..';

const Page: NextPage = () => {
  const { t, T } = useT();
  useRequireLogin(false);

  return (
    <Flex>
      <Col nr="1">
        <Breadcrumbs path={[t('paths.index'), t('paths.login')]} />
        <Heading size="1">{t('login.welcome')}</Heading>
      </Col>
      <Col nr="3">
        <Heading size="2">{t('login.title')}</Heading>
        <T as="p">login.description</T>
        <Form></Form>
        <T
          as={Note}
          vars={{
            PrivacyLink: (c) => <Link href={`/${t('paths.privacy')}`}>{c}</Link>,
          }}
        >
          login.privacy
        </T>
        <Button variant="success">{t('login.buttons.login')}</Button>
        <Button>{t('login.buttons.password')}</Button>
        <Button>{t('login.buttons.register')}</Button>
      </Col>
    </Flex>
  );
};

export default Page;

const Form = (...args: any) => args[0].children;
