import { ChangePasswordForm } from '#/administration/sections/persons/change-password';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  const context = await requireLogin({
    permission: 'schulhof.administration.persons.change-password',
    context: {
      personId: '#self',
    },
  });

  const person = await context.getPerson();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.change-password',
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.change-password.title' />
      </Col>
      <Col w='12'>
        <ChangePasswordForm isOwnProfile person={person} />
      </Col>
    </>
  );
}
