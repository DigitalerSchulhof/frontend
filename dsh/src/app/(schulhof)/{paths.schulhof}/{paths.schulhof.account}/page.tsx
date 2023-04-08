import { getCurrentUser, requireLogin } from '#/auth/server';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  await requireLogin(true);

  const user = await getCurrentUser();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs path={['paths.schulhof', 'paths.schulhof.account']} />
        <Heading size='1'>
          <T
            t='schulhof.account.title'
            args={{
              user_firstname: 'yo',
              user_lastname: 'yo',
            }}
          />
        </Heading>
      </Col>
    </>
  );
}
