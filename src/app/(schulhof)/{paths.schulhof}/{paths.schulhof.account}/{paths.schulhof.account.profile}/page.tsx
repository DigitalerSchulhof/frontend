import { PersonDetails } from '#/administration/sections/persons/slices/persons/details';
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
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.title' />
      </Col>
      <Col w='6'>
        {/* @ts-expect-error -- Server Component */}
        <PersonDetails
          context={context}
          isOwnProfile
          person={context.person}
          account={context.account}
        />
      </Col>
    </>
  );
}
