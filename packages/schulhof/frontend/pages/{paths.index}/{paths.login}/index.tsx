import { getLoginProviders, useAuth } from '@dsh/auth/frontend';
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
  const { t, T } = useT();
  useRequireLogin(false);

  const { setJWT } = useAuth();
  const [LoginProvider] = getLoginProviders();

  return (
    <Flex>
      <Col nr="1">
        <Breadcrumbs path={[t('paths.index'), t('paths.login')]} />
        <Heading size="1">{t('login.welcome')}</Heading>
      </Col>
      <Col nr="3">
        <Heading size="2">{t('login.title')}</Heading>
        <T as="p">login.description</T>
        <LoginProvider
          submitJwt={setJWT}
          privacyNote={
            <T
              as={Note}
              vars={{
                PrivacyLink: (c) => (
                  <Link href={`/${t('paths.privacy')}`}>{c}</Link>
                ),
              }}
            >
              login.privacy
            </T>
          }
        />
      </Col>
    </Flex>
  );
};

export default Page;
