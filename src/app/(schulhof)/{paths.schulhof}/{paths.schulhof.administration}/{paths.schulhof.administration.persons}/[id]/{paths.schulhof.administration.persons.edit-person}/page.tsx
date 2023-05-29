import { requireLogin } from '#/auth/component';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { notFound } from 'next/navigation';
import { EditPersonForm } from './form';

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

  const teacherCodeSuggestion =
    await context.services.person.generateDefaultTeacherCode(person);

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
        <EditPersonForm
          personId={person.id}
          personRev={person.rev}
          type={person.type}
          firstname={person.firstname}
          lastname={person.lastname}
          gender={person.gender}
          teacherCode={person.teacherCode}
          teacherCodeSuggestion={teacherCodeSuggestion}
        />
      </Col>
    </>
  );
}
