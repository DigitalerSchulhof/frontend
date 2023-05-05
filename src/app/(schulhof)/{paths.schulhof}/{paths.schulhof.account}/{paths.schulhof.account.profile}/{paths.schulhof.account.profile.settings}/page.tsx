import { Settings } from '#/administration/sections/persons/slices/persons/settings';
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
            'paths.schulhof.account.profile.settings',
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.settings.title' />
      </Col>
      {/* @ts-expect-error -- Server Component */}
      <Settings
        isOwnProfile
        person={context.person}
        account={context.account}
      />
    </>
  );
}
