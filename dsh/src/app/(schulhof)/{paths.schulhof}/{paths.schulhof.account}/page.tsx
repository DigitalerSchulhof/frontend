import { requireLogin } from '#/auth/server';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { Link } from '#/ui/Link';
import { getLastLoginAndUpdateDidShow } from './last-login';

export default async function Page() {
  const { context, person, account, session } = await requireLogin();

  const lastLogin = await getLastLoginAndUpdateDidShow(
    context,
    account,
    session
  );

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
        {lastLogin ? <p>{lastLogin}</p> : null}
      </Col>
      <Col w='6'>
        <Link href={['paths.schulhof', 'paths.schulhof.administration']}>
          Zum Verwaltungsbereich
        </Link>
      </Col>
    </>
  );
}
