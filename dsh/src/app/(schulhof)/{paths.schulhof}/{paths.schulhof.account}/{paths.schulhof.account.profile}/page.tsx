import { PersonDetails } from '#/administration/sections/persons/slices/persons/details';
import { useRequireLogin } from '#/auth/server/require-login';
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
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.title' />
      </Col>
      {/* @ts-expect-error -- Server Component */}
      <PersonDetails context={context} person={person} account={account} />
    </>
  );
}
