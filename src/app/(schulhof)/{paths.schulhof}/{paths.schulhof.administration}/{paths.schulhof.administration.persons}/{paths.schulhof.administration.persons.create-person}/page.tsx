import { CreateEditPersonForm } from '#/administration/sections/persons/create-edit-person';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  await requireLogin('schulhof.administration.persons.create-person');

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
        <CreateEditPersonForm person={null} />
      </Col>
    </>
  );
}
