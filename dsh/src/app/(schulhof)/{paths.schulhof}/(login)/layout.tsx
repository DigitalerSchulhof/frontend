import { Changelog } from '#/components/changelog';
import { SystemRequirements } from '#/components/system-requirements';
import { T } from '#/i18n';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { LoginBreadcrumbs } from './breadcrumbs';
import { SchulhofLoginHeading } from './heading';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Col w='12'>
        <LoginBreadcrumbs />
        <Heading size='1'>
          <SchulhofLoginHeading />
        </Heading>
      </Col>
      <Col w='4'>
        <Heading size='2'>
          <T t='schulhof.login.action.login.title' />
        </Heading>
        <p>
          <T t='schulhof.login.action.login.description' />
        </p>
        {children}
        <Changelog />
      </Col>
      <Col w='4'>
        <SystemRequirements />
      </Col>
    </>
  );
}
