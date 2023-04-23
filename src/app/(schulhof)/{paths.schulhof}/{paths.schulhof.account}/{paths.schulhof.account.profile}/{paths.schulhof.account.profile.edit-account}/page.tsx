import { EditAccount } from '#/administration/sections/persons/slices/persons/edit-account';
import { useRequireLogin } from '#/auth';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  const { context } = await useRequireLogin();

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
      {/* @ts-expect-error -- Server Component */}
      <EditAccount
        isOwnProfile
        person={context.person}
        account={context.account}
      />
    </>
  );
}
