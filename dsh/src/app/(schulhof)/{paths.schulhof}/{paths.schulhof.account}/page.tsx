import { requireLogin } from '#/auth/server';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { getLastLoginAndSetCookie } from './last-login';

export default async function Page() {
  const { person, account, session } = await requireLogin();

  const lastLogin = getLastLoginAndSetCookie(account, session);

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
        <p>{lastLogin}</p>
      </Col>
    </>
  );
}
