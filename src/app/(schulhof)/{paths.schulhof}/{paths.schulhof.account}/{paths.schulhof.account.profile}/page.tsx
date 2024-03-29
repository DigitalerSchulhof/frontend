import { PersonDetails } from '#/administration/sections/persons/details';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  const context = await requireLogin({
    permission: 'schulhof.administration.persons.details',
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
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.title' />
      </Col>
      <Col w='6'>
        <PersonDetails context={context} isOwnProfile person={person} />
      </Col>
    </>
  );
}
