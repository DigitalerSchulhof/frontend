import { useT } from '@i18n';
import { Breadcrumbs } from '@UI/Breadcrumbs';
import { Col } from '@UI/Col';
import { Flex } from '@UI/Flex';
import { Heading } from '@UI/Heading';
import { Link } from '@UI/Link';
import { Note } from '@UI/Note';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useSettings } from '../../../settings';

export interface LoginProviderProps {
  privacyNote: JSX.Element;
}

export type LoginProvider = React.ComponentType<LoginProviderProps>;

const LoginProviderPassword = dynamic(() =>
  import('../../../schulhof/login/providers/password').then(
    (res) => res.PasswordLoginProvider
  )
);

const Page: NextPage = () => {
  const t = useT();
  const settings = useSettings();
  // useRequireLogin(false);

  // TODO: Dynamically load login provider
  const LoginProvider = (
    {
      password: LoginProviderPassword,
    } satisfies Record<string, LoginProvider>
  )['password'];

  return (
    <Flex>
      <Col nr="1">
        <Breadcrumbs path={[t('paths.schulhof'), t('paths.schulhof.login')]} />
        <Heading size="1">
          {t('schulhof.login.welcome', {
            school_name_genus: settings.school.name.genus,
            school_name_genitive: settings.school.name.genitive,
          })}
        </Heading>
      </Col>
      <Col nr="3">
        <Heading size="2">{t('schulhof.login.login.title')}</Heading>
        <p>{t('schulhof.login.login.description')}</p>
        <LoginProvider
          privacyNote={
            <>
              {t('schulhof.login.login.privacy', {
                PrivacyLink: (c) =>
                  c.map((e) => <Link href={[t('paths.privacy')]}>{e}</Link>),
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
