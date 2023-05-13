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
            {
              segment: 'paths.schulhof.administration.persons',
              href: ['paths.schulhof', 'paths.schulhof.administration'],
            },
            'paths.schulhof.administration.persons.persons',
          ]}
        />
        <Heading size='1' t='schulhof.administration.title' />
      </Col>
    </>
  );
}
