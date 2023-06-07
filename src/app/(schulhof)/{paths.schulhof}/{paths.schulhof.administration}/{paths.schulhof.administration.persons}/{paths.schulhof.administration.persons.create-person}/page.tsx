import { PersonForm } from '#/administration/sections/persons/person-form';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  await requireLogin();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.administration',
            'paths.schulhof.administration.persons',
            'paths.schulhof.administration.persons.create-person',
          ]}
        />
        <Heading
          size='1'
          t='schulhof.administration.sections.persons.create-person.title'
        />
      </Col>
      <Col w='12'>
        <PersonForm person={null} />
      </Col>
    </>
  );
}
