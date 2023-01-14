import { getLoginProviders } from '@dsh/auth/frontend';
import { useT } from '@dsh/core/frontend';
import { Breadcrumbs } from '@dsh/ui/Breadcrumbs';
import { Col } from '@dsh/ui/Col';
import { Flex } from '@dsh/ui/Flex';
import { Link } from '@dsh/ui/Link';
import { Note } from '@dsh/ui/Note';
import { Heading } from '@dsh/ui/Heading';
import { NextPage } from 'next';
import React from 'react';
import { useRequireLogin } from '../../..';

const Page: NextPage = () => {
  const t = useT();
  useRequireLogin(false);

  const [LoginProvider] = getLoginProviders();

  return (
    <Flex>
      <Col nr="1">
        <Breadcrumbs path={[t('paths.index'), t('paths.login')]} />
        <Heading size="1">{t('login.welcome')}</Heading>
      </Col>
      <Col nr="3">
        <Heading size="2">{t('login.title')}</Heading>
        <p>{t('login.description')}</p>
        <LoginProvider
          privacyNote={
            <>
              {t('login.privacy', {
                PrivacyLink: (c) => (
                  <Link href={`/${t('paths.privacy')}`}>{c}</Link>
                ),
              }).map((s, i) => (
                <Note key={i}>{s}</Note>
              ))}
            </>
          }
        />
      </Col>
    </Flex>
  );
};

export default Page;
