import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { PersonsTable } from './table';

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
          ]}
        />
        <Heading
          size='1'
          t='schulhof.administration.sections.persons.page.title'
        />
      </Col>
      <Col w='12'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.page.filter.title'
        />
        <PersonsTable />
      </Col>
    </>
  );
}
