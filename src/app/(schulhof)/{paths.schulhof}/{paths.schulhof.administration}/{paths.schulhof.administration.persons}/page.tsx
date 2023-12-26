import { PersonsTable } from '#/administration/sections/persons/page/table';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Button, createButtonGroup } from '#/ui/Button';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { noPermission } from '#/utils/client';

export default async function Page() {
  const context = await requireLogin(null);

  const mayReadPromise = context.services.permission.hasPermission(
    'schulhof.administration.persons.read'
  );

  const mayCreatePromise = context.services.permission.hasPermission(
    'schulhof.administration.persons.create-person'
  );

  const [mayRead, mayCreate] = await Promise.all([
    mayReadPromise,
    mayCreatePromise,
  ]);

  if (!mayRead && !mayCreate) noPermission();

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
        {mayRead ? (
          <>
            <Heading
              size='2'
              t='schulhof.administration.sections.persons.page.filter.title'
            />
            <PersonsTable formOfAddress={context.formOfAddress} />
          </>
        ) : null}
        {createButtonGroup(
          mayCreate ? (
            <Button
              variant='success'
              t='schulhof.administration.sections.persons.page.buttons.create-person'
              href={[
                'paths.schulhof',
                'paths.schulhof.administration',
                'paths.schulhof.administration.persons',
                'paths.schulhof.administration.persons.create-person',
              ]}
            />
          ) : null
        )}
      </Col>
    </>
  );
}
