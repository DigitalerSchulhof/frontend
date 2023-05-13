import { Changelog } from '#/components/changelog';
import { SystemRequirements } from '#/components/system-requirements';
import { requireNoLogin } from '#/auth/component';
import { T } from '#/i18n';
import { getSettings } from '#/settings/server';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { LoginBreadcrumbs } from './breadcrumbs';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireNoLogin();
  const settings = await getSettings();

  return (
    <>
      <Col w='12'>
        <LoginBreadcrumbs />
        <Heading size='1'>
          <T
            t='schulhof.login.heading'
            args={{
              school_name_genus: settings.school.name.genus,
              school_name_genitive: settings.school.name.genitive,
            }}
          />
        </Heading>
      </Col>
      <Col w='4'>
        <Heading size='2' t='schulhof.login.actions.login.title' />
        <p>
          <T t='schulhof.login.actions.login.subtitle' />
        </p>
        {children}
      </Col>
      <Col w='4'>
        <SystemRequirements />
      </Col>
      <Col w='12'>
        <Changelog />
      </Col>
    </>
  );
}
