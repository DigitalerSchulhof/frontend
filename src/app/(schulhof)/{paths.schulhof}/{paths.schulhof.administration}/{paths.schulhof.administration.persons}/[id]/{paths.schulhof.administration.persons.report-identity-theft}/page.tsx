import { ReportIdentityTheftForm } from '#/administration/sections/persons/report-identity-theft';
import { requireLogin } from '#/auth/component';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const context = await requireLogin({
    permission: 'schulhof.administration.persons.report-identity-theft',
    context: {
      personId: params.id,
    },
  });

  const person = await context.services.person.getPerson(params.id);

  if (!person) notFound();

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
            'paths.schulhof.administration.persons.report-identity-theft',
          ]}
        />
        <Heading size='1'>
          <T
            t='schulhof.administration.sections.persons.report-identity-theft.title'
            args={{
              name: formatName(person),
            }}
          />
        </Heading>
      </Col>
      <Col w='12'>
        <ReportIdentityTheftForm person={person} />
      </Col>
    </>
  );
}
