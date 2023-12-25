import { requireLogin } from '#/auth/component';
import { TemporaryPasswordWarning } from '#/components/temporary-password-warning';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Button, ButtonGroup } from '#/ui/Button';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { Link } from '#/ui/Link';
import { getLastLoginAndUpdateDidShow } from './last-login';

export default async function Page() {
  const context = await requireLogin(null);

  const person = await context.getPerson();

  const lastLogin = await getLastLoginAndUpdateDidShow(context, person);

  const shouldShowTemporaryPasswordWarning =
    person.account.passwordExpiresAt !== null;

  return (
    <>
      <Col w='12'>
        <Breadcrumbs path={['paths.schulhof', 'paths.schulhof.account']} />
        <Heading size='1'>
          <T
            t='schulhof.account.title'
            args={{
              person_firstname: person.firstname,
              person_lastname: person.lastname,
            }}
          />
        </Heading>
        {lastLogin}
        {shouldShowTemporaryPasswordWarning ? (
          <TemporaryPasswordWarning />
        ) : null}
      </Col>
      <Col w='4'>
        <Link href={['paths.schulhof', 'paths.schulhof.administration']}>
          Zum Verwaltungsbereich
        </Link>
      </Col>
      <Col w='4' />
      <Col w='4'>
        <Heading size='2' t='schulhof.account.profile.title' />
        <ButtonGroup>
          <Button
            href={[
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
            ]}
            t='schulhof.account.profile.details'
          />
          <Button
            href={[
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
              'paths.schulhof.account.profile.account-settings',
            ]}
            t='schulhof.account.profile.account-settings'
          />
        </ButtonGroup>
      </Col>
    </>
  );
}
