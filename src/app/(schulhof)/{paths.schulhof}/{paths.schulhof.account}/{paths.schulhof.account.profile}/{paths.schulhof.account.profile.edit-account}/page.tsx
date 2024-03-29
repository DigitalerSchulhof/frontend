import { CreateEditAccountForm } from '#/administration/sections/persons/create-edit-account';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  const context = await requireLogin({
    permission: 'schulhof.administration.persons.edit-account',
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
            'paths.schulhof.account.profile.edit-account',
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.edit-account' />
      </Col>
      <Col w='12'>
        <CreateEditAccountForm isOwnProfile person={person} />
      </Col>
    </>
  );
}
