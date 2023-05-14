import { EditAccount } from '#/administration/sections/persons/edit-account';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  const context = await requireLogin();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.edit-account',
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.edit-account.title' />
      </Col>
      <Col w='6'>
        {/* @ts-expect-error -- Server Component */}
        <EditAccount
          isOwnProfile
          person={context.person}
          account={context.account}
        />
      </Col>
    </>
  );
}
