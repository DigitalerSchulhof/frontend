import { PersonForm } from '#/administration/sections/persons/person-form';
import { requireLogin } from '#/auth/component';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const context = await requireLogin();

  const person = await context.services.person.getById(params.id);

  if (!person) notFound();

  const formPerson =
    person === null
      ? null
      : {
          id: person.id,
          rev: person.rev,
          type: person.type,
          firstname: person.firstname,
          lastname: person.lastname,
          gender: person.gender,
          teacherCode: person.teacherCode,
        };

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.administration',
            'paths.schulhof.administration.persons',
            {
              title: `{${formatName(person)}}`,
              segment: `{${person.id}}`,
            },
            'paths.schulhof.administration.persons.edit-person',
          ]}
        />
        <Heading size='1'>
          <T
            t='schulhof.administration.sections.persons.edit-person.title'
            args={{
              name: formatName(person),
            }}
          />
        </Heading>
      </Col>
      <Col w='12'>
        <PersonForm person={formPerson} />
      </Col>
    </>
  );
}
