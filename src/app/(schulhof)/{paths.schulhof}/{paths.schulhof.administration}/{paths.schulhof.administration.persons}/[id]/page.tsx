import { PersonDetails } from '#/administration/sections/persons/details';
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
  const context = await requireLogin();

  const person = await context.services.person.getById(params.id);

  if (!person) notFound();

  const account =
    person.accountId === null
      ? null
      : await context.services.account.getById(person.accountId);

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
          ]}
        />
        <Heading size='1'>
          <T
            t='schulhof.administration.sections.persons.details.title'
            args={{
              name: formatName(person),
            }}
          />
        </Heading>
      </Col>
      <Col w='6'>
        <PersonDetails context={context} person={person} account={account} />
      </Col>
    </>
  );
}
