import { authProviders } from '#/auth/providers';
import { requireLogin } from '#/auth/server';
import { Changelog } from '#/components/changelog';
import { SystemRequirements } from '#/components/system-requirements';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { SchulhofLoginHeader } from './heading';

export default async function Page() {
  await requireLogin(false);

  const provider = 'password';

  const {
    login: { LoginForm },
  } = authProviders[provider];

  return (
    <>
      <Col w='12'>
        <Breadcrumbs path={['paths.schulhof', 'paths.schulhof.login']} />
        <Heading size='1'>
          <SchulhofLoginHeader />
        </Heading>
      </Col>
      <Col w='4'>
        <Heading size='2'>
          <T t='schulhof.login.login.title' />
        </Heading>
        <p>
          <T t='schulhof.login.login.description' />
        </p>
        <LoginForm />
        <Changelog />
      </Col>
      <Col w='4'>
        <SystemRequirements />
      </Col>
    </>
  );
}
